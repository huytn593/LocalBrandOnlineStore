package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.dto.DashboardStatsResponse;
import com.localbrand.dto.RevenueByMonthResponse;
import com.localbrand.model.Product;
import com.localbrand.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", adminService.getDashboardStats()));
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<ApiResponse<List<RevenueByMonthResponse>>> getRevenueByMonth() {
        return ResponseEntity.ok(ApiResponse.success("Monthly revenue retrieved", adminService.getRevenueByMonth()));
    }

    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<List<Product>>> getTopProducts(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success("Top products retrieved", adminService.getTopProducts(limit)));
    }
}
