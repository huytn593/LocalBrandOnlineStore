package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.ReviewRequest;
import com.localbrand.model.Review;
import com.localbrand.security.UserDetailsImpl;
import com.localbrand.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // --- Public read endpoints ---
    @GetMapping("/api/products/{id}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviewService.getProductReviews(id)));
    }

    // --- User endpoints ---
    @PostMapping("/api/reviews")
    public ResponseEntity<ApiResponse<Review>> createReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        return new ResponseEntity<>(ApiResponse.success("Review created", reviewService.createReview(userDetails.getId(), reviewRequest)), HttpStatus.CREATED);
    }
}
