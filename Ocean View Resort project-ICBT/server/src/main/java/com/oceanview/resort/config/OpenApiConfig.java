package com.oceanview.resort.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Ocean View Resort API")
                        .version("v1")
                        .description("REST API for Ocean View Resort backend")
                        .termsOfService("http://oceanview.example.com/terms")
                        .contact(new Contact().name("Ocean View Support").email("support@oceanview.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org"))
                );
    }
}