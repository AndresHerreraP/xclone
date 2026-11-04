package com.clonx.model;
import jakarta.persistence.*; import java.time.OffsetDateTime;
@Entity @Table(name="tweets")
public class Tweet {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=280) private String content;
 @ManyToOne(optional=false) @JoinColumn(name="author_id") private AppUser author;
 @Column(name="created_at",nullable=false) private OffsetDateTime createdAt=OffsetDateTime.now();
 protected Tweet(){}
 public Tweet(String c,AppUser a){content=c;author=a;createdAt=OffsetDateTime.now();}
 public Long getId(){return id;} public String getContent(){return content;} public AppUser getAuthor(){return author;} public OffsetDateTime getCreatedAt(){return createdAt;}
}