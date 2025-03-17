package com.example.hw.service.Implementation;

import com.example.hw.service.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class PasswordServiceImpl implements PasswordService {

    @Override
    public String generatePassword(Integer length, Integer upper, Integer lower, Integer digit, Integer special) {
        log.debug("Generating password with length: {}, upper: {}, lower: {}, digit: {}, special: {}",
                length, upper, lower, digit, special);
        PasswordGenerator generator = new PasswordGenerator();

        List<CharacterRule> rules = Arrays.asList(
                new CharacterRule(EnglishCharacterData.UpperCase, upper),
                new CharacterRule(EnglishCharacterData.LowerCase, lower),
                new CharacterRule(EnglishCharacterData.Digit, digit),
                new CharacterRule(EnglishCharacterData.Special, special)
        );

        String password = generator.generatePassword(length, rules);
        log.debug("Generated password: {}", password);
        return password;
    }
}
