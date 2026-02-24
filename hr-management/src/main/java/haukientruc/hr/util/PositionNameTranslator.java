package haukientruc.hr.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Utility class to translate English position/role names to Vietnamese
 * Ensures consistent Vietnamese display across the application
 */
public class PositionNameTranslator {

    private static final Map<String, String> TRANSLATION_MAP = new HashMap<>();

    static {
        // Position translations
        TRANSLATION_MAP.put("Faculty Head", "Trưởng khoa");
        TRANSLATION_MAP.put("FACULTY HEAD", "Trưởng khoa");
        TRANSLATION_MAP.put("Dean", "Trưởng khoa");
        TRANSLATION_MAP.put("Vice Dean", "Phó khoa");
        TRANSLATION_MAP.put("Vice Faculty Head", "Phó khoa");
        TRANSLATION_MAP.put("Lecturer", "Giảng viên");
        TRANSLATION_MAP.put("LECTURER", "Giảng viên");
        TRANSLATION_MAP.put("Teacher", "Giảng viên");
        TRANSLATION_MAP.put("Professor", "Giáo sư");
        TRANSLATION_MAP.put("PROFESSOR", "Giáo sư");
        TRANSLATION_MAP.put("Associate Professor", "Phó giáo sư");
        TRANSLATION_MAP.put("Doctor", "Tiến sĩ");
        TRANSLATION_MAP.put("PhD", "Tiến sĩ");
        TRANSLATION_MAP.put("Master", "Thạc sĩ");
        TRANSLATION_MAP.put("Department Head", "Trưởng bộ môn");
        TRANSLATION_MAP.put("Vice Principal", "Phó hiệu trưởng");
        TRANSLATION_MAP.put("Principal", "Hiệu trưởng");
        TRANSLATION_MAP.put("PRINCIPAL", "Hiệu trưởng");
        TRANSLATION_MAP.put("Teaching Assistant", "Trợ lý giảng dạy");
        TRANSLATION_MAP.put("Researcher", "Nghiên cứu viên");
    }

    /**
     * Translate English position name to Vietnamese
     * 
     * @param englishName English position name
     * @return Vietnamese translation if exists, otherwise returns original
     */
    public static String translate(String englishName) {
        if (englishName == null || englishName.trim().isEmpty()) {
            return englishName;
        }

        // Try exact match first
        String translated = TRANSLATION_MAP.get(englishName.trim());
        if (translated != null) {
            return translated;
        }

        // Try case-insensitive match
        for (Map.Entry<String, String> entry : TRANSLATION_MAP.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(englishName.trim())) {
                return entry.getValue();
            }
        }

        // If no translation found, return original
        return englishName;
    }

    /**
     * Check if a name is in English (needs translation)
     * 
     * @param name Position name to check
     * @return true if it's likely an English name
     */
    public static boolean isEnglish(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return TRANSLATION_MAP.containsKey(name.trim()) ||
                TRANSLATION_MAP.keySet().stream()
                        .anyMatch(key -> key.equalsIgnoreCase(name.trim()));
    }
}
