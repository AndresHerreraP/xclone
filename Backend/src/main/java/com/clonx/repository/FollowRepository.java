package com.clonx.repository;
import com.clonx.model.Follow; import org.springframework.data.domain.Page; import org.springframework.data.domain.Pageable; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.transaction.annotation.Transactional;
public interface FollowRepository extends JpaRepository<Follow,Long>{
 boolean existsByFollowerIdAndFollowedId(Long a,Long b); long countByFollowerId(Long id); long countByFollowedId(Long id);
 @Transactional
 void deleteByFollowerIdAndFollowedId(Long a,Long b);
 Page<Follow> findByFollowedUsernameIgnoreCase(String username, Pageable pageable);
 Page<Follow> findByFollowerUsernameIgnoreCase(String username, Pageable pageable);
}