package com.xclone.backend.repository;

import com.xclone.backend.entity.Tweet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TweetRepository extends JpaRepository<Tweet, Long> {

    @EntityGraph(attributePaths = "author")
    Page<Tweet> findByAuthorIdOrderByCreatedAtDescIdDesc(Long authorId, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    @Query(value = "select t from Tweet t where t.author.id = :userId or t.author.id in "
            + "(select f.followed.id from Follow f where f.follower.id = :userId) "
            + "order by t.createdAt desc, t.id desc",
            countQuery = "select count(t) from Tweet t where t.author.id = :userId or t.author.id in "
            + "(select f.followed.id from Follow f where f.follower.id = :userId)")
    Page<Tweet> findFeed(@Param("userId") Long userId, Pageable pageable);
}
