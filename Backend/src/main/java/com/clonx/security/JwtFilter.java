package com.clonx.security;
import com.clonx.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder; 
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component; 
import org.springframework.web.filter.OncePerRequestFilter; 
import java.io.IOException;
@Component public class JwtFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserRepository users; public JwtFilter(JwtService j,UserRepository u){jwt=j;users=u;}
 protected void doFilterInternal(HttpServletRequest r,HttpServletResponse s,FilterChain c)throws ServletException,IOException{
 String h=r.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){String t=h.substring(7);if(jwt.valid(t)){String n=jwt.username(t);if(users.existsByUsernameIgnoreCase(n)&&SecurityContextHolder.getContext().getAuthentication()==null){var p=User.withUsername(n).password("").authorities("USER").build();SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(p,null,p.getAuthorities()));}}} c.doFilter(r,s);
 }}