package com.findutabs.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Async
    public void sendDmcaTakedownNotification(String recipientEmail, String contentUrl, String tabTitle) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.debug("Email not configured, skipping DMCA notification to {}", recipientEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("DMCA Takedown Notice - findUtabs");
            String body = "<h2>DMCA Takedown Notice</h2>"
                    + "<p>Your DMCA report regarding the following content has been actioned:</p>"
                    + "<p><strong>Content URL:</strong> " + contentUrl + "</p>"
                    + "<p><strong>Tab Title:</strong> " + tabTitle + "</p>"
                    + "<p>The content has been removed from findUtabs.</p>"
                    + "<p>Thank you for helping us maintain a legal platform.</p>"
                    + "<br><p>findUtabs Team</p>";
            helper.setText(body, true);
            mailSender.send(message);
            log.info("DMCA takedown notification sent to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send DMCA notification email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String recipientEmail, String username) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.debug("Email not configured, skipping welcome email to {}", recipientEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Welcome to findUtabs!");
            String body = "<h2>Welcome to findUtabs, " + username + "!</h2>"
                    + "<p>We're excited to have you join our guitar tablature community.</p>"
                    + "<p>You can now:</p>"
                    + "<ul>"
                    + "<li>Browse thousands of guitar tabs</li>"
                    + "<li>Create and share your own tablatures</li>"
                    + "<li>Rate and favorite tabs</li>"
                    + "<li>Build your personal library</li>"
                    + "</ul>"
                    + "<p>Happy playing!</p>"
                    + "<br><p>findUtabs Team</p>";
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Welcome email sent to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String recipientEmail, String resetToken) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.debug("Email not configured, skipping password reset email to {}", recipientEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Password Reset - findUtabs");
            String body = "<h2>Password Reset Request</h2>"
                    + "<p>You requested a password reset for your findUtabs account.</p>"
                    + "<p>Your reset token: <strong>" + resetToken + "</strong></p>"
                    + "<p>This token will expire in 24 hours.</p>"
                    + "<p>If you did not request this, please ignore this email.</p>"
                    + "<br><p>findUtabs Team</p>";
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Password reset email sent to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", recipientEmail, e.getMessage());
        }
    }
}
