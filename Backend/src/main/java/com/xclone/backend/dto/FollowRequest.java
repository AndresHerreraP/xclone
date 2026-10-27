package com.xclone.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record FollowRequest(
        @NotBlank(message = "El nombre de usuario es obligatorio") String username) {
}
