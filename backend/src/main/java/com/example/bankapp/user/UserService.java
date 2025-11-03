package com.example.bankapp.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user, String rawPassword) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        User saved = userRepository.save(user);

        // Create default checking and savings accounts
        Account checking = new Account();
        checking.setType(Account.AccountType.CHECKING);
        checking.setBalance(new BigDecimal("100.00"));
        checking.setUser(saved);

        Account savings = new Account();
        savings.setType(Account.AccountType.SAVINGS);
        savings.setBalance(new BigDecimal("250.00"));
        savings.setUser(saved);

        accountRepository.saveAll(List.of(checking, savings));
        return saved;
    }

    public User findByEmail(String email) { return userRepository.findByEmail(email).orElse(null); }
}
