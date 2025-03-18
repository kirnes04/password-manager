package com.example.hw.controller;

import com.example.hw.service.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@CrossOrigin("*")
@RequestMapping("/api/password")
@Slf4j
public class PasswordController {
    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @GetMapping(path = "/generate")
    public ResponseEntity<?> generatePassword(@RequestParam Integer length,
                                           @RequestParam Integer upper,
                                           @RequestParam Integer lower,
                                           @RequestParam Integer digit,
                                           @RequestParam Integer special
    ) {
        try {
            return ResponseEntity.ok(passwordService.generatePassword(length, upper, lower, digit, special));
        }
        catch (IllegalArgumentException exception) {
            return ResponseEntity.status(400).body(exception.getMessage());
        }
    }
}
