package com.localbrand.service;

import com.localbrand.dto.AuthResponse;
import com.localbrand.dto.LoginRequest;
import com.localbrand.dto.RegisterRequest;
import com.localbrand.exception.BadRequestException;
import com.localbrand.model.Role;
import com.localbrand.model.User;
import com.localbrand.repository.UserRepository;
import com.localbrand.security.JwtUtil;
import com.localbrand.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @Mock
    private EmailService emailService;
    
    @Mock
    private OtpService otpService;

    @InjectMocks
    private AuthService authService;

    private User verifiedUser;
    private User unverifiedUser;

    @BeforeEach
    void setUp() {
        verifiedUser = User.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(Role.USER)
                .isVerified(true)
                .build();

        unverifiedUser = User.builder()
                .id("2")
                .name("Jane Doe")
                .email("jane@example.com")
                .password("encoded_password")
                .role(Role.USER)
                .isVerified(false)
                .verificationOtp("123456")
                .otpExpiry(LocalDateTime.now().plusMinutes(5))
                .build();
    }

    @Test
    void testRegisterUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("New User");
        request.setEmail("new@example.com");
        request.setPassword("password");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(otpService.generateOtp()).thenReturn("654321");
        
        String result = authService.registerUser(request);

        assertEquals("User registered successfully. Please check your email for the OTP.", result);
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendOtpEmail(eq("new@example.com"), eq("654321"));
    }

    @Test
    void testRegisterUser_EmailAlreadyInUse() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("john@example.com");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class, () -> authService.registerUser(request));
        assertEquals("Error: Email is already in use!", exception.getMessage());
        
        // Ensure that repository.save and email are not called
        verify(userRepository, never()).save(any(User.class));
        verify(emailService, never()).sendOtpEmail(anyString(), anyString());
    }

    @Test
    void testAuthenticateUser_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("password");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(verifiedUser));

        UserDetailsImpl userDetails = UserDetailsImpl.build(verifiedUser);
        Authentication authentication = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtil.generateJwtToken(authentication)).thenReturn("mock_jwt_token");

        AuthResponse response = authService.authenticateUser(loginRequest);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("john@example.com", response.getEmail());
        assertEquals(Role.USER.name(), response.getRole());
    }

    @Test
    void testAuthenticateUser_NotVerified() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("jane@example.com");
        loginRequest.setPassword("password");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(unverifiedUser));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> authService.authenticateUser(loginRequest));
        assertEquals("Please verify your email before logging in.", exception.getMessage());
        
        // Ensure authentication manager is not called
        verify(authenticationManager, never()).authenticate(any());
    }
    
    @Test
    void testAuthenticateUser_UserNotFound() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nobody@example.com");
        loginRequest.setPassword("password");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        BadRequestException exception = assertThrows(BadRequestException.class, () -> authService.authenticateUser(loginRequest));
        assertEquals("Bad credentials", exception.getMessage());
    }
}
