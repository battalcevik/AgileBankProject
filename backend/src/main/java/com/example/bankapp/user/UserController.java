package com.example.bankapp.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public UserController(UserRepository userRepository, AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @GetMapping("/users/me")
    public Map<String, Object> me(Authentication auth) {
        User u = userRepository.findByEmail(auth.getName()).orElseThrow();
        return Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName(),
                "address", u.getAddress(),
                "phone", u.getPhone(),
                "roles", u.getRoles()
        );
    }

    // Update address/phone for the current user (email stays immutable here)
    public static record UpdateMeRequest(String address, String phone) {}

    @PutMapping("/users/me")
    public ResponseEntity<?> updateMe(Authentication auth, @RequestBody UpdateMeRequest req) {
        User u = userRepository.findByEmail(auth.getName()).orElseThrow();

        if (req.address() != null) u.setAddress(req.address().trim());
        if (req.phone()   != null) u.setPhone(req.phone().trim());

        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    @GetMapping("/accounts/me")
    public List<Account> myAccounts(Authentication auth) {
        User u = userRepository.findByEmail(auth.getName()).orElseThrow();
        return accountRepository.findByUserId(u.getId());
    }
}
