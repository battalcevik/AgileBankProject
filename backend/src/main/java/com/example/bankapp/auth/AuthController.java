package com.example.bankapp.auth;

import com.example.bankapp.security.JwtService;
import com.example.bankapp.user.User;
import com.example.bankapp.user.UserRepository;
import com.example.bankapp.user.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository resetRepo;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService,
                          UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository resetRepo) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.resetRepo = resetRepo;
    }

    public static record SignupRequest(String email, String password, String firstName, String lastName,
                                       String address, String phone, String ssn7){}
    public static record LoginRequest(String email, String password){}

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        User u = new User();
        u.setEmail(req.email());
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setAddress(req.address());
        u.setPhone(req.phone());
        u.setSsn7(req.ssn7());
        User saved = userService.register(u, req.password());
        return ResponseEntity.ok(Map.of("message","User registered", "userId", saved.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password())
            );
        } catch (BadCredentialsException ex) {
            // Bad username/password -> 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtService.generateToken(req.email());
        session.setAttribute("lastLogin", Instant.now().toString());
        return ResponseEntity.ok(Map.of("token", token, "sessionId", session.getId()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String,String> body) {
        String email = body.get("email");
        User u = userRepository.findByEmail(email).orElse(null);
        if (u == null) return ResponseEntity.badRequest().body(Map.of("error","No user with that email"));
        String token = UUID.randomUUID().toString();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(token);
        prt.setUser(u);
        prt.setExpiresAt(Instant.now().plusSeconds(3600));
        resetRepo.save(prt);
        // demo: return token (prod would email)
        return ResponseEntity.ok(Map.of("resetToken", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String,String> body) {
        String token = body.get("token");
        String newPwd = body.get("newPassword");
        PasswordResetToken prt = resetRepo.findByToken(token).orElse(null);
        if (prt == null || prt.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body(Map.of("error","Invalid or expired token"));
        }
        User u = prt.getUser();
        u.setPasswordHash(passwordEncoder.encode(newPwd));
        userRepository.save(u);
        resetRepo.deleteByToken(token);
        return ResponseEntity.ok(Map.of("message","Password reset successful"));
    }
}
