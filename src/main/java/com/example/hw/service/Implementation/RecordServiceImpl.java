package com.example.hw.service.Implementation;

import com.example.hw.RecordMapper;
import com.example.hw.repository.DirectoryRepository;
import com.example.hw.repository.RecordRepository;
import com.example.hw.dto.CreateRecordDTO;
import com.example.hw.entities.Record;
import com.example.hw.dto.RecordDTO;
import com.example.hw.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RecordServiceImpl implements com.example.hw.service.RecordService {
    private static final Logger logger = LoggerFactory.getLogger(RecordServiceImpl.class);
    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final RecordMapper recordMapper;
    private final DirectoryRepository directoryRepository;

    public RecordServiceImpl(RecordRepository recordRepository, UserRepository userRepository, RecordMapper recordMapper, PasswordEncoder passwordEncoder, DirectoryRepository directoryRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.recordMapper = recordMapper;
        this.directoryRepository = directoryRepository;
        logger.info("Initializing RecordServiceImpl");
    }

    public List<RecordDTO> getAllRecords(Integer directoryId, String email) {
        logger.debug("Retrieving all records for user: {} in directory: {}", email, directoryId);
        List<RecordDTO> records = recordMapper.toDto(recordRepository.findAllByUserEmail(email, directoryId));
        logger.debug("Found {} records", records.size());
        return records;
    }

    public CreateRecordDTO addRecord(CreateRecordDTO record, String email, Integer directoryId) {
        logger.debug("Adding new record for user: {} in directory: {}", email, directoryId);
        if (record.getName() == null) {
            logger.warn("Failed to add record: name field is empty");
            throw new IllegalArgumentException("Field name can't be empty");
        }
        if (record.getPassword() == null) {
            logger.warn("Failed to add record: password field is empty");
            throw new IllegalArgumentException("Field password can't be empty");
        }

        if (directoryId != 0) {
            var dir = directoryRepository.findById(directoryId);
            if (dir.isEmpty()) {
                logger.warn("Failed to add record: directory {} does not exist", directoryId);
                throw new IllegalArgumentException("Such directory does not exist");
            }

            if (!Objects.equals(dir.get().getUserId(), userRepository.findIdByEmail(email))) {
                logger.warn("Failed to add record: user {} does not have access to directory {}", email, directoryId);
                throw new IllegalArgumentException("You cannot add record to this directory");
            }
        }
        var newRecord = recordMapper.fromDto(record);
        newRecord.setLogin(record.getLogin());
        newRecord.setUrl(record.getUrl());
        newRecord.setUserId(userRepository.findIdByEmail(email));
        newRecord.setDirectoryId(directoryId);
        recordRepository.save(newRecord);
        logger.info("Successfully added new record for user: {}", email);
        return record;
    }

    public Record patchRecord(Integer recordId, Integer directoryId, String email) {
        logger.debug("Patching record {} to directory {} for user: {}", recordId, directoryId, email);
        if (!recordRepository.existsById(recordId)) {
            logger.warn("Failed to patch record: record {} does not exist", recordId);
            throw new IllegalArgumentException("Such record does not exist");
        }

        var record = recordRepository.getReferenceById(recordId);
        if (directoryId != 0) {
            var directory = directoryRepository.findById(directoryId)
                    .orElseThrow(() -> {
                        logger.warn("Failed to patch record: directory {} does not exist", directoryId);
                        return new IllegalArgumentException("Such directory does not exist");
                    });
            if (!Objects.equals(directory.getUserId(), userRepository.findIdByEmail(email))) {
                logger.warn("Failed to patch record: user {} does not have access to directory {}", email, directoryId);
                throw new IllegalArgumentException("You cannot add record to this directory");
            }
        }

        record.setDirectoryId(directoryId);
        Record updatedRecord = recordRepository.save(record);
        logger.info("Successfully patched record {} to directory {}", recordId, directoryId);
        return updatedRecord;
    }

    public Optional<Record> getRecordById(Integer id, String email) {
        logger.debug("Retrieving record {} for user: {}", id, email);
        var res = recordRepository.findById(id);
        if (res.isPresent()) {
            if (!Objects.equals(res.get().getUserId(), userRepository.findIdByEmail(email))) {
                logger.warn("Failed to get record: user {} does not have access to record {}", email, id);
                throw new IllegalArgumentException("Wrong record id");
            }
        } else {
            logger.debug("Record {} not found", id);
        }
        return res;
    }

    public Record putRecordById(Integer id, Record record, String email) {
        logger.debug("Updating record {} for user: {}", id, email);
        if (record.getName() == null) {
            logger.warn("Failed to update record: name field is null");
            throw new IllegalArgumentException("You can't change record's name to null");
        }
        if (record.getPassword() == null) {
            logger.warn("Failed to update record: password field is null");
            throw new IllegalArgumentException("You can't change record's password to null");
        }
        if (!Objects.equals(id, record.getId())) {
            logger.warn("Failed to update record: id mismatch");
            throw new IllegalArgumentException("You can't change record's id");
        }
        if (!Objects.equals(userRepository.findIdByEmail(email), record.getUserId())) {
            logger.warn("Failed to update record: user {} does not own record {}", email, id);
            throw new IllegalArgumentException("You can't change someone else's record");
        }

        if (recordRepository.findById(id).isPresent()) {
            var rec = recordRepository.findById(id).get();
            if (!Objects.equals(rec.getUserId(), record.getUserId())) {
                logger.warn("Failed to update record: cannot change record owner");
                throw new IllegalArgumentException("You can't change the owner of the record this way");
            }
            if (!Objects.equals(rec.getDirectoryId(), record.getDirectoryId())) {
                logger.warn("Failed to update record: cannot change directory through put request");
                throw new IllegalArgumentException("You can't change the directory of the record this way." +
                        " Use patch request instead");
            }
        }

        var recordToUpdate = recordRepository.getReferenceById(id);
        recordToUpdate.setName(record.getName());
        recordToUpdate.setPassword(record.getPassword());
        recordToUpdate.setLogin(record.getLogin());
        recordToUpdate.setUrl(record.getUrl());
        Record updatedRecord = recordRepository.save(recordToUpdate);
        logger.info("Successfully updated record {}", id);
        return updatedRecord;
    }

    public void deleteRecordById(Integer id, String email) {
        logger.debug("Deleting record {} for user: {}", id, email);
        if (!recordRepository.existsById(id)) {
            logger.warn("Failed to delete record: record {} does not exist", id);
            throw new IllegalArgumentException("Such record does not exist");
        }
        if (!Objects.equals(userRepository.findIdByEmail(email), recordRepository.getReferenceById(id).getUserId())) {
            logger.warn("Failed to delete record: user {} does not own record {}", email, id);
            throw new IllegalArgumentException("You can't delete someone else's record");
        }
        recordRepository.deleteById(id);
        logger.info("Successfully deleted record {}", id);
    }
}
