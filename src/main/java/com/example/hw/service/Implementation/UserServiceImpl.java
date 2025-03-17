package com.example.hw.service.Implementation;

import com.example.hw.entities.User;
import com.example.hw.repository.UserRepository;
import com.example.hw.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        logger.info("Initializing UserServiceImpl");
    }

    @Override
    public UserDetailsService userDetailsService() {
        logger.debug("Creating UserDetailsService");
        return email -> {
            logger.debug("Loading user by email: {}", email);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logger.warn("User not found with email: {}", email);
                        return new UsernameNotFoundException("User not found");
                    });
        };
    }

    @Override
    public List<User> getAllUsers() {
        logger.debug("Retrieving all users");
        List<User> users = userRepository.findAll();
        logger.debug("Found {} users", users.size());
        return users;
    }
}
