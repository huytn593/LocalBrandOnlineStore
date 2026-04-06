package com.localbrand.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private String id;
    private String userId;
    private List<CartItemDto> items;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private String productId;
        private String name;
        private double price;
        private String imageUrl;
        private int quantity;
        private double subTotal;
    }
}
