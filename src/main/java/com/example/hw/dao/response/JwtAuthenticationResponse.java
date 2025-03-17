package com.example.hw.dao.response;

import lombok.Builder;

@Builder
public class JwtAuthenticationResponse {
    private String token;
    public JwtAuthenticationResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
