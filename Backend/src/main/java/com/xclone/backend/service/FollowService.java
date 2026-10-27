package com.xclone.backend.service;

import com.xclone.backend.dto.FollowRequest;
import com.xclone.backend.dto.ProfileResponse;
import com.xclone.backend.entity.Follow;
import com.xclone.backend.entity.User;
import com.xclone.backend.exception.BadRequestException;
import com.xclone.backend.exception.ConflictException;
import com.xclone.backend.exception.NotFoundException;
import com.xclone.backend.repository.FollowRepository;
import com.xclone.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public FollowService(FollowRepository followRepository,
                         UserRepository userRepository,
                         UserService userService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /** Follows a user and returns the followed user's updated profile. */
    @Transactional
    public ProfileResponse follow(User current, FollowRequest request) {
        User target = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new NotFoundException("El usuario no existe"));

        if (target.getId().equals(current.getId())) {
            throw new BadRequestException("No puedes seguirte a ti mismo");
        }
        if (followRepository.existsByFollowerIdAndFollowedId(current.getId(), target.getId())) {
            throw new ConflictException("Ya sigues a este usuario");
        }

        Follow follow = new Follow();
        follow.setFollower(userRepository.getReferenceById(current.getId()));
        follow.setFollowed(target);
        followRepository.save(follow);

        return userService.buildProfile(target, true);
    }
}
