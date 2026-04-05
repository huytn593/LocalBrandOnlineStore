package com.localbrand.service;

import com.localbrand.dto.ReviewRequest;
import com.localbrand.exception.BadRequestException;
import com.localbrand.model.Order;
import com.localbrand.model.Product;
import com.localbrand.model.Review;
import com.localbrand.repository.OrderRepository;
import com.localbrand.repository.ProductRepository;
import com.localbrand.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public List<Review> getProductReviews(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Transactional
    public Review createReview(String userId, ReviewRequest reviewRequest) {
        Product product = productRepository.findById(reviewRequest.getProductId())
                .orElseThrow(() -> new BadRequestException("Product not found"));

        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(userId,
                reviewRequest.getProductId());
        if (existingReview.isPresent()) {
            throw new BadRequestException("Bạn đã đánh giá sản phẩm này rồi.");
        }

        // Verify user has ordered the product
        List<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        boolean hasPurchased = userOrders.stream()
                .filter(order -> order.getStatus() == com.localbrand.model.OrderStatus.DELIVERED)
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> item.getProductId().equals(reviewRequest.getProductId()));

        // For testing/development often it is easier to just allow if requested, but
        // requirements say "Users can review purchased products." we can relax if not
        // strictly required
        // But let's keep the business logic strict
        if (!hasPurchased) {
            throw new BadRequestException("Bạn chỉ có thể đánh giá sản phẩm đã mua.");
        }

        Review review = Review.builder()
                .userId(userId)
                .productId(product.getId())
                .rating(reviewRequest.getRating())
                .comment(reviewRequest.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update Product Rating
        double oldAverage = product.getRatingAverage();
        int count = product.getRatingCount();

        double newAverage = ((oldAverage * count) + review.getRating()) / (count + 1);

        product.setRatingAverage(newAverage);
        product.setRatingCount(count + 1);
        productRepository.save(product);

        return savedReview;
    }
}
