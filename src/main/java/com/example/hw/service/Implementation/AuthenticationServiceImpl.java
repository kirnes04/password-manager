package com.example.hw.service.Implementation;

import com.example.hw.dao.request.SignInRequest;
import com.example.hw.dao.request.SignUpRequest;
import com.example.hw.dao.response.JwtAuthenticationResponse;
import com.example.hw.entities.User;
import com.example.hw.repository.UserRepository;
import com.example.hw.service.AuthenticationService;
import com.example.hw.service.DirectoryService;
import com.example.hw.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final DirectoryService directoryService;

    public AuthenticationServiceImpl(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder,
                                     JwtService jwtService,
                                     AuthenticationManager authenticationManager,
                                     DirectoryService directoryService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.directoryService = directoryService;
        logger.info("Initializing AuthenticationServiceImpl");
    }

    @Override
    public JwtAuthenticationResponse signUp(SignUpRequest request) {
        logger.debug("Processing signup request for email: {}", request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Signup failed: User with email {} already exists", request.getEmail());
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists.");
        }
        User user = new User(0,
                request.getEmail(),
                request.getLogin(),
                passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        logger.info("User successfully registered with email: {}", request.getEmail());
        createParentDirectory(user.getId());
        var jwt = jwtService.generateToken(user);
        return new JwtAuthenticationResponse(jwt);
    }

    @Override
    public JwtAuthenticationResponse signIn(SignInRequest request) {
        logger.debug("Processing signin request for email: {}", request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(),
                            request.getPassword()));
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        logger.warn("Signin failed: Invalid credentials for email: {}", request.getEmail());
                        return new IllegalArgumentException("Invalid name or password.");
                    });
            var jwt = jwtService.generateToken(user);
            logger.info("User successfully signed in with email: {}", request.getEmail());
            return new JwtAuthenticationResponse(jwt);
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    private void createParentDirectory(Integer id) {
        directoryService.createParentDirectory(id);
    }
}
