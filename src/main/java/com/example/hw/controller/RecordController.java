package com.example.hw.controller;

import com.example.hw.dto.CreateRecordDTO;
import com.example.hw.entities.Record;
import com.example.hw.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/records")
@CrossOrigin("*")
public class RecordController {
    private final RecordService recordService;

    @Autowired
    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public ResponseEntity<?> getAllRecords(@RequestParam(required = false, defaultValue = "0") Integer directoryId,
                                           Principal principal
    ) {
        return ResponseEntity.ok(recordService.getAllRecords(directoryId, principal.getName()));
    }

    @PatchMapping(path = "/{recordId}")
    public ResponseEntity<?> changeRecordDirectory(@PathVariable("recordId") Integer recordId,
                                                   @RequestParam Integer directoryId,
                                                   Principal principal
    ) {
        try {
            return ResponseEntity.ok(recordService.patchRecord(recordId, directoryId, principal.getName()));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addRecord(@RequestBody CreateRecordDTO record,
                                       @RequestParam(required = false, defaultValue = "0") Integer directoryId,
                                       Principal principal
    ) {
        try {
            var result = recordService.addRecord(record, principal.getName(), directoryId);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        }
    }

    @GetMapping(path = "/{recordId}")
    public ResponseEntity<?> getRecordById(@PathVariable("recordId") Integer id,
                                           Principal principal
    ) {
        try {
            var res = recordService.getRecordById(id, principal.getName());
            if (res.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Record with such id was not found");
            }
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    @PutMapping(path = "/{recordId}")
    public ResponseEntity<?> putRecordById(@PathVariable("recordId") Integer id,
                                           @RequestBody Record record,
                                           Principal principal
    ) {
        try {
            var res = recordService.putRecordById(id, record, principal.getName());
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    @DeleteMapping(path = "/{recordId}")
    public ResponseEntity<?> deleteRecordById(@PathVariable("recordId") Integer id,
                                              Principal principal
    ) {
        try {
            recordService.deleteRecordById(id, principal.getName());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }
}
