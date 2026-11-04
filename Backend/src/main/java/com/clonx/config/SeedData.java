package com.clonx.config;
import com.clonx.model.*;
import com.clonx.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SeedData {
 private static final String[][] DEMO_USERS={
  {"Laura Gómez","laurag","laurag@example.com"},
  {"Carlos Ruiz","carlosr","carlosr@example.com"},
  {"Sofía Martínez","sofiam","sofiam@example.com"},
  {"Juan Pérez","juanp","juanp@example.com"},
  {"Valentina Rojas","valer","valer@example.com"},
  {"Sebastián Ramírez","sebastianr","sebastianr@example.com"},
  {"Mariana Torres","marianat","marianat@example.com"},
  {"Diego Vargas","diegov","diegov@example.com"},
  {"Natalia Castro","nataliac","nataliac@example.com"},
  {"Andrés Molina","andresm","andresm@example.com"},
  {"Camila Herrera","camilah","camilah@example.com"},
  {"Mateo Silva","mateos","mateos@example.com"},
  {"Paula León","paulal","paulal@example.com"},{"Felipe Cruz","felipec","felipec@example.com"},
  {"Daniela Ortiz","danielao","danielao@example.com"},{"Nicolás Peña","nicolasp","nicolasp@example.com"},
  {"Sara Méndez","saram","saram@example.com"},{"Tomás Gil","tomasg","tomasg@example.com"},
  {"Lucía Pardo","luciap","luciap@example.com"},{"Emilio Nieto","emilion","emilion@example.com"},
  {"Ana Beltrán","anab","anab@example.com"},{"Gabriel Soto","gabriels","gabriels@example.com"},
  {"Isabela Mora","isabelam","isabelam@example.com"},{"David Acosta","davida","davida@example.com"},
  {"Mónica Reyes","monicar","monicar@example.com"}
 };
 private static final String[] DEMO_MESSAGES={
  "Probando nuevas ideas para el proyecto.",
  "Un pequeño avance también cuenta.",
  "Hoy aprendí algo nuevo construyendo esta aplicación.",
  "Compartiendo avances con la comunidad.",
  "La constancia hace que los proyectos mejoren."
 };

 @Bean
 CommandLineRunner seed(UserRepository users,TweetRepository tweets,FollowRepository follows,org.springframework.security.crypto.password.PasswordEncoder encoder){
  return args -> {
   List<AppUser> demoUsers=new ArrayList<>();
   for(String[] data:DEMO_USERS){
    AppUser user=users.findByUsernameIgnoreCase(data[1]).orElseGet(() -> users.save(new AppUser(data[0],data[1],data[2],encoder.encode("demo1234"))));
    if(user.getPasswordHash()==null||user.getPasswordHash().isBlank()){user.setPasswordHash(encoder.encode("demo1234"));users.save(user);}
    demoUsers.add(user);
   }

   for(int i=0;i<demoUsers.size();i++){
    AppUser author=demoUsers.get(i);
    for(int post=0;post<3 && (i*3+post)<60;post++){
     String content="[Demo ClonX] "+DEMO_MESSAGES[(i+post)%DEMO_MESSAGES.length]+" Publicación "+(i*3+post+1);
     if(!tweets.existsByContent(content)) tweets.save(new Tweet(content,author));
    }
    for(int j=0;j<demoUsers.size();j++) for(int offset=1;offset<=5;offset++){
     AppUser follower=demoUsers.get(j), followed=demoUsers.get((j+offset)%demoUsers.size());
     if(!follows.existsByFollowerIdAndFollowedId(follower.getId(),followed.getId())) follows.save(new Follow(follower,followed));
    }
    for(int offset=1;offset<=3;offset++){
     AppUser followed=demoUsers.get((i+offset)%demoUsers.size());
     if(!follows.existsByFollowerIdAndFollowedId(author.getId(),followed.getId())){
      follows.save(new Follow(author,followed));
     }
    }
   }
  };
 }
}