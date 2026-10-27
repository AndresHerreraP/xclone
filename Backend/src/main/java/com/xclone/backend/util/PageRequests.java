package com.xclone.backend.util;

import com.xclone.backend.exception.BadRequestException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public final class PageRequests {

    private static final int MAX_SIZE = 50;

    private PageRequests() {
    }

    /** Builds a Pageable from the API's 1-based page number. */
    public static Pageable of(int page, int size) {
        if (page < 1) {
            throw new BadRequestException("El parámetro page debe ser mayor o igual a 1");
        }
        if (size < 1 || size > MAX_SIZE) {
            throw new BadRequestException("El parámetro size debe estar entre 1 y " + MAX_SIZE);
        }
        return PageRequest.of(page - 1, size);
    }
}
