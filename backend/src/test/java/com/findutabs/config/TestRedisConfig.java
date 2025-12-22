package com.findutabs.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import static org.mockito.Mockito.mock;

/**
 * Test configuration to mock Redis beans for testing without Redis server.
 */
@TestConfiguration
public class TestRedisConfig {

    @Bean
    @Primary
    public RedisConnectionFactory redisConnectionFactory() {
        return mock(RedisConnectionFactory.class);
    }

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate() {
        return mock(RedisTemplate.class);
    }
}
