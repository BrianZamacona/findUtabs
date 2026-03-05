package com.findutabs.service;

import com.findutabs.dto.response.UserResponse;
import com.findutabs.exception.ResourceNotFoundException;
import com.findutabs.model.DmcaReport;
import com.findutabs.model.User;
import com.findutabs.repository.DmcaReportRepository;
import com.findutabs.repository.TabRatingRepository;
import com.findutabs.repository.TabRepository;
import com.findutabs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final TabRepository tabRepository;
    private final DmcaReportRepository dmcaReportRepository;
    private final TabRatingRepository tabRatingRepository;

    public Map<String, Long> getStats() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "totalTabs", tabRepository.count(),
                "pendingDmcaReports", dmcaReportRepository.countByStatus(DmcaReport.DmcaStatus.PENDING)
        );
    }

    public Page<UserResponse> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToUserResponse);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public UserResponse banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if ("BANNED".equals(user.getRole())) {
            user.setRole("USER");
        } else {
            user.setRole("BANNED");
        }
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public Page<DmcaReport> getDmcaReports(Pageable pageable) {
        return dmcaReportRepository.findAll(pageable);
    }

    @Transactional
    public DmcaReport actionDmcaReport(Long reportId, String action) {
        DmcaReport report = dmcaReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("DMCA report not found with id: " + reportId));
        if ("ACTIONED".equalsIgnoreCase(action)) {
            report.setStatus(DmcaReport.DmcaStatus.ACTIONED);
        } else if ("REJECTED".equalsIgnoreCase(action)) {
            report.setStatus(DmcaReport.DmcaStatus.REJECTED);
        } else {
            throw new IllegalArgumentException("Invalid action: " + action + ". Must be ACTIONED or REJECTED");
        }
        return dmcaReportRepository.save(report);
    }

    @Transactional
    public void deleteTab(Long tabId) {
        if (!tabRepository.existsById(tabId)) {
            throw new ResourceNotFoundException("Tab not found with id: " + tabId);
        }
        tabRepository.deleteById(tabId);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
