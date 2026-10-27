package com.xclone.backend.dto;

public record AuthResponse(String token, UserResponse user) {
}
