package com.xclone.backend.dto;

import java.time.Instant;

public record UserResponse(Long id, String fullName, String username, String email, Instant createdAt) {
}
