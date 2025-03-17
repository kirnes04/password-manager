package com.example.hw;

import com.example.hw.dto.DirectoryDTO;
import com.example.hw.entities.Directory;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-17T20:40:56+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.5 (Amazon.com Inc.)"
)
@Component
public class DirectoryMapperImpl implements DirectoryMapper {

    @Override
    public List<DirectoryDTO> toDto(List<Directory> dto) {
        if ( dto == null ) {
            return null;
        }

        List<DirectoryDTO> list = new ArrayList<DirectoryDTO>( dto.size() );
        for ( Directory directory : dto ) {
            list.add( directoryToDirectoryDTO( directory ) );
        }

        return list;
    }

    protected DirectoryDTO directoryToDirectoryDTO(Directory directory) {
        if ( directory == null ) {
            return null;
        }

        DirectoryDTO directoryDTO = new DirectoryDTO();

        if ( directory.getId() != null ) {
            directoryDTO.id = directory.getId();
        }
        directoryDTO.name = directory.getName();

        return directoryDTO;
    }
}
