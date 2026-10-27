package com.xclone.backend.controller;

import com.xclone.backend.dto.FollowRequest;
import com.xclone.backend.dto.ProfileResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.service.FollowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<ProfileResponse> follow(@Valid @RequestBody FollowRequest request,
                                                  @AuthenticationPrincipal User current) {
        return ResponseEntity.status(HttpStatus.CREATED).body(followService.follow(current, request));
    }
}
