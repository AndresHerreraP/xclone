package com.xclone.backend.controller;

import com.xclone.backend.dto.PageResponse;
import com.xclone.backend.dto.TweetResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.service.TweetService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final TweetService tweetService;

    public FeedController(TweetService tweetService) {
        this.tweetService = tweetService;
    }

    @GetMapping
    public PageResponse<TweetResponse> feed(@RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            @AuthenticationPrincipal User current) {
        return tweetService.getFeed(current, page, size);
    }
}
