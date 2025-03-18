package com.example.hw;

import com.example.hw.dto.DirectoryDTO;
import com.example.hw.entities.Directory;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DirectoryMapper {
    List<DirectoryDTO> toDto(List<Directory> dto);
    DirectoryDTO toDto(Directory directory);
}
