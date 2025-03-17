package com.example.hw.dao.request;

public class SignInRequest {
    String email;
    String password;

    public SignInRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    SignInRequest() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
