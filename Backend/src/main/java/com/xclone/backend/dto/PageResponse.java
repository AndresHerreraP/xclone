package com.xclone.backend.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageResponse<T>(List<T> items, int page, int size, long totalItems, int totalPages) {

    /** Converts a Spring Data page (0-based) into the API page (1-based). */
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }
}
