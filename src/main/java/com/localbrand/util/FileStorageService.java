package com.localbrand.util;

import com.localbrand.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(@NonNull MultipartFile file, @NonNull String subDir) {
        String originalName = file.getOriginalFilename();
        if (originalName == null) originalName = "";
        String originalFileName = StringUtils.cleanPath(originalName);

        try {
            if (originalFileName.contains("..")) {
                throw new BadRequestException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Ensure sub-directory exists
            Path targetDir = this.fileStorageLocation.resolve(subDir).normalize();
            Files.createDirectories(targetDir);

            // Generate unique file name
            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path targetLocation = targetDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String fileName, String subDir) {
        try {
            Path file = fileStorageLocation.resolve(subDir).resolve(fileName).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    public String getFileUrl(@NonNull String fileName, @NonNull String subDir) {
        return "/uploads/" + subDir + "/" + fileName;
    }
}
