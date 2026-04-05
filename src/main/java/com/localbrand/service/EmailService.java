package com.localbrand.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("huytn593@gmail.com");
        message.setTo(toEmail);
        message.setSubject("LocalBrandOnlineStore - Verification OTP");
        message.setText("Your OTP for account verification is: " + otp + "\n\nThis OTP will expire in 5 minutes.");
        mailSender.send(message);
    }
}
