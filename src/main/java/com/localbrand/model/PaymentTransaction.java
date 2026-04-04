package com.localbrand.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payment_transactions")
public class PaymentTransaction {

    @Id
    private String id;
    
    private String orderId;
    
    private String gateway; // e.g., "VNPAY"
    
    private double amount;
    
    private String status; // "SUCCESS", "FAILED", "PENDING"
    
    private String transactionId; // Gateway's transaction reference
    
    @CreatedDate
    private LocalDateTime createdAt;
}
