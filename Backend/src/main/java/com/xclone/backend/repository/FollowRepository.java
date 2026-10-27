package com.xclone.backend.repository;

import com.xclone.backend.entity.Follow;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);

    long countByFollowedId(Long followedId);

    long countByFollowerId(Long followerId);

    @Query("select f.followed.id from Follow f "
            + "where f.follower.id = :followerId and f.followed.id in :ids")
    List<Long> findFollowedIdsIn(@Param("followerId") Long followerId,
                                 @Param("ids") Collection<Long> ids);
}
