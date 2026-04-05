package com.localbrand.controller;

import com.localbrand.dto.ApiResponse;
import com.localbrand.model.User;
import com.localbrand.repository.UserRepository;
import com.localbrand.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserController {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @PutMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> updateAvatar(@RequestParam("avatar") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.localbrand.exception.ResourceNotFoundException("User not found"));

        // Delete old avatar if exists
        if (user.getAvatar() != null) {
            fileStorageService.deleteFile(user.getAvatar(), "avatars");
        }

        String fileName = fileStorageService.storeFile(file, "avatars");
        String avatarUrl = fileStorageService.getFileUrl(fileName, "avatars");

        user.setAvatar(fileName);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Avatar updated successfully", avatarUrl));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> updateProfile(@RequestBody java.util.Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.localbrand.exception.ResourceNotFoundException("User not found"));

        if (request.containsKey("name")) {
            user.setName(request.get("name"));
        }
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", "Success"));
    }
}
