package com.example.hw.service;

import com.example.hw.dto.DirectoryDTO;
import com.example.hw.entities.Directory;

import java.util.List;

public interface DirectoryService {
    Directory createDirectory(String name, Integer parentId, String email);

    List<DirectoryDTO> getDirectories(String email, Integer parentId);

    Directory createParentDirectory(Integer id);
}
