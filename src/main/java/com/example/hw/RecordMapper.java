package com.example.hw;

import com.example.hw.dto.CreateRecordDTO;
import com.example.hw.entities.Record;
import com.example.hw.dto.RecordDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RecordMapper {
    Record fromDto(CreateRecordDTO dto);

    RecordDTO toDto(Record dto);

    List<RecordDTO> toDto(List<Record> dto);
}
