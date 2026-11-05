package com.clonx.repository;
import com.clonx.model.Like; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.transaction.annotation.Transactional;
public interface LikeRepository extends JpaRepository<Like,Long>{
 boolean existsByUserIdAndTweetId(Long u,Long t); long countByTweetId(Long t);
 @Transactional void deleteByUserIdAndTweetId(Long u,Long t);
}
