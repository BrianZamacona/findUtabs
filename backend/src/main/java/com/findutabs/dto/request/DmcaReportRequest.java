package com.findutabs.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DmcaReportRequest {

    @NotBlank(message = "Reporter name is required")
    private String reporterName;

    @NotBlank(message = "Reporter email is required")
    @Email(message = "Reporter email must be valid")
    private String reporterEmail;

    private String reporterCompany;

    @NotBlank(message = "Content URL is required")
    private String contentUrl;

    @NotBlank(message = "Original work description is required")
    @Size(min = 50, message = "Original work description must be at least 50 characters")
    private String originalWorkDescription;

    @NotBlank(message = "Ownership statement is required")
    private String ownershipStatement;

    @NotNull(message = "Good faith statement is required")
    @AssertTrue(message = "Good faith statement must be confirmed")
    private Boolean goodFaithStatement;

    @NotNull(message = "Accuracy statement is required")
    @AssertTrue(message = "Accuracy statement must be confirmed")
    private Boolean accuracyStatement;
}
