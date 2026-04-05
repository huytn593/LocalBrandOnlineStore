package com.localbrand.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    
    private String userId;
    
    private List<OrderItem> items;
    
    private double totalPrice;
    
    private OrderStatus status;
    
    private String shippingAddress;
    
    // Payment Details
    private String paymentMethod;
    private String paymentStatus;
    private String paymentTransactionId;
    private LocalDateTime paidAt;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
