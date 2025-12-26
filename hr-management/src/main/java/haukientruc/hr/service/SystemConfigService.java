package haukientruc.hr.service;

import haukientruc.hr.entity.SystemConfig;
import haukientruc.hr.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository repository;

    public Map<String, String> getAllConfigs() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SystemConfig::getConfigKey, SystemConfig::getConfigValue));
    }

    @Transactional
    public void updateConfigs(Map<String, String> configs) {
        configs.forEach((key, value) -> {
            SystemConfig config = repository.findByConfigKey(key)
                    .orElse(SystemConfig.builder().configKey(key).build());
            config.setConfigValue(value);
            repository.save(config);
        });
    }

    public String getConfig(String key, String defaultValue) {
        return repository.findByConfigKey(key)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }
}
