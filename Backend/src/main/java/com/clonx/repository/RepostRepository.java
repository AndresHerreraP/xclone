package com.clonx.repository;
import com.clonx.model.Repost; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.transaction.annotation.Transactional;
public interface RepostRepository extends JpaRepository<Repost,Long>{
 boolean existsByUserIdAndTweetId(Long u,Long t); long countByTweetId(Long t);
 @Transactional void deleteByUserIdAndTweetId(Long u,Long t);
}
