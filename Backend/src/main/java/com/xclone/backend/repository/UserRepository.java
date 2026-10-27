package com.xclone.backend.repository;

import com.xclone.backend.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query(value = "select u from User u where u.id in "
            + "(select f.follower.id from Follow f where f.followed.id = :userId) "
            + "order by u.fullName asc, u.id asc",
            countQuery = "select count(u) from User u where u.id in "
            + "(select f.follower.id from Follow f where f.followed.id = :userId)")
    Page<User> findFollowersOf(@Param("userId") Long userId, Pageable pageable);

    @Query(value = "select u from User u where u.id in "
            + "(select f.followed.id from Follow f where f.follower.id = :userId) "
            + "order by u.fullName asc, u.id asc",
            countQuery = "select count(u) from User u where u.id in "
            + "(select f.followed.id from Follow f where f.follower.id = :userId)")
    Page<User> findFollowingOf(@Param("userId") Long userId, Pageable pageable);
}
