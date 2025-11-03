package com.example.bankapp.config;

import com.example.bankapp.user.User;
import com.example.bankapp.user.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner init(UserService userService) {
        return args -> {
            try {
                User admin = new User();
                admin.setEmail("admin@bank.local");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setAddress("1 Bank Street");
                admin.setPhone("555-0000");
                admin.setSsn7("1234567");
                admin.setRoles("ADMIN,USER");
                userService.register(admin, "Password123!");
            } catch (Exception ignored) {}
        };
    }
}
