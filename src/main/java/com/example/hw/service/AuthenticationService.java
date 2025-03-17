package com.example.hw.service;

import com.example.hw.dao.request.SignInRequest;
import com.example.hw.dao.request.SignUpRequest;
import com.example.hw.dao.response.JwtAuthenticationResponse;

public interface AuthenticationService {
    JwtAuthenticationResponse signUp(SignUpRequest request);

    JwtAuthenticationResponse signIn(SignInRequest request);
}
