package com.findutabs.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageService {

    // Placeholder for future file storage implementation
    // Can be implemented with AWS S3, local storage, etc.

    public String uploadFile(byte[] fileData, String fileName) {
        // TODO: Implement file upload logic
        return "/uploads/" + fileName;
    }

    public void deleteFile(String fileUrl) {
        // TODO: Implement file deletion logic
    }
}
