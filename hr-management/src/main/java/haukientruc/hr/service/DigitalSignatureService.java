package haukientruc.hr.service;

import haukientruc.hr.dto.SignatureVerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.util.Store;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import javax.security.auth.x500.X500Principal;
import java.io.*;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
public class DigitalSignatureService {

    @Value("${signing.keystore.path:keystore/hr-signing.p12}")
    private String keystorePath;

    @Value("${signing.keystore.password:changeit}")
    private String keystorePassword;

    @Value("${signing.key.alias:hr-signer}")
    private String keyAlias;

    private KeyStore keyStore;

    @PostConstruct
    public void init() {
        Security.addProvider(new BouncyCastleProvider());
        loadOrCreateKeystore();
    }

    private void loadOrCreateKeystore() {
        try {
            File ksFile = new File(keystorePath);
            if (ksFile.exists()) {
                keyStore = KeyStore.getInstance("PKCS12");
                try (FileInputStream fis = new FileInputStream(ksFile)) {
                    keyStore.load(fis, keystorePassword.toCharArray());
                }
                log.info("Loaded existing keystore from {}", keystorePath);
            } else {
                generateSelfSignedKeystore(ksFile);
                log.info("Generated new self-signed keystore at {}", keystorePath);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize keystore", e);
        }
    }

    private void generateSelfSignedKeystore(File ksFile) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair keyPair = kpg.generateKeyPair();

        X500Principal subject = new X500Principal("CN=HR Management System, O=University, C=VN");
        Instant now = Instant.now();

        X509CertificateHolder certHolder = new JcaX509v3CertificateBuilder(
                subject,
                BigInteger.valueOf(System.currentTimeMillis()),
                Date.from(now),
                Date.from(now.plus(3650, ChronoUnit.DAYS)),
                subject,
                keyPair.getPublic()
        ).build(new JcaContentSignerBuilder("SHA256withRSA")
                .setProvider("BC")
                .build(keyPair.getPrivate()));

        X509Certificate cert = new JcaX509CertificateConverter()
                .setProvider("BC")
                .getCertificate(certHolder);

        keyStore = KeyStore.getInstance("PKCS12");
        keyStore.load(null, null);
        keyStore.setKeyEntry(keyAlias, keyPair.getPrivate(),
                keystorePassword.toCharArray(), new Certificate[]{cert});

        ksFile.getParentFile().mkdirs();
        try (FileOutputStream fos = new FileOutputStream(ksFile)) {
            keyStore.store(fos, keystorePassword.toCharArray());
        }
    }

    public byte[] signPdf(byte[] unsignedPdf) throws Exception {
        PrivateKey privateKey = (PrivateKey) keyStore.getKey(keyAlias,
                keystorePassword.toCharArray());
        Certificate[] certChain = keyStore.getCertificateChain(keyAlias);

        PDDocument document = PDDocument.load(unsignedPdf);

        PDSignature signature = new PDSignature();
        signature.setFilter(PDSignature.FILTER_ADOBE_PPKLITE);
        signature.setSubFilter(PDSignature.SUBFILTER_ADBE_PKCS7_DETACHED);
        signature.setName("HR Management System");
        signature.setReason("Personnel Request Approval");
        signature.setSignDate(Calendar.getInstance());

        SignatureInterface signatureInterface = content -> {
            CMSSignedDataGenerator gen = new CMSSignedDataGenerator();
            ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
                    .setProvider("BC")
                    .build(privateKey);
            gen.addSignerInfoGenerator(
                    new JcaSignerInfoGeneratorBuilder(
                            new JcaDigestCalculatorProviderBuilder()
                                    .setProvider("BC")
                                    .build())
                            .build(signer, (X509Certificate) certChain[0]));
            gen.addCertificates(new JcaCertStore(Arrays.asList(certChain)));

            CMSTypedData cmsData = new CMSProcessableByteArray(content.readAllBytes());
            CMSSignedData signedData = gen.generate(cmsData, false);
            return signedData.getEncoded();
        };

        document.addSignature(signature, signatureInterface);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.saveIncremental(out);
        document.close();
        return out.toByteArray();
    }

    public SignatureVerificationResult verifyPdf(byte[] signedPdf) {
        try (PDDocument document = PDDocument.load(signedPdf)) {
            List<PDSignature> signatures = document.getSignatureDictionaries();

            if (signatures.isEmpty()) {
                return new SignatureVerificationResult(false, "No signatures found in PDF", null, null, null);
            }

            PDSignature sig = signatures.get(0);

            byte[] signedContent = sig.getSignedContent(new ByteArrayInputStream(signedPdf));
            byte[] signatureBytes = sig.getContents(new ByteArrayInputStream(signedPdf));

            CMSSignedData cmsSignedData = new CMSSignedData(
                    new CMSProcessableByteArray(signedContent), signatureBytes);

            SignerInformationStore signers = cmsSignedData.getSignerInfos();
            @SuppressWarnings("unchecked")
            Store<X509CertificateHolder> certStore = cmsSignedData.getCertificates();

            for (SignerInformation signerInfo : signers.getSigners()) {
                @SuppressWarnings("unchecked")
                Collection<X509CertificateHolder> certs = certStore.getMatches(signerInfo.getSID());
                X509CertificateHolder certHolder = certs.iterator().next();

                boolean valid = signerInfo.verify(
                        new JcaSimpleSignerInfoVerifierBuilder()
                                .setProvider("BC")
                                .build(certHolder));

                if (valid) {
                    return new SignatureVerificationResult(
                            true,
                            "Signature is valid",
                            certHolder.getSubject().toString(),
                            sig.getSignDate() != null ? sig.getSignDate().getTime() : null,
                            sig.getReason()
                    );
                }
            }

            return new SignatureVerificationResult(false, "Signature verification failed", null, null, null);
        } catch (Exception e) {
            log.error("Error verifying PDF signature", e);
            return new SignatureVerificationResult(false, "Verification error: " + e.getMessage(), null, null, null);
        }
    }
}
