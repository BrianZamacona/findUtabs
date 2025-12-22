package com.findutabs;

import com.findutabs.config.TestRedisConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestRedisConfig.class)
class FindUtabsApplicationTests {

    @Test
    void contextLoads() {
        // This test verifies that the Spring application context loads successfully
    }

}
