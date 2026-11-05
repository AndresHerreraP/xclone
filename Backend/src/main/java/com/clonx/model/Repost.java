package com.clonx.model;
import jakarta.persistence.*; import java.time.OffsetDateTime;
@Entity @Table(name="reposts",uniqueConstraints=@UniqueConstraint(columnNames={"user_id","tweet_id"}))
public class Repost {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) @JoinColumn(name="user_id") private AppUser user;
 @ManyToOne(optional=false) @JoinColumn(name="tweet_id") private Tweet tweet;
 @Column(name="created_at",nullable=false) private OffsetDateTime createdAt=OffsetDateTime.now();
 protected Repost(){}
 public Repost(AppUser u,Tweet t){user=u;tweet=t;createdAt=OffsetDateTime.now();}
 public Long getId(){return id;} public AppUser getUser(){return user;} public Tweet getTweet(){return tweet;} public OffsetDateTime getCreatedAt(){return createdAt;}
}
