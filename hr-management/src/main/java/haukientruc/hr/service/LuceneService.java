package haukientruc.hr.service;

import haukientruc.hr.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class LuceneService {

    private final String INDEX_DIR = "lucene-index/users";
    private Directory directory;
    private Analyzer analyzer;

    @PostConstruct
    public void init() {
        try {
            java.io.File indexDir = new java.io.File(INDEX_DIR);
            if (!indexDir.exists()) {
                indexDir.mkdirs();
            }
            this.directory = FSDirectory.open(Paths.get(INDEX_DIR));
            this.analyzer = new StandardAnalyzer();
            log.info("Lucene index directory initialized at: {}", INDEX_DIR);
        } catch (IOException e) {
            log.error("Failed to initialize Lucene directory: {}", e.getMessage());
        }
    }

    public void indexUser(User user) {
        if (directory == null || analyzer == null)
            return;
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = createDocument(user);
            // Sử dụng userId làm định danh duy nhất trong index
            Term term = new Term("userId", String.valueOf(user.getUserId()));
            writer.updateDocument(term, doc);
            writer.commit();
            log.info("Indexed user: {}", user.getUsername());
        } catch (IOException e) {
            log.error("Error indexing user", e);
        }
    }

    public void deleteUserIndex(Long userId) {
        if (directory == null || analyzer == null)
            return;
        try (IndexWriter writer = getIndexWriter()) {
            Term term = new Term("userId", String.valueOf(userId));
            writer.deleteDocuments(term);
            writer.commit();
            log.info("Deleted user index for ID: {}", userId);
        } catch (IOException e) {
            log.error("Error deleting user index", e);
        }
    }

    public List<Long> searchUsers(String queryString) {
        List<Long> userIds = new ArrayList<>();
        if (directory == null || analyzer == null || queryString == null || queryString.trim().isEmpty()) {
            return userIds;
        }

        try (IndexReader reader = DirectoryReader.open(directory)) {
            IndexSearcher searcher = new IndexSearcher(reader);

            String[] fields = { "username", "fullName", "email", "phone", "cccd" };
            MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, analyzer);
            parser.setAllowLeadingWildcard(true);

            // Tìm kiếm với wildcard để hỗ trợ tìm một phần
            Query query = parser.parse("*" + queryString.toLowerCase() + "*");

            TopDocs results = searcher.search(query, 100);
            for (ScoreDoc scoreDoc : results.scoreDocs) {
                Document doc = searcher.doc(scoreDoc.doc);
                userIds.add(Long.valueOf(doc.get("userId")));
            }
            log.info("Search for '{}' found {} results", queryString, userIds.size());
        } catch (Exception e) {
            log.warn("Search failed or index not created yet: {}", e.getMessage());
        }
        return userIds;
    }

    private IndexWriter getIndexWriter() throws IOException {
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        config.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        return new IndexWriter(directory, config);
    }

    private Document createDocument(User user) {
        Document doc = new Document();
        doc.add(new StringField("userId", String.valueOf(user.getUserId()), Field.Store.YES));

        // TextField để tìm kiếm toàn văn, StringField để tìm kiếm chính xác
        if (user.getUsername() != null)
            doc.add(new TextField("username", user.getUsername().toLowerCase(), Field.Store.YES));

        if (user.getFullName() != null)
            doc.add(new TextField("fullName", user.getFullName().toLowerCase(), Field.Store.YES));

        if (user.getEmail() != null)
            doc.add(new TextField("email", user.getEmail().toLowerCase(), Field.Store.YES));

        if (user.getPhone() != null)
            doc.add(new TextField("phone", user.getPhone(), Field.Store.YES));

        if (user.getCccd() != null)
            doc.add(new TextField("cccd", user.getCccd(), Field.Store.YES));

        return doc;
    }
}
