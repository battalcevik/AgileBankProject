package com.example.bankapp.transfer;

import com.example.bankapp.user.Account;
import com.example.bankapp.user.AccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransferService {

    private final AccountRepository accounts;

    public TransferService(AccountRepository accounts) {
        this.accounts = accounts;
    }

    @Transactional
    public void transferWithinUser(Long userId, Long fromId, Long toId, BigDecimal amount, String memo) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Account from = accounts.findById(fromId).orElseThrow();
        Account to   = accounts.findById(toId).orElseThrow();

        // both accounts must belong to the current user
        if (!from.getUser().getId().equals(userId) || !to.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Accounts must belong to the same user");
        }

        // sufficient funds
        if (from.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        accounts.save(from);
        accounts.save(to);
        // Optionally: persist a Transfer ledger row with the 'memo'
    }
}
