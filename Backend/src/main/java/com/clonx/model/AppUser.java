package com.clonx.model;
import jakarta.persistence.*; import java.time.OffsetDateTime;
@Entity @Table(name="users")
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="full_name",nullable=false,length=100) private String fullName;
 @Column(nullable=false,length=50) private String username;
 @Column(nullable=false,length=100) private String email;
 @Column(name="password_hash",nullable=false,length=100) private String passwordHash="";
 @Column(name="created_at",nullable=false) private OffsetDateTime createdAt=OffsetDateTime.now();
 protected AppUser(){}
 public AppUser(String n,String u,String e,String password){fullName=n;username=u;email=e;passwordHash=password;createdAt=OffsetDateTime.now();}
 public AppUser(String n,String u,String e){this(n,u,e,"");}
 public Long getId(){return id;} public String getFullName(){return fullName;} public String getUsername(){return username;} public String getEmail(){return email;} public OffsetDateTime getCreatedAt(){return createdAt;}
 public String getPasswordHash(){return passwordHash;}
 public void setPasswordHash(String value){passwordHash=value;}
}