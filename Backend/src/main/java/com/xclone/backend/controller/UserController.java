package com.xclone.backend.controller;

import com.xclone.backend.dto.PageResponse;
import com.xclone.backend.dto.ProfileResponse;
import com.xclone.backend.dto.TweetResponse;
import com.xclone.backend.dto.UserSummaryResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.service.TweetService;
import com.xclone.backend.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TweetService tweetService;

    public UserController(UserService userService, TweetService tweetService) {
        this.userService = userService;
        this.tweetService = tweetService;
    }

    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal User current) {
        return userService.getMe(current);
    }

    @GetMapping("/{username}")
    public ProfileResponse profile(@PathVariable String username, @AuthenticationPrincipal User current) {
        return userService.getProfile(username, current);
    }

    @GetMapping("/{username}/tweets")
    public PageResponse<TweetResponse> tweets(@PathVariable String username,
                                              @RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "10") int size) {
        return tweetService.getUserTweets(username, page, size);
    }

    @GetMapping("/{username}/followers")
    public PageResponse<UserSummaryResponse> followers(@PathVariable String username,
                                                       @RequestParam(defaultValue = "1") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @AuthenticationPrincipal User current) {
        return userService.getFollowers(username, page, size, current);
    }

    @GetMapping("/{username}/following")
    public PageResponse<UserSummaryResponse> following(@PathVariable String username,
                                                       @RequestParam(defaultValue = "1") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @AuthenticationPrincipal User current) {
        return userService.getFollowing(username, page, size, current);
    }
}
