package com.xclone.backend.seed;

import com.xclone.backend.entity.Follow;
import com.xclone.backend.entity.Tweet;
import com.xclone.backend.entity.User;
import com.xclone.backend.repository.FollowRepository;
import com.xclone.backend.repository.TweetRepository;
import com.xclone.backend.repository.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Fills an empty database with 25 users, 60 tweets and some follows.
 * Every seeded user has the password "password123".
 */
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String SEED_PASSWORD = "password123";

    private static final String[][] PEOPLE = {
        {"Laura Gómez", "laurag"}, {"Carlos Ruiz", "carlosr"}, {"Sofía Marín", "sofiam"},
        {"Juan Pérez", "juanp"}, {"Valentina Ríos", "valer"}, {"Ana Torres", "anat"},
        {"Camila Díaz", "camid"}, {"Daniela Soto", "danis"}, {"Diego Vargas", "diegov"},
        {"Esteban Mora", "estebanm"}, {"Felipe Gil", "felipeg"}, {"Gabriela Rey", "gabir"},
        {"Hugo Ramírez", "hugor"}, {"Isabela Cano", "isac"}, {"Julián Ortiz", "juliano"},
        {"Karen Londoño", "karenl"}, {"Luis Herrera", "luish"}, {"Mariana Cruz", "marianac"},
        {"Nicolás Peña", "nicop"}, {"Paula Salazar", "paulas"}, {"Santiago Quintero", "santiq"},
        {"Tatiana Mejía", "tatim"}, {"Mateo Arias", "mateoa"}, {"Natalia Osorio", "nataliao"},
        {"Sebastián Rojas", "sebastianr"}
    };

    private static final String[] MESSAGES = {
        "Terminando el milestone del proyecto de Desarrollo Web.",
        "Hoy aprendí que la paginación se resuelve en el backend.",
        "Primer commit con rama por funcionalidad y pull request revisado.",
        "El login con JWT ya funciona.",
        "Configuré ESLint y por fin cero warnings.",
        "Centralicé las llamadas a la API en la carpeta services.",
        "Seed listo para probar el feed con datos reales.",
        "¿Alguien más tuvo problemas con CORS entre Vite y el backend?",
        "El contador de 280 caracteres ya funciona.",
        "README con endpoints y variables de entorno completo.",
        "Café, música y a programar toda la noche.",
        "Recordatorio: en la sustentación todos debemos conocer todo el código."
    };

    private final UserRepository userRepository;
    private final TweetRepository tweetRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      TweetRepository tweetRepository,
                      FollowRepository followRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tweetRepository = tweetRepository;
        this.followRepository = followRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Seed skipped: the database already has users");
            return;
        }

        String passwordHash = passwordEncoder.encode(SEED_PASSWORD);
        List<User> users = new ArrayList<>();
        for (String[] person : PEOPLE) {
            User user = new User();
            user.setFullName(person[0]);
            user.setUsername(person[1]);
            user.setEmail(person[1] + "@xclone.dev");
            user.setPasswordHash(passwordHash);
            users.add(user);
        }
        users = userRepository.saveAll(users);

        Instant now = Instant.now();
        List<Tweet> tweets = new ArrayList<>();
        for (int i = 0; i < 60; i++) {
            Tweet tweet = new Tweet();
            tweet.setAuthor(users.get(i % users.size()));
            tweet.setContent(MESSAGES[i % MESSAGES.length] + " #" + (i + 1));
            tweet.setCreatedAt(now.minus((60L - i) * 3, ChronoUnit.HOURS));
            tweets.add(tweet);
        }
        tweetRepository.saveAll(tweets);

        List<Follow> follows = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (int i = 1; i < users.size(); i++) {
            addFollow(follows, seen, users.get(i), users.get(0));
        }
        for (int i = 1; i <= 12; i++) {
            addFollow(follows, seen, users.get(0), users.get(i));
        }
        for (int i = 1; i < users.size(); i++) {
            addFollow(follows, seen, users.get(i), users.get((i % 24) + 1));
        }
        followRepository.saveAll(follows);

        log.info("Seed completed: {} users, {} tweets, {} follows", users.size(), tweets.size(), follows.size());
    }

    private void addFollow(List<Follow> follows, Set<String> seen, User follower, User followed) {
        if (follower.getId().equals(followed.getId())) {
            return;
        }
        if (!seen.add(follower.getId() + ":" + followed.getId())) {
            return;
        }
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);
        follows.add(follow);
    }
}
