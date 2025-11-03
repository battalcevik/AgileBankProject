package com.example.bankapp.transfer;

import com.example.bankapp.user.User;
import com.example.bankapp.user.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService service;
    private final UserRepository userRepo;

    public TransferController(TransferService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    public static record TransferRequest(Long fromId, Long toId, @Min(1) double amount, String memo){}

    @PostMapping
    @Transactional
    public ResponseEntity<?> transfer(@RequestBody TransferRequest req, @AuthenticationPrincipal UserDetails principal) {
        if (req.fromId()==null || req.toId()==null || req.fromId().equals(req.toId())) {
            return ResponseEntity.badRequest().body(Map.of("error","Invalid account selection"));
        }
        if (req.amount() <= 0) return ResponseEntity.badRequest().body(Map.of("error","Amount must be positive"));

        User u = userRepo.findByEmail(principal.getUsername()).orElseThrow();
        service.transferWithinUser(u.getId(), req.fromId(), req.toId(), BigDecimal.valueOf(req.amount()), req.memo());
        return ResponseEntity.ok(Map.of("status","ok"));
    }
}
