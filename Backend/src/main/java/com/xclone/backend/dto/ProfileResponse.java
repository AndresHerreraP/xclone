package com.xclone.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record ProfileResponse(
        Long id,
        String fullName,
        String username,
        long followersCount,
        long followingCount,
        @JsonProperty("isFollowing") boolean isFollowing,
        Instant createdAt) {
}
