package com.xclone.backend.dto;

import java.time.Instant;

public record TweetResponse(Long id, String content, Instant createdAt, Author author) {

    public record Author(Long id, String fullName, String username) {
    }
}
