package com.example.hw.service;

import com.example.hw.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();

    List<User> getAllUsers();
}
