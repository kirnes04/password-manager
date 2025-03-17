package com.example.hw.service;

public interface PasswordService {
    String generatePassword(Integer length, Integer upper, Integer lower, Integer digit, Integer special);
}
