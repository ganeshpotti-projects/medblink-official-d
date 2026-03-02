//package com.medBlink.medBlinkAPI.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.web.SecurityFilterChain;
//import static org.springframework.security.config.Customizer.withDefaults;
//
//@Configuration
//@EnableWebSecurity
//@Order(1)
//public class GlobalSecurityConfig {
//
//    @Bean
//    public SecurityFilterChain globalSecurityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .securityMatcher("/api/products/**",
//                        "/api/admin/products/**",
//                        "/api/users/registerUser",
//                        "/api/auth/loginUser",
//                        "/api/orders/getAllOrders",
//                        "/api/orders/updateOrderStatus/**",
//                        "/api/orders/downloadInvoice/**",
//                        "/api/orders/deleteOrder/**",
//                        "/api/contacts/**",
//                        "/api/partners/getAllPartners",
//                        "/api/partners/registerPartner",
//                        "/api/partners/auth/loginPartner",
//                        "/api/partners/updatePartnerStatus/**",
//                        "/ws/**");
//        http.cors(withDefaults())
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()
//                )
//                .csrf(AbstractHttpConfigurer::disable);
//        return http.build();
//    }
//}

package com.medBlink.medBlinkAPI.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@Order(1)
public class GlobalSecurityConfig {

    private final GlobalCorsConfig corsConfig;

    public GlobalSecurityConfig(GlobalCorsConfig corsConfig) {
        this.corsConfig = corsConfig;
    }

    @Bean
    public SecurityFilterChain globalSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/products/**",
                        "/api/admin/products/**",
                        "/api/users/registerUser",
                        "/api/auth/loginUser",
                        "/api/orders/**",
                        "/api/contacts/**",
                        "/api/partners/**",
                        "/ws/**")
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}