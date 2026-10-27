package com.xclone.backend.service;

import com.xclone.backend.dto.PageResponse;
import com.xclone.backend.dto.ProfileResponse;
import com.xclone.backend.dto.UserSummaryResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.exception.NotFoundException;
import com.xclone.backend.repository.FollowRepository;
import com.xclone.backend.repository.UserRepository;
import com.xclone.backend.util.PageRequests;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMe(User current) {
        return buildProfile(current, false);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String username, User current) {
        User target = findByUsername(username);
        boolean isFollowing = !target.getId().equals(current.getId())
                && followRepository.existsByFollowerIdAndFollowedId(current.getId(), target.getId());
        return buildProfile(target, isFollowing);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getFollowers(String username, int page, int size, User current) {
        User target = findByUsername(username);
        Page<User> users = userRepository.findFollowersOf(target.getId(), PageRequests.of(page, size));
        return PageResponse.of(withFollowingFlag(users, current));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getFollowing(String username, int page, int size, User current) {
        User target = findByUsername(username);
        Page<User> users = userRepository.findFollowingOf(target.getId(), PageRequests.of(page, size));
        return PageResponse.of(withFollowingFlag(users, current));
    }

    /** Profile with follower/following counters. Also used by FollowService. */
    public ProfileResponse buildProfile(User user, boolean isFollowing) {
        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                followRepository.countByFollowedId(user.getId()),
                followRepository.countByFollowerId(user.getId()),
                isFollowing,
                user.getCreatedAt());
    }

    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("El usuario no existe"));
    }

    /** Marks which users of the page the connected user already follows. */
    private Page<UserSummaryResponse> withFollowingFlag(Page<User> users, User current) {
        List<Long> ids = users.getContent().stream().map(User::getId).toList();
        Set<Long> alreadyFollowed = ids.isEmpty()
                ? Set.of()
                : new HashSet<>(followRepository.findFollowedIdsIn(current.getId(), ids));
        return users.map(user -> new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                alreadyFollowed.contains(user.getId())));
    }
}
