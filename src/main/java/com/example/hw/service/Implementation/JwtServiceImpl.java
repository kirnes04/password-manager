package com.example.hw.service.Implementation;

import com.example.hw.service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {
    private static final Logger logger = LoggerFactory.getLogger(JwtServiceImpl.class);

    @Value("${token.signing.key}")
    private String jwtSigningKey;
    @Override
    public String extractUserName(String token) {
        logger.debug("Extracting username from token");
        String username = extractClaim(token, Claims::getSubject);
        logger.debug("Extracted username: {}", username);
        return username;
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        logger.debug("Generating token for user: {}", userDetails.getUsername());
        String token = generateToken(new HashMap<>(), userDetails);
        logger.debug("Token generated successfully");
        return token;
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        logger.debug("Validating token for user: {}", userDetails.getUsername());
        final String userName = extractUserName(token);
        boolean isValid = (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
        logger.debug("Token validation result: {}", isValid);
        return isValid;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        logger.trace("Extracting claim from token");
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        logger.trace("Generating token with extra claims");
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }

    private boolean isTokenExpired(String token) {
        logger.trace("Checking if token is expired");
        boolean expired = extractExpiration(token).before(new Date());
        logger.trace("Token expiration check result: {}", expired);
        return expired;
    }

    private Date extractExpiration(String token) {
        logger.trace("Extracting expiration date from token");
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        logger.trace("Extracting all claims from token");
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        logger.trace("Getting signing key");
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
