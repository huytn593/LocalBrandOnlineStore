package com.localbrand.config;

import com.localbrand.model.Category;
import com.localbrand.model.Role;
import com.localbrand.model.User;
import com.localbrand.repository.CategoryRepository;
import com.localbrand.repository.ProductRepository;
import com.localbrand.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@SuppressWarnings("null")
public class DataInitializerConfig {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                    CategoryRepository categoryRepository,
                                    ProductRepository productRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@localbrand.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .name("System Administrator")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .isVerified(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(admin);
                System.out.println("Default Admin User Created.");
            }

            // --- Migration and Default Category ---
            String defaultCatName = "Bestsellers";
            Category defaultCat = categoryRepository.findByName(defaultCatName).orElseGet(() -> {
                Category cat = Category.builder()
                        .name(defaultCatName)
                        .description("Recommended products")
                        .createdAt(LocalDateTime.now())
                        .build();
                Category saved = categoryRepository.save(cat);
                System.out.println("Default Category 'Bestsellers' created.");
                return saved;
            });

            // Migrate products that don't have categoryName
            productRepository.findAll().forEach(product -> {
                if (product.getCategoryName() == null || product.getCategoryId() == null) {
                    product.setCategoryId(defaultCat.getId());
                    product.setCategoryName(defaultCat.getName());
                    productRepository.save(product);
                    System.out.println("Migrated product: " + product.getName());
                }
            });
        };
    }
}
