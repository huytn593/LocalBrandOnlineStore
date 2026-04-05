package com.localbrand.service;

import com.localbrand.dto.CartDto;
import com.localbrand.dto.OrderRequest;
import com.localbrand.exception.BadRequestException;
import com.localbrand.exception.ResourceNotFoundException;
import com.localbrand.model.*;
import com.localbrand.repository.OrderRepository;
import com.localbrand.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;

    @Transactional
    public Order createOrder(String userId, OrderRequest orderRequest) {
        CartDto cart = cartService.getCartByUserId(userId);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        double totalPrice = 0;
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product not found: " + cartItem.getProductId()));
            
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Not enough stock for product: " + product.getName());
            }
            
            // Deduct stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .productId(cartItem.getProductId())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();
        }).collect(Collectors.toList());

        totalPrice = orderItems.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();

        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .totalPrice(totalPrice)
                .status(OrderStatus.PENDING)
                .shippingAddress(orderRequest.getShippingAddress())
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Clear user cart after successful checkout
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(String id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(status);
        return orderRepository.save(order);
    }
}
