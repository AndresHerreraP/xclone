package com.xclone.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String username,
        @JsonProperty("isFollowing") boolean isFollowing) {
}
