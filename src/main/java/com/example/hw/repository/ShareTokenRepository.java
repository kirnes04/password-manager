package com.example.hw.repository;

import com.example.hw.entities.ShareToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ShareTokenRepository extends JpaRepository<ShareToken, Integer> {
    default void deleteSomeByExpirationDateBefore(LocalDateTime date) {
        var counter = Integer.parseInt("${count.of.tokens.to.delete}");
        for (ShareToken token : findAll()) {
            if (token.getExpirationDate().isBefore(date)) {
                delete(token);
                counter--;
            }
            if (counter == 0) {
                return;
            }
        }
    }
}
