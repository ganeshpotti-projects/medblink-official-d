//package com.medBlink.medBlinkAPI.config;
//
//import com.medBlink.medBlinkAPI.filters.PartnerJwtAuthenticationFilter;
//import com.medBlink.medBlinkAPI.services.AppPartnerDetailsService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.ProviderManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//
//import java.util.List;
//
//import static org.springframework.security.config.Customizer.withDefaults;
//
//@Configuration
//@EnableWebSecurity
//@Order(3)
//@RequiredArgsConstructor
//public class PartnerSecurityConfig {
//
//    private final PartnerJwtAuthenticationFilter partnerJwtAuthenticationFilter;
//    private final AppPartnerDetailsService appPartnerDetailsService;
//
//    @Bean
//    public SecurityFilterChain partnerSecurityFilterChain(HttpSecurity http) throws Exception {
//        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
//        authBuilder
//                .userDetailsService(appPartnerDetailsService)
//                .passwordEncoder(partnerPasswordEncoder());
//
//        http
//                .securityMatcher("/api/partners/**", "/api/orders/getPartnerOrders")
//                .cors(withDefaults())
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(partnerJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//                .csrf(AbstractHttpConfigurer::disable);
//
//        return http.build();
//    }
//
//    @Bean(name = "partnerAuthenticationManager")
//    public AuthenticationManager partnerAuthenticationManager() throws Exception {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setUserDetailsService(appPartnerDetailsService);
//        provider.setPasswordEncoder(partnerPasswordEncoder());
//        return new ProviderManager(provider);
//    }
//
//    @Bean(name = "partnerPasswordEncoder")
//    public PasswordEncoder partnerPasswordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public CorsFilter partnerCorsFilter() {
//        return new CorsFilter(partnerCorsConfigurationSource());
//    }
//
//    private UrlBasedCorsConfigurationSource partnerCorsConfigurationSource() {
//        CorsConfiguration config= new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:30081", "http://localhost:30082", "http://localhost:30083", "http://localhost:30084"));
//        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"));
//        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//        config.setAllowCredentials(true);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//}
package com.medBlink.medBlinkAPI.config;

import com.medBlink.medBlinkAPI.filters.PartnerJwtAuthenticationFilter;
import com.medBlink.medBlinkAPI.services.AppPartnerDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@Order(3)
public class PartnerSecurityConfig {

    private final PartnerJwtAuthenticationFilter partnerJwtAuthenticationFilter;
    private final AppPartnerDetailsService appPartnerDetailsService;
    private final GlobalCorsConfig corsConfig;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain partnerSecurityFilterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(appPartnerDetailsService).passwordEncoder(passwordEncoder);

        http
                .securityMatcher("/api/partners/**", "/api/orders/getPartnerOrders")
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/partners/auth/loginPartner", 
                                         "/api/partners/registerPartner",
                                         "/api/partners/getAllPartners",
                                         "/api/partners/updatePartnerStatus/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(partnerJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    public AuthenticationManager partnerAuthenticationManager(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appPartnerDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }
}