package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.CartItemRequest;
import com.localbrand.dto.CartDto;
import com.localbrand.security.UserDetailsImpl;
import com.localbrand.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved", cartService.getCartByUserId(userDetails.getId())));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CartItemRequest cartItemRequest) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addToCart(userDetails.getId(), cartItemRequest)));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam String productId) {
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cartService.removeFromCart(userDetails.getId(), productId)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CartItemRequest cartItemRequest) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cartService.updateCartItemQuantity(userDetails.getId(), cartItemRequest)));
    }
}
