package com.example.hw.controller;

import com.example.hw.dao.request.SignInRequest;
import com.example.hw.dao.request.SignUpRequest;
import com.example.hw.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@CrossOrigin("*")
public class AuthenticationController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
        logger.info("Initializing AuthenticationController");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
        logger.debug("Processing signup request for email: {}", request.getEmail());
        try {
            var res = authenticationService.signUp(request);
            logger.info("Successfully processed signup request for email: {}", request.getEmail());
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException exception) {
            logger.warn("Signup request failed for email: {} - {}", request.getEmail(), exception.getMessage());
            return ResponseEntity.status(400).body(exception.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during signup for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest request) {
        logger.debug("Processing signin request for email: {}", request.getEmail());
        try {
            var res = authenticationService.signIn(request);
            logger.info("Successfully processed signin request for email: {}", request.getEmail());
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException exception) {
            logger.warn("Signin request failed for email: {} - {}", request.getEmail(), exception.getMessage());
            return ResponseEntity.status(400).body(exception.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during signin for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }
}
