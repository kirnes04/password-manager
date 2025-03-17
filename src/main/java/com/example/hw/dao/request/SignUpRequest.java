package com.example.hw.dao.request;

public class SignUpRequest {
    String email;
    String login;
    String password;

    public SignUpRequest(String email, String login, String password) {
        this.email = email;
        this.login = login;
        this.password = password;
    }

    SignUpRequest() {
    }

    public String getEmail() {
        return email;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }
}
