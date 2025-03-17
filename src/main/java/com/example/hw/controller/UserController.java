package com.example.hw.controller;

import com.example.hw.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // For testing only
//    @GetMapping
//    ResponseEntity<?> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//
//    @GetMapping("/now")
//    ResponseEntity<?> GetCurrentTime() {
//        return ResponseEntity.ok(LocalDateTime.now());
//    }
}
