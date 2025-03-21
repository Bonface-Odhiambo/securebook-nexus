
package com.biblios.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.biblios"})
@EntityScan(basePackages = {"com.biblios.model"})
@EnableJpaRepositories(basePackages = {"com.biblios.repository"})
public class BibliosApplication {

    public static void main(String[] args) {
        SpringApplication.run(BibliosApplication.class, args);
    }
}
