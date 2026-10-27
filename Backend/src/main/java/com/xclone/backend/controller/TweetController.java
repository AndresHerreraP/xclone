package com.xclone.backend.controller;

import com.xclone.backend.dto.TweetRequest;
import com.xclone.backend.dto.TweetResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.service.TweetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tweets")
public class TweetController {

    private final TweetService tweetService;

    public TweetController(TweetService tweetService) {
        this.tweetService = tweetService;
    }

    @PostMapping
    public ResponseEntity<TweetResponse> create(@Valid @RequestBody TweetRequest request,
                                                @AuthenticationPrincipal User current) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tweetService.create(current, request));
    }
}
