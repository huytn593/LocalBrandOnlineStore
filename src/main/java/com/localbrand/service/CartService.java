package com.localbrand.service;

import com.localbrand.dto.CartItemRequest;
import com.localbrand.exception.BadRequestException;
import com.localbrand.dto.CartDto;
import com.localbrand.model.Cart;
import com.localbrand.model.CartItem;
import com.localbrand.model.Product;
import com.localbrand.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CartService {

    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartDto getCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));
        return convertToDto(cart);
    }
    
    private Cart getCartEntityByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));
    }

    private Cart createEmptyCart(String userId) {
        Cart cart = Cart.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .updatedAt(LocalDateTime.now())
                .build();
        return cartRepository.save(cart);
    }

    public CartDto addToCart(String userId, CartItemRequest cartItemRequest) {
        Cart cart = getCartEntityByUserId(userId);
        Product product = productService.getProductById(cartItemRequest.getProductId());

        if (product.getStock() < cartItemRequest.getQuantity()) {
            throw new BadRequestException("Not enough stock for product: " + product.getName());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItemRequest.getQuantity());
            item.setPrice(product.getPrice()); // Update to latest price
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(product.getId())
                    .quantity(cartItemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public CartDto removeFromCart(String userId, String productId) {
        Cart cart = getCartEntityByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cart.setUpdatedAt(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    public CartDto updateCartItemQuantity(String userId, CartItemRequest cartItemRequest) {
        Cart cart = getCartEntityByUserId(userId);
        Product product = productService.getProductById(cartItemRequest.getProductId());

        if (product.getStock() < cartItemRequest.getQuantity()) {
            throw new BadRequestException("Not enough stock for product: " + product.getName());
        }

        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(cartItemRequest.getProductId()))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(cartItemRequest.getQuantity());
                    item.setPrice(product.getPrice());
                });

        cart.setUpdatedAt(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }
    
    public void clearCart(String userId) {
        Cart cart = getCartEntityByUserId(userId);
        cart.getItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private CartDto convertToDto(Cart cart) {
        List<CartDto.CartItemDto> itemDtos = cart.getItems().stream().map(item -> {
            Product product = productService.getProductById(item.getProductId());
            return CartDto.CartItemDto.builder()
                    .productId(item.getProductId())
                    .name(product.getName())
                    .price(item.getPrice())
                    .imageUrl(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : null)
                    .quantity(item.getQuantity())
                    .subTotal(item.getPrice() * item.getQuantity())
                    .build();
        }).collect(Collectors.toList());

        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(itemDtos)
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}
