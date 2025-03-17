package com.example.hw.repository;

import com.example.hw.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "select * from public.user where email = ?1", nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Query(value = "select id from public.user where email = ?1 LIMIT 1", nativeQuery = true)
    Integer findIdByEmail(String email);
}
