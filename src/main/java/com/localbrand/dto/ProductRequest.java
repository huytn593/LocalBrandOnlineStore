package com.localbrand.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;
    
    @Min(value = 0, message = "Price cannot be negative")
    private double price;
    
    @Min(value = 0, message = "Stock cannot be negative")
    private int stock;
    
    @NotBlank(message = "Category ID is required")
    private String categoryId;
    
    private List<String> images;
}
