//package com.ISA.Restaurant.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpHeaders;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//
//@Configuration
//@EnableWebSecurity
//public class WebSecurityConfiguration {
//
//    private final JwtAuthenticationEntryPoint unauthorizedHandler;
//
//    // Constructor injection (since @Autowired is not needed on fields anymore)
//    public WebSecurityConfiguration(JwtAuthenticationEntryPoint unauthorizedHandler) {
//        this.unauthorizedHandler = unauthorizedHandler;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.cors().and().csrf().disable()
//                .authorizeRequests()
//                .requestMatchers(request -> HttpHeaders.ALLOW.equals(request.getHeader(HttpHeaders.ALLOW))).permitAll()  // Allow the ALLOW header for CORS
//                .anyRequest().authenticated()  // Require authentication for all other requests
//                .and()
//                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler)  // Custom entry point for unauthorized access
//                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);  // Stateless sessions for JWT authentication
//
//        return http.build();
//    }
//
//    // Define AuthenticationManager bean explicitly
//    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//        return http.getSharedObject(AuthenticationManagerBuilder.class)
//                .build();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();  // BCrypt for password encoding
//    }
//}
