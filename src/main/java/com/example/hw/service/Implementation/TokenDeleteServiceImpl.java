package com.example.hw.service.Implementation;

import com.example.hw.repository.ShareTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TokenDeleteServiceImpl {
    private final ShareTokenRepository shareTokenRepository;

    public TokenDeleteServiceImpl(ShareTokenRepository shareTokenRepository) {
        this.shareTokenRepository = shareTokenRepository;
    }

    @Scheduled(cron = "${interval.in.cron}")
    public void deleteExpiredTokens() {
        shareTokenRepository.deleteSomeByExpirationDateBefore(LocalDateTime.now());
    }
}
