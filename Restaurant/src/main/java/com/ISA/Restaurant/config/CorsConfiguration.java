package com.ISA.Restaurant.config;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class CorsConfiguration {
    private static final String GET = "GET";
    private static final String POST = "POST";
    private static final String PUT = "PUT";
    private static final String DELETE = "DELETE";

    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods(GET, POST, PUT, DELETE)
                        .allowedOriginPatterns("*")
                        .allowCredentials(true)
                        .allowedHeaders("*");

            }
        };
    }
}
