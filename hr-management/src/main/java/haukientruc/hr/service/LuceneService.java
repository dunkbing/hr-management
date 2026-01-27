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

    private final String INDEX_DIR = "lucene-index/master";
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

    private IndexWriter getIndexWriter() throws IOException {
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        config.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        return new IndexWriter(directory, config);
    }

    private String getDocId(String entityType, String id) {
        return entityType + "_" + id;
    }

    public void deleteEntityIndex(String entityType, String entityId) {
        if (directory == null || analyzer == null)
            return;
        try (IndexWriter writer = getIndexWriter()) {
            // Delete by unique docId is safer and faster
            Term term = new Term("docId", getDocId(entityType, entityId));
            writer.deleteDocuments(term);

            // Fallback: cleaning up old indices that might not have docId yet (using broad
            // query)
            // ensuring we don't leave ghosts if migration happens
            BooleanQuery.Builder fallbackQuery = new BooleanQuery.Builder();
            fallbackQuery.add(new TermQuery(new Term("entityType", entityType)), BooleanClause.Occur.MUST);
            fallbackQuery.add(new TermQuery(new Term("id", entityId)), BooleanClause.Occur.MUST);
            writer.deleteDocuments(fallbackQuery.build());

            writer.commit();
            log.info("Deleted {} index for ID: {}", entityType, entityId);
        } catch (IOException e) {
            log.error("Error deleting index", e);
        }
    }

    public List<Long> searchEntities(String entityType, String queryString, String[] fields) {
        List<Long> ids = new ArrayList<>();
        if (directory == null || analyzer == null || queryString == null || queryString.trim().isEmpty()) {
            return ids;
        }

        try (IndexReader reader = DirectoryReader.open(directory)) {
            IndexSearcher searcher = new IndexSearcher(reader);

            BooleanQuery.Builder mainQuery = new BooleanQuery.Builder();
            mainQuery.add(new TermQuery(new Term("entityType", entityType)), BooleanClause.Occur.MUST);

            MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, analyzer);
            parser.setAllowLeadingWildcard(true); // Expensive but needed for infix search
            Query textQuery = parser.parse("*" + queryString.toLowerCase() + "*");

            mainQuery.add(textQuery, BooleanClause.Occur.MUST);

            TopDocs results = searcher.search(mainQuery.build(), 100);
            for (ScoreDoc scoreDoc : results.scoreDocs) {
                Document doc = searcher.doc(scoreDoc.doc);
                String idStr = doc.get("id");
                if (idStr != null) {
                    ids.add(Long.valueOf(idStr));
                }
            }
        } catch (Exception e) {
            log.warn("Search failed for type {}: {}", entityType, e.getMessage());
        }
        return ids;
    }

    // ===== USER INDEXING =====
    public void indexUser(haukientruc.hr.entity.User user) {
        if (directory == null)
            return;
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = new Document();
            String docId = getDocId("user", String.valueOf(user.getUserId()));

            doc.add(new StringField("docId", docId, Field.Store.YES));
            doc.add(new StringField("entityType", "user", Field.Store.YES));
            doc.add(new StringField("id", String.valueOf(user.getUserId()), Field.Store.YES));

            if (user.getUsername() != null)
                doc.add(new TextField("username", user.getUsername().toLowerCase(), Field.Store.YES));
            if (user.getFullName() != null)
                doc.add(new TextField("fullName", user.getFullName().toLowerCase(), Field.Store.YES));
            if (user.getEmail() != null)
                doc.add(new TextField("email", user.getEmail().toLowerCase(), Field.Store.YES));
            if (user.getPhone() != null)
                doc.add(new TextField("phone", user.getPhone(), Field.Store.YES));

            writer.updateDocument(new Term("docId", docId), doc);
            writer.commit();
        } catch (IOException e) {
            log.error("Error indexing user", e);
        }
    }

    public List<Long> searchUsers(String query) {
        return searchEntities("user", query, new String[] { "username", "fullName", "email", "phone" });
    }

    // ===== FACULTY INDEXING =====
    public void indexFaculty(haukientruc.hr.entity.Faculty faculty) {
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = new Document();
            String docId = getDocId("faculty", String.valueOf(faculty.getId()));

            doc.add(new StringField("docId", docId, Field.Store.YES));
            doc.add(new StringField("entityType", "faculty", Field.Store.YES));
            doc.add(new StringField("id", String.valueOf(faculty.getId()), Field.Store.YES));

            if (faculty.getCode() != null)
                doc.add(new TextField("code", faculty.getCode().toLowerCase(), Field.Store.YES));
            if (faculty.getName() != null)
                doc.add(new TextField("name", faculty.getName().toLowerCase(), Field.Store.YES));

            writer.updateDocument(new Term("docId", docId), doc);
            writer.commit();
        } catch (IOException e) {
            log.error("Error indexing faculty", e);
        }
    }

    // ===== DEPARTMENT INDEXING =====
    public void indexDepartment(haukientruc.hr.entity.Department dept) {
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = new Document();
            String docId = getDocId("department", String.valueOf(dept.getId()));

            doc.add(new StringField("docId", docId, Field.Store.YES));
            doc.add(new StringField("entityType", "department", Field.Store.YES));
            doc.add(new StringField("id", String.valueOf(dept.getId()), Field.Store.YES));

            if (dept.getDepartmentCode() != null)
                doc.add(new TextField("code", dept.getDepartmentCode().toLowerCase(), Field.Store.YES));
            if (dept.getDepartmentName() != null)
                doc.add(new TextField("name", dept.getDepartmentName().toLowerCase(), Field.Store.YES));

            writer.updateDocument(new Term("docId", docId), doc);
            writer.commit();
        } catch (IOException e) {
            log.error("Error indexing department", e);
        }
    }

    // ===== POSITION INDEXING =====
    public void indexPosition(haukientruc.hr.entity.Position pos) {
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = new Document();
            String docId = getDocId("position", String.valueOf(pos.getId()));

            doc.add(new StringField("docId", docId, Field.Store.YES));
            doc.add(new StringField("entityType", "position", Field.Store.YES));
            doc.add(new StringField("id", String.valueOf(pos.getId()), Field.Store.YES));

            if (pos.getCode() != null)
                doc.add(new TextField("code", pos.getCode().toLowerCase(), Field.Store.YES));
            if (pos.getName() != null)
                doc.add(new TextField("name", pos.getName().toLowerCase(), Field.Store.YES));

            writer.updateDocument(new Term("docId", docId), doc);
            writer.commit();
        } catch (IOException e) {
            log.error("Error indexing position", e);
        }
    }

    // ===== PERSONNEL REQUEST INDEXING =====
    public void indexPersonnelRequest(haukientruc.hr.entity.PersonnelRequest req) {
        try (IndexWriter writer = getIndexWriter()) {
            Document doc = new Document();
            String docId = getDocId("request", String.valueOf(req.getId()));

            doc.add(new StringField("docId", docId, Field.Store.YES));
            doc.add(new StringField("entityType", "request", Field.Store.YES));
            doc.add(new StringField("id", String.valueOf(req.getId()), Field.Store.YES));

            if (req.getTitle() != null)
                doc.add(new TextField("title", req.getTitle().toLowerCase(), Field.Store.YES));
            if (req.getContent() != null)
                doc.add(new TextField("content", req.getContent().toLowerCase(), Field.Store.YES));
            if (req.getRequester() != null && req.getRequester().getFullName() != null)
                doc.add(new TextField("requester", req.getRequester().getFullName().toLowerCase(), Field.Store.YES));

            writer.updateDocument(new Term("docId", docId), doc);
            writer.commit();
        } catch (IOException e) {
            log.error("Error indexing request", e);
        }
    }
}
