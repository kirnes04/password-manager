package com.example.hw.repository;

import com.example.hw.entities.Directory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, Integer> {
    @Query(value = "select * from public.directory where name = ?1 and parent_id = ?2 and user_id = ?3", nativeQuery = true)
    Optional<Directory> getDirectoriesByName(String name, Integer parentId, Integer userId);

    @Query(value = "select * from public.directory where user_id = ?1 and parent_id = ?2", nativeQuery = true)
    List<Directory> getAllByUserId(Integer userId, Integer parentId);
}
