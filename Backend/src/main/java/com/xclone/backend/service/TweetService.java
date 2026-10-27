package com.xclone.backend.service;

import com.xclone.backend.dto.PageResponse;
import com.xclone.backend.dto.TweetRequest;
import com.xclone.backend.dto.TweetResponse;
import com.xclone.backend.entity.Tweet;
import com.xclone.backend.entity.User;
import com.xclone.backend.exception.BadRequestException;
import com.xclone.backend.exception.NotFoundException;
import com.xclone.backend.repository.TweetRepository;
import com.xclone.backend.repository.UserRepository;
import com.xclone.backend.util.PageRequests;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TweetService {

    private static final int MAX_LENGTH = 280;

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    public TweetService(TweetRepository tweetRepository, UserRepository userRepository) {
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TweetResponse create(User author, TweetRequest request) {
        String content = request.content().trim();
        if (content.isEmpty()) {
            throw new BadRequestException("El tweet no puede estar vacío");
        }
        if (content.length() > MAX_LENGTH) {
            throw new BadRequestException("El tweet no puede superar " + MAX_LENGTH + " caracteres");
        }

        Tweet tweet = new Tweet();
        tweet.setAuthor(userRepository.getReferenceById(author.getId()));
        tweet.setContent(content);
        return toResponse(tweetRepository.save(tweet));
    }

    @Transactional(readOnly = true)
    public PageResponse<TweetResponse> getUserTweets(String username, int page, int size) {
        User target = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("El usuario no existe"));
        return PageResponse.of(tweetRepository
                .findByAuthorIdOrderByCreatedAtDescIdDesc(target.getId(), PageRequests.of(page, size))
                .map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<TweetResponse> getFeed(User current, int page, int size) {
        return PageResponse.of(tweetRepository
                .findFeed(current.getId(), PageRequests.of(page, size))
                .map(this::toResponse));
    }

    private TweetResponse toResponse(Tweet tweet) {
        User author = tweet.getAuthor();
        return new TweetResponse(
                tweet.getId(),
                tweet.getContent(),
                tweet.getCreatedAt(),
                new TweetResponse.Author(author.getId(), author.getFullName(), author.getUsername()));
    }
}
