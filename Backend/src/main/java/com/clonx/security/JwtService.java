package com.clonx.security;
import io.jsonwebtoken.Jwts; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.util.Date;
@Service public class JwtService {
 private final SecretKey key; public JwtService(@Value("${app.jwt.secret}") String s){key=Keys.hmacShaKeyFor(s.getBytes(StandardCharsets.UTF_8));}
 public String create(String u){Date n=new Date();return Jwts.builder().subject(u).issuedAt(n).expiration(new Date(n.getTime()+86400000)).signWith(key).compact();}
 public String username(String t){return Jwts.parser().verifyWith(key).build().parseSignedClaims(t).getPayload().getSubject();}
 public boolean valid(String t){try{username(t);return true;}catch(Exception e){return false;}}
}