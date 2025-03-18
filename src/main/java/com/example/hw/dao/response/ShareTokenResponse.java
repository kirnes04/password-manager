package com.example.hw.dao.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class ShareTokenResponse {
    private String token;
    private LocalDateTime expirationDate;

    public ShareTokenResponse(String token, LocalDateTime expirationDate) {
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }
}
