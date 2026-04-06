package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.AuthResponse;
import com.localbrand.dto.LoginRequest;
import com.localbrand.dto.RegisterRequest;
import com.localbrand.dto.VerifyRequest;
import com.localbrand.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("New registration attempt: {}", registerRequest.getEmail());
        String response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success(response, null));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyRequest verifyRequest) {
        String response = authService.verifyEmail(verifyRequest);
        return ResponseEntity.ok(ApiResponse.success(response, null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt: {}", loginRequest.getEmail());
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }
}
