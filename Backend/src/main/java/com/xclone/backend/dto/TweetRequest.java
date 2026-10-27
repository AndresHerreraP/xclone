package com.xclone.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TweetRequest(
        @NotBlank(message = "El tweet no puede estar vacío")
        @Size(max = 280, message = "El tweet no puede superar 280 caracteres")
        String content) {
}
