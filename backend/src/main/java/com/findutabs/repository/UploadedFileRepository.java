package com.findutabs.repository;

import com.findutabs.model.UploadedFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {

    Page<UploadedFile> findByUserId(Long userId, Pageable pageable);

    List<UploadedFile> findByProcessingStatus(UploadedFile.ProcessingStatus processingStatus);
}
