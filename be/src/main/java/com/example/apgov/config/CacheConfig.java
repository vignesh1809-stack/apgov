package com.example.apgov.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // In-memory high performance L1 cache for master data and reference lists
        return new ConcurrentMapCacheManager(
                "villagesList",
                "categoriesList",
                "mlaKpisSummary"
        );
    }
}
