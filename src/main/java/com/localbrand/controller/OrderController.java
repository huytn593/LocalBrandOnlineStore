package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.OrderRequest;
import com.localbrand.model.Order;
import com.localbrand.model.OrderStatus;
import com.localbrand.security.UserDetailsImpl;
import com.localbrand.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    // --- User Endpoints ---
    @PostMapping("/api/orders")
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody OrderRequest orderRequest) {
        logger.info("Order created by user: {}", userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Order created", orderService.createOrder(userDetails.getId(), orderRequest)), HttpStatus.CREATED);
    }

    @GetMapping("/api/orders/my")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("User orders retrieved", orderService.getUserOrders(userDetails.getId())));
    }

    // --- Admin Endpoints ---
    @GetMapping("/api/admin/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved", orderService.getAllOrders()));
    }

    @PutMapping("/api/admin/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestParam OrderStatus status) {
        logger.info("Admin updated order ID: {} to status: {}", id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", orderService.updateOrderStatus(id, status)));
    }
}
