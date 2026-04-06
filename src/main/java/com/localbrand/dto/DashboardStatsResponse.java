package com.localbrand.dto;

import com.localbrand.model.Order;
import com.localbrand.model.Product;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalOrders;
    private double totalRevenue;
    private long totalProducts;
    private List<Product> topSellingProducts;
    private List<Order> recentOrders;
}
