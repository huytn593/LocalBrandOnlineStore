package com.localbrand.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;
    
    @TextIndexed(weight = 3)
    private String name;
    
    @TextIndexed
    private String description;
    
    private double price;
    private int stock;
    
    // Storing Category ID as reference
    @Indexed
    private String categoryId;
    
    private String categoryName;
    
    private List<String> images;
    
    // Rating Fields
    @Indexed
    private double ratingAverage;
    private int ratingCount;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
