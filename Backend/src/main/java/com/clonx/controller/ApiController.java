package com.clonx.controller;

import com.clonx.model.*;
import com.clonx.repository.*;
import com.clonx.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class ApiController {
 private final UserRepository users;
 private final TweetRepository tweets;
 private final FollowRepository follows;
 private final JwtService jwtService;
 private final Map<String, LoginCode> loginCodes = new ConcurrentHashMap<>();
 private final SecureRandom random = new SecureRandom();

 public ApiController(UserRepository u,TweetRepository t,FollowRepository f,JwtService j){
  users=u;tweets=t;follows=f;jwtService=j;
 }

 record Login(@NotBlank String identifier,@NotBlank String code){}
 record CodeRequest(@NotBlank String identifier,String fullName,String username,String email){}
 record LoginCode(String code, Instant expiresAt){}
 record TweetInput(@NotBlank @Size(max=280) String content){}
 record FollowInput(@NotBlank String username){}

 @GetMapping("/health") Map<String,String> health(){return Map.of("status","ok");}

 @PostMapping("/auth/request-code")
 ResponseEntity<Map<String,Object>> requestCode(@Valid @RequestBody CodeRequest input){
  AppUser user=users.findByUsernameIgnoreCase(input.identifier().trim()).or(()->users.findByEmailIgnoreCase(input.identifier().trim())).orElse(null);
  if(user==null){
   if(input.fullName()==null||input.fullName().isBlank()||input.username()==null||input.username().isBlank()||input.email()==null||input.email().isBlank()){
    return ResponseEntity.ok(Map.of("registered",false,"message","Completa tus datos para crear la cuenta."));
   }
   if(users.existsByUsernameIgnoreCase(input.username().trim())||users.existsByEmailIgnoreCase(input.email().trim())){
    throw new ResponseStatusException(HttpStatus.CONFLICT,"El usuario o correo ya está registrado.");
   }
   user=users.save(new AppUser(input.fullName().trim(),input.username().trim(),input.email().trim()));
  }
  String code=String.format("%06d",random.nextInt(1_000_000));
  loginCodes.put(user.getUsername().toLowerCase(Locale.ROOT),new LoginCode(code,Instant.now().plusSeconds(600)));
  return ResponseEntity.ok(Map.of("registered",true,"message","Código enviado.","code",code));
 }

 @PostMapping("/auth/login")
 ResponseEntity<Map<String,Object>> login(@Valid @RequestBody Login input){
  AppUser user=findUser(input.identifier());
  String key=user.getUsername().toLowerCase(Locale.ROOT);
  LoginCode loginCode=loginCodes.get(key);
  if(loginCode==null||loginCode.expiresAt().isBefore(Instant.now())||!loginCode.code().equals(input.code().trim())){
   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Código inválido o expirado.");
  }
  loginCodes.remove(key);
  return ResponseEntity.ok(Map.of("token",jwtService.create(user.getUsername()),"user",userDto(user,null)));
 }

 private AppUser findUser(String identifier){
  String normalized=identifier.trim();
  return users.findByUsernameIgnoreCase(normalized).or(()->users.findByEmailIgnoreCase(normalized))
   .orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Usuario no encontrado."));
 }

 @GetMapping("/users/me")
 Map<String,Object> me(Authentication authentication){return userDto(current(authentication.getName()),authentication.getName());}

 @PostMapping("/tweets")
 ResponseEntity<Map<String,Object>> tweet(Authentication a,@Valid @RequestBody TweetInput input){
  String content=input.content().trim();
  if(content.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"El tweet no puede estar vacío.");
  return ResponseEntity.status(HttpStatus.CREATED).body(tweetDto(tweets.save(new Tweet(content,current(a.getName())))));
 }

 @GetMapping("/feed")
 Map<String,Object> feed(Authentication a,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="10") int size){
  PageRequest request=pageable(page,size,Sort.by(Sort.Direction.DESC,"createdAt"));
  AppUser me=current(a.getName());
  List<Long> ids=follows.findAll().stream().filter(f->f.getFollower().getId().equals(me.getId())).map(f->f.getFollowed().getId()).toList();
  List<Long> allowed=new ArrayList<>(ids); allowed.add(me.getId());
  Page<Tweet> result=tweets.findByAuthorIdIn(allowed,request);
  return pageDto(result,page,size);
 }

 @GetMapping("/users")
 Map<String,Object> users(@RequestParam(defaultValue="") String query,Authentication a){
  String normalized=query.trim().toLowerCase();
  List<Map<String,Object>> items=users.findAll(Sort.by(Sort.Direction.ASC,"fullName")).stream()
   .filter(u->normalized.isEmpty()||u.getFullName().toLowerCase().contains(normalized)||u.getUsername().toLowerCase().contains(normalized))
   .map(u->userDto(u,a.getName())).toList();
  return Map.of("items",items);
 }

 @GetMapping("/trends")
 Map<String,Object> trends(){
  Map<String,Long> counts=new HashMap<>();
  Set<String> ignored=Set.of("para","esta","este","como","desde","publicación","clonx");
  tweets.findAll(PageRequest.of(0,200,Sort.by(Sort.Direction.DESC,"createdAt"))).forEach(tweet->{
   for(String word:tweet.getContent().toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+")){
    if(word.length()>=5&&!ignored.contains(word)) counts.merge(word,1L,Long::sum);
   }
  });
  List<Map<String,Object>> items=counts.entrySet().stream()
   .sorted(Map.Entry.<String,Long>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))
   .limit(6).map(entry->Map.<String,Object>of("title",entry.getKey(),"posts",entry.getValue(),"category","Tendencia"))
   .toList();
  return Map.of("items",items);
 }

 @GetMapping("/notifications")
 Map<String,Object> notifications(Authentication a,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="10") int size){
  Page<Follow> result=follows.findByFollowedUsernameIgnoreCase(a.getName(),pageable(page,size,Sort.by(Sort.Direction.DESC,"createdAt")));
  List<Map<String,Object>> items=result.getContent().stream().map(f->Map.<String,Object>of(
   "type","follow","actor",userDto(f.getFollower(),a.getName()),"createdAt",f.getCreatedAt(),
   "message","empezó a seguirte."
  )).toList();
  return Map.of("items",items,"page",page,"size",size,"totalItems",result.getTotalElements(),"totalPages",result.getTotalPages());
 }

 @GetMapping("/users/{username}")
 Map<String,Object> profile(@PathVariable String username,Authentication a){
  return userDto(users.findByUsernameIgnoreCase(username).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario no existe.")),a.getName());
 }

 @GetMapping("/users/{username}/tweets")
 Map<String,Object> userTweets(@PathVariable String username,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="10") int size){
  Page<Tweet> result=tweets.findByAuthorUsernameIgnoreCase(username,pageable(page,size,Sort.by(Sort.Direction.DESC,"createdAt")));
  return pageDto(result,page,size);
 }

 @GetMapping("/users/{username}/followers")
 Map<String,Object> followers(@PathVariable String username,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="10") int size){
  Page<Follow> result=follows.findByFollowedUsernameIgnoreCase(username,pageable(page,size,Sort.by(Sort.Direction.ASC,"follower.fullName")));
  return followPage(result,page,size,true);
 }

 @GetMapping("/users/{username}/following")
 Map<String,Object> following(@PathVariable String username,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="10") int size){
  Page<Follow> result=follows.findByFollowerUsernameIgnoreCase(username,pageable(page,size,Sort.by(Sort.Direction.ASC,"followed.fullName")));
  return followPage(result,page,size,false);
 }

 @PostMapping("/follows")
 ResponseEntity<Map<String,String>> follow(Authentication a,@Valid @RequestBody FollowInput input){
  AppUser me=current(a.getName());
  AppUser target=users.findByUsernameIgnoreCase(input.username().replace("@",""))
   .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario no existe."));
  if(me.getId().equals(target.getId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No puedes seguirte a ti mismo.");
  if(follows.existsByFollowerIdAndFollowedId(me.getId(),target.getId())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Ya sigues a este usuario.");
  follows.save(new Follow(me,target));
  return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message","Ahora sigues a @"+target.getUsername()));
 }

 @DeleteMapping("/follows/{username}")
 Map<String,String> unfollow(Authentication a,@PathVariable String username){
  AppUser me=current(a.getName());
  AppUser target=users.findByUsernameIgnoreCase(username).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario no existe."));
  if(!follows.existsByFollowerIdAndFollowedId(me.getId(),target.getId())) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"No sigues a ese usuario.");
  follows.deleteByFollowerIdAndFollowedId(me.getId(),target.getId());
  return Map.of("message","Dejaste de seguir a @"+username);
 }

 private AppUser current(String username){return users.findByUsernameIgnoreCase(username).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sesión inválida."));}
 private PageRequest pageable(int page,int size,Sort sort){
  if(page<1||size<1||size>50) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Parámetros de paginación inválidos.");
  return PageRequest.of(page-1,size,sort);
 }
 private Map<String,Object> userDto(AppUser u,String viewer){
  boolean isFollowing=viewer!=null&&users.findByUsernameIgnoreCase(viewer).map(v->follows.existsByFollowerIdAndFollowedId(v.getId(),u.getId())).orElse(false);
  return Map.of("id",u.getId(),"fullName",u.getFullName(),"username",u.getUsername(),"email",u.getEmail(),"followers",follows.countByFollowedId(u.getId()),"following",follows.countByFollowerId(u.getId()),"isFollowing",isFollowing);
 }
 private Map<String,Object> tweetDto(Tweet t){return Map.of("id",t.getId(),"content",t.getContent(),"author",userDto(t.getAuthor(),null),"createdAt",t.getCreatedAt());}
 private Map<String,Object> pageDto(Page<Tweet> p,int page,int size){return Map.of("items",p.getContent().stream().map(this::tweetDto).toList(),"page",page,"size",size,"totalItems",p.getTotalElements(),"totalPages",p.getTotalPages());}
 private Map<String,Object> followPage(Page<Follow> p,int page,int size,boolean followers){return Map.of("items",p.getContent().stream().map(f->userDto(followers?f.getFollower():f.getFollowed(),null)).toList(),"page",page,"size",size,"totalItems",p.getTotalElements(),"totalPages",p.getTotalPages());}
}
