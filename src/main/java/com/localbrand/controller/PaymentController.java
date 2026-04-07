package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.model.Order;
import com.localbrand.model.OrderStatus;
import com.localbrand.model.PaymentTransaction;
import com.localbrand.repository.OrderRepository;
import com.localbrand.repository.PaymentTransactionRepository;
import com.localbrand.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${vnpay.frontendReturnUrl}")
    private String frontendReturnUrlOverride;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${app.frontend-use-hash-routing:false}")
    private boolean frontendUseHashRouting;

    @Value("${vnpay.frontendReturnPath:/payment-result}")
    private String frontendReturnPath;

    @GetMapping("/create_payment")
    public ResponseEntity<ApiResponse<String>> createPayment(@RequestParam String orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Order not found"));
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Order is not in PENDING state"));
        }

        // Generate VNPAY URL
        String ipAddress = getClientIp(request);
        String url = paymentService.createPaymentUrl(order.getId(), order.getTotalPrice(), ipAddress);

        return ResponseEntity.ok(ApiResponse.success("Payment URL generated", url));
    }

    @GetMapping("/vnpay_return")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        boolean verify = paymentService.verifySignature(fields);

        String orderId = request.getParameter("vnp_TxnRef");
        String vnpAmountStr = request.getParameter("vnp_Amount");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String responseCode = request.getParameter("vnp_ResponseCode");

        String redirectUrl = buildFrontendRedirectUrl(orderId);

        if (!verify) {
            // Invalid Signature
            response.sendRedirect(redirectUrl + "&status=FAILED&message=InvalidSignature");
            return;
        }

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            response.sendRedirect(redirectUrl + "&status=FAILED&message=OrderNotFound");
            return;
        }

        // Verify Amount (VNPAY returns amount * 100)
        double returnedAmount = Double.parseDouble(vnpAmountStr) / 100.0;
        if (order.getTotalPrice() != returnedAmount) {
            response.sendRedirect(redirectUrl + "&status=FAILED&message=InvalidAmount");
            return;
        }

        // Check if already paid
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.DELIVERED) {
            response.sendRedirect(redirectUrl + "&status=SUCCESS&message=AlreadyPaid");
            return;
        }

        if ("00".equals(responseCode)) {
            // Success
            order.setStatus(OrderStatus.PAID);
            order.setPaymentMethod("VNPAY");
            order.setPaymentStatus("SUCCESS");
            order.setPaymentTransactionId(transactionId);
            order.setPaidAt(LocalDateTime.now());
            orderRepository.save(order);

            // Save transaction log
            PaymentTransaction transaction = PaymentTransaction.builder()
                    .orderId(orderId)
                    .gateway("VNPAY")
                    .amount(returnedAmount)
                    .status("SUCCESS")
                    .transactionId(transactionId)
                    .createdAt(LocalDateTime.now())
                    .build();
            paymentTransactionRepository.save(transaction);

            response.sendRedirect(redirectUrl + "&status=SUCCESS");
        } else {
            // Failed
            order.setPaymentStatus("FAILED");
            orderRepository.save(order);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .orderId(orderId)
                    .gateway("VNPAY")
                    .amount(returnedAmount)
                    .status("FAILED")
                    .transactionId(transactionId)
                    .createdAt(LocalDateTime.now())
                    .build();
            paymentTransactionRepository.save(transaction);

            response.sendRedirect(redirectUrl + "&status=FAILED&message=GatewayRejected");
        }
    }

    @GetMapping("/mock-success")
    public void mockSuccess(@RequestParam String orderId, HttpServletResponse response) throws IOException {
        Order order = orderRepository.findById(orderId).orElse(null);
        String redirectUrl = buildFrontendRedirectUrl(orderId);
        
        if (order == null) {
            response.sendRedirect(redirectUrl + "&status=FAILED&message=OrderNotFound");
            return;
        }

        // Check if already paid
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.DELIVERED) {
            response.sendRedirect(redirectUrl + "&status=SUCCESS&message=AlreadyPaid");
            return;
        }

        order.setStatus(OrderStatus.PAID);
        order.setPaymentMethod("VNPAY_MOCK");
        order.setPaymentStatus("SUCCESS");
        order.setPaymentTransactionId("MOCK_" + System.currentTimeMillis());
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .orderId(orderId)
                .gateway("VNPAY_MOCK")
                .amount(order.getTotalPrice())
                .status("SUCCESS")
                .transactionId("MOCK_" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .build();
        paymentTransactionRepository.save(transaction);

        response.sendRedirect(redirectUrl + "&status=SUCCESS");
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";
        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
        }
        return remoteAddr;
    }

    private String buildFrontendRedirectUrl(String orderId) {
        return resolveFrontendReturnUrl() + "?orderId=" + (orderId != null ? orderId : "");
    }

    private String resolveFrontendReturnUrl() {
        if (frontendReturnUrlOverride != null && !frontendReturnUrlOverride.isBlank()) {
            return frontendReturnUrlOverride.trim();
        }

        return joinUrl(frontendBaseUrl, normalizeFrontendReturnPath());
    }

    private String normalizeFrontendReturnPath() {
        String normalizedPath = frontendReturnPath.startsWith("/") ? frontendReturnPath : "/" + frontendReturnPath;

        if (!frontendUseHashRouting || normalizedPath.startsWith("/#/")) {
            return normalizedPath;
        }

        return "/#" + normalizedPath;
    }

    private String joinUrl(String baseUrl, String path) {
        String normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        String normalizedPath = path.startsWith("/") ? path : "/" + path;
        return normalizedBaseUrl + normalizedPath;
    }
}
