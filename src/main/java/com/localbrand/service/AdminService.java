package com.localbrand.service;

import com.localbrand.dto.DashboardStatsResponse;
import com.localbrand.dto.RevenueByMonthResponse;
import com.localbrand.model.Order;
import com.localbrand.model.OrderItem;
import com.localbrand.model.OrderStatus;
import com.localbrand.model.Product;
import com.localbrand.repository.OrderRepository;
import com.localbrand.repository.ProductRepository;
import com.localbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        // Calculate total revenue from delivered/completed orders, or all depending on business needs. Here we use all non-cancelled.
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        double totalRevenue = validOrders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
                
        // recent orders
        Page<Order> recentOrdersPage = orderRepository.findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()));

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .topSellingProducts(getTopProducts(5))
                .recentOrders(recentOrdersPage.getContent())
                .build();
    }

    public List<RevenueByMonthResponse> getRevenueByMonth() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<String, Double> revenueMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Order order : validOrders) {
            String month = order.getCreatedAt().format(formatter);
            revenueMap.put(month, revenueMap.getOrDefault(month, 0.0) + order.getTotalPrice());
        }

        List<RevenueByMonthResponse> responseList = new ArrayList<>();
        revenueMap.forEach((month, revenue) -> responseList.add(new RevenueByMonthResponse(month, revenue)));

        // Optionally sort by month string
        responseList.sort((a, b) -> a.getMonth().compareTo(b.getMonth()));

        return responseList;
    }

    public List<Product> getTopProducts(int limit) {
        // Find top selling products by aggregating order items
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<String, Integer> productSales = new HashMap<>();

        for (Order order : validOrders) {
            for (OrderItem item : order.getItems()) {
                productSales.put(item.getProductId(), 
                    productSales.getOrDefault(item.getProductId(), 0) + item.getQuantity());
            }
        }

        // Sort by sales count descending and limit
        List<String> topProductIds = productSales.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<Product> topProducts = new ArrayList<>();
        for (String id : topProductIds) {
            productRepository.findById(id).ifPresent(topProducts::add);
        }

        return topProducts;
    }
}
