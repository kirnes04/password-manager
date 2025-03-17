package com.example.hw.service;

import com.example.hw.dto.CreateRecordDTO;
import com.example.hw.entities.Record;
import com.example.hw.dto.RecordDTO;

import java.util.List;
import java.util.Optional;

public interface RecordService {
    List<RecordDTO> getAllRecords(Integer directoryId, String email);

    CreateRecordDTO addRecord(CreateRecordDTO record, String email, Integer directoryId);

    Optional<Record> getRecordById(Integer id, String email);

    Record putRecordById(Integer id, Record record, String email);

    Record patchRecord(Integer recordId, Integer directoryId, String email);
}
