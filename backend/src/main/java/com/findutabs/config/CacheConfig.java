package com.findutabs.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis Cache configuration.
 *
 * WHY REDIS CACHE?
 * ─────────────────
 * The API receives many repeated reads for the same data (e.g., a popular tab page
 * is visited hundreds of times per minute). Without cache, each request hits PostgreSQL,
 * which under load causes high DB CPU, slow responses, and risk of connection pool exhaustion.
 *
 * Redis sits in RAM and responds in ~0.5ms vs ~30-50ms for PostgreSQL.
 * For a tab platform, the most common pattern is: write once, read many times.
 *
 * HOW IT WORKS:
 * ─────────────
 * @Cacheable("tabs::detail")  → First call hits DB and stores result in Redis.
 *                                Subsequent calls with same key return the cached value directly.
 *
 * @CacheEvict(...)            → When a tab is updated or deleted, remove its cached entry
 *                                so the next read fetches fresh data from DB.
 *
 * CACHE KEYS AND TTLs:
 * ─────────────────────
 * "tabs::detail"   — TTL 10 min — individual tab by id, changes rarely
 * "tabs::page"     — TTL 3 min  — paginated browse results, changes when new tabs are created
 * "users::profile" — TTL 15 min — user profile, almost never changes
 * "transcriptions" — TTL 2 min  — transcription status changes (PENDING→DONE), short TTL
 *
 * IMPORTANT: Do NOT cache write operations (POST, PUT, DELETE).
 *            Always use @CacheEvict on mutations to keep data consistent.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String CACHE_TABS_DETAIL = "tabs::detail";
    public static final String CACHE_TABS_PAGE   = "tabs::page";
    public static final String CACHE_USERS        = "users::profile";
    public static final String CACHE_TRANSCRIPTIONS = "transcriptions";

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(jsonSerializer))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // Individual tab — high read, low write. 10 min is safe.
        cacheConfigs.put(CACHE_TABS_DETAIL,
                defaultConfig.entryTtl(Duration.ofMinutes(10)));

        // Browse pages — updated when tabs are created/deleted. 3 min.
        cacheConfigs.put(CACHE_TABS_PAGE,
                defaultConfig.entryTtl(Duration.ofMinutes(3)));

        // User profiles — rarely change. 15 min.
        cacheConfigs.put(CACHE_USERS,
                defaultConfig.entryTtl(Duration.ofMinutes(15)));

        // Transcription status changes frequently. 2 min TTL.
        cacheConfigs.put(CACHE_TRANSCRIPTIONS,
                defaultConfig.entryTtl(Duration.ofMinutes(2)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig.entryTtl(Duration.ofMinutes(5)))
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}
