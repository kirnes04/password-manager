package com.example.hw;

import com.example.hw.dto.CreateRecordDTO;
import com.example.hw.dto.RecordDTO;
import com.example.hw.entities.Record;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-17T20:13:10+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.5 (Amazon.com Inc.)"
)
@Component
public class RecordMapperImpl implements RecordMapper {

    @Override
    public Record fromDto(CreateRecordDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Record record = new Record();

        record.setName( dto.getName() );
        record.setLogin( dto.getLogin() );
        record.setPassword( dto.getPassword() );
        record.setUrl( dto.getUrl() );

        return record;
    }

    @Override
    public RecordDTO toDto(Record dto) {
        if ( dto == null ) {
            return null;
        }

        RecordDTO recordDTO = new RecordDTO();

        if ( dto.getId() != null ) {
            recordDTO.id = dto.getId();
        }
        recordDTO.name = dto.getName();

        return recordDTO;
    }

    @Override
    public List<RecordDTO> toDto(List<Record> dto) {
        if ( dto == null ) {
            return null;
        }

        List<RecordDTO> list = new ArrayList<RecordDTO>( dto.size() );
        for ( Record record : dto ) {
            list.add( toDto( record ) );
        }

        return list;
    }
}
