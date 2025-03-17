package com.example.hw.repository;

import com.example.hw.entities.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Integer> {
    @Query(value = """
            SELECT * 
            FROM public.record 
            WHERE user_id = (SELECT id FROM public.user WHERE email = ?1) 
              AND (directory_id = ?2 OR ?2 = 0)
            """,
            nativeQuery = true)
    List<Record> findAllByUserEmail(String email, Integer directoryId);
}
