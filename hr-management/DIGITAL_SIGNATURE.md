# Cryptographic PDF Digital Signature

## Overview

This feature adds real cryptographic PDF signing (PKCS#7) to the personnel request approval workflow. When the Principal approves a request, the system automatically generates a PDF document and signs it with a digital certificate, making it tamper-proof and verifiable.

## How It Works

### Signing Flow

1. Principal clicks "Approve" on a personnel request
2. System generates a PDF containing request details (title, type, requester, content, approval notes, signature date)
3. PDF is cryptographically signed using a PKCS#7 detached signature (SHA256withRSA)
4. Signed PDF is stored in the database (`personnel_requests.signed_pdf_data`)
5. If signing fails, the entire approval is rolled back (transactional)

### Verification

Anyone can upload a signed PDF to the verification endpoint. The system extracts the embedded signature, verifies it against the certificate, and returns whether the document has been tampered with.

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Apache PDFBox | 2.0.31 | PDF digital signature embedding |
| BouncyCastle (bcprov) | 1.78.1 | Cryptographic operations |
| BouncyCastle (bcpkix) | 1.78.1 | PKCS#7/CMS signature generation |

## Configuration

All settings are in `application.properties` with sensible defaults:

```properties
signing.keystore.path=keystore/hr-signing.p12
signing.keystore.password=changeit
signing.key.alias=hr-signer
```

### Auto-Generated Keystore

On first startup, if `keystore/hr-signing.p12` does not exist, the system automatically:

1. Generates an RSA 2048-bit key pair
2. Creates a self-signed X.509 certificate (valid 10 years)
   - Subject: `CN=HR Management System, O=University, C=VN`
3. Saves to a PKCS12 keystore at the configured path

No manual configuration is needed. The `keystore/` directory is in `.gitignore` to prevent committing private keys.

### Using Your Own Certificate

To use a certificate from a real CA, replace the auto-generated keystore:

```properties
signing.keystore.path=path/to/your-cert.p12
signing.keystore.password=your-password
signing.key.alias=your-alias
```

## API Endpoints

### Download Signed PDF

```
GET /api/personnel-requests/{id}/signed-pdf
```

Returns the cryptographically signed PDF for an approved request.

**Response:**
- `200 OK` with `application/pdf` body
- `404 Not Found` if no signed PDF exists

### Verify a Signed PDF

```
POST /api/personnel-requests/verify-signature
Content-Type: multipart/form-data

file: <PDF file>
```

Uploads a PDF and verifies its cryptographic signature.

**Response (200 OK):**
```json
{
  "valid": true,
  "message": "Signature is valid",
  "signerName": "CN=HR Management System,O=University,C=VN",
  "signDate": "2026-03-04T10:30:00.000+00:00",
  "reason": "Personnel Request Approval"
}
```

**If tampered or unsigned:**
```json
{
  "valid": false,
  "message": "Signature verification failed",
  "signerName": null,
  "signDate": null,
  "reason": null
}
```

## Files Changed

| File | Change |
|------|--------|
| `pom.xml` | Added PDFBox + BouncyCastle dependencies |
| `PersonnelRequest.java` | Added `signedPdfData` (byte[]) field |
| `PersonnelRequestDTO.java` | Added `hasSignedPdf` (boolean) field |
| `DigitalSignatureService.java` | **New** - keystore management, PDF signing, PDF verification |
| `SignatureVerificationResult.java` | **New** - verification response DTO |
| `ReportService.java` | Added `generatePersonnelRequestPdf()` method |
| `PersonnelRequestService.java` | Integrated signing into `approveByPrincipal()`, added `getRequestEntity()` |
| `PersonnelRequestController.java` | Added `/signed-pdf` and `/verify-signature` endpoints |
| `application.properties` | Added signing config properties |
| `.gitignore` | Added `keystore/` |

## Notes

- **Self-signed certificate warning**: When opening a signed PDF in Adobe Acrobat, a yellow warning ("signature validity is unknown") is expected for self-signed certificates. The cryptographic verification endpoint provides programmatic verification regardless.
- **Storage**: Signed PDFs are stored as `BYTEA` in PostgreSQL (typically 50-200 KB per document).
- **Thread safety**: The keystore is loaded once at startup and is read-only, so concurrent signing is safe.
