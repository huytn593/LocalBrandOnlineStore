package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.ProductRequest;
import com.localbrand.model.Product;
import com.localbrand.service.ProductService;
import com.localbrand.util.FileStorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    // =========================
    // PUBLIC APIs
    // =========================

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "createdAt") String sort) {
        Sort sortObj;

        try {
            sortObj = Sort.by(sort).descending();
        } catch (Exception e) {
            logger.warn("Invalid sort field: {}, fallback to createdAt", sort);
            sortObj = Sort.by("createdAt").descending();
        }

        Pageable pageable = PageRequest.of(page, limit, sortObj);

        Page<Product> products = productService.getAllProducts(
                search, category, minPrice, maxPrice, pageable);

        return ResponseEntity.ok(
                ApiResponse.success("Products retrieved", products));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Product retrieved", product));
    }

    // =========================
    // ADMIN APIs
    // =========================

    @PostMapping("/admin/products")
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @Valid @RequestBody ProductRequest productRequest) {
        logger.info("Creating product: {}", productRequest.getName());

        Product product = productService.createProduct(productRequest);

        return new ResponseEntity<>(
                ApiResponse.success("Product created", product),
                HttpStatus.CREATED);
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest productRequest) {
        logger.info("Updating product ID: {}", id);

        Product updatedProduct = productService.updateProduct(id, productRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Product updated", updatedProduct));
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        logger.info("Deleting product ID: {}", id);

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success("Product deleted", null));
    }

    // =========================
    // UPLOAD IMAGE
    // =========================

    @PostMapping("/admin/products/upload-image")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        logger.info("Uploading image: {}", file.getOriginalFilename());

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File is empty"));
        }

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Only image files are allowed"));
        }

        // Store file
        String fileName = fileStorageService.storeFile(file, "products");
        String fileUrl = fileStorageService.getFileUrl(fileName, "products");

        return ResponseEntity.ok(
                ApiResponse.success("Image uploaded successfully", fileUrl));
    }
}