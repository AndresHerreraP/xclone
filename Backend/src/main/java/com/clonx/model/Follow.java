package com.clonx.model;
import jakarta.persistence.*; 
import java.time.OffsetDateTime;
@Entity @Table(name="follows",uniqueConstraints=@UniqueConstraint(columnNames={"follower_id","followed_id"}))
public class Follow {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) @JoinColumn(name="follower_id") private AppUser follower;
 @ManyToOne(optional=false) @JoinColumn(name="followed_id") private AppUser followed;
 @Column(name="created_at",nullable=false) private OffsetDateTime createdAt=OffsetDateTime.now();
 protected Follow(){}
 public Follow(AppUser a,AppUser b){follower=a;followed=b;createdAt=OffsetDateTime.now();}
 public Long getId(){return id;} public AppUser getFollower(){return follower;} public AppUser getFollowed(){return followed;} public OffsetDateTime getCreatedAt(){return createdAt;}
}