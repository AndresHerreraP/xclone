package com.xclone.backend.service;

import com.xclone.backend.dto.AuthResponse;
import com.xclone.backend.dto.LoginRequest;
import com.xclone.backend.dto.UserResponse;
import com.xclone.backend.entity.User;
import com.xclone.backend.exception.UnauthorizedException;
import com.xclone.backend.repository.UserRepository;
import com.xclone.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // NOTE: there is intentionally no register flow in this project. Users come from the seed data.

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new UnauthorizedException("Usuario o contraseña incorrectos"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Usuario o contraseña incorrectos");
        }
        return new AuthResponse(jwtService.generateToken(user), toResponse(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getUsername(),
                user.getEmail(), user.getCreatedAt());
    }
}
