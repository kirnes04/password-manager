package com.example.hw.controller;

import com.example.hw.service.DirectoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/directory")
@CrossOrigin("*")
public class DirectoryController {
    private final DirectoryService directoryService;

    public DirectoryController(DirectoryService directoryService) {
        this.directoryService = directoryService;
    }

    @PostMapping
    public ResponseEntity<?> createDirectory(@RequestBody String name,
                                             @RequestParam(required = false, defaultValue = "0") int parentId,
                                             Principal principal
    ) {
        try {
            var result = directoryService.createDirectory(name, parentId, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(400).body(exception.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getDirectories(@RequestParam(required = false, defaultValue = "0") int parentId, Principal principal) {
        return ResponseEntity.ok(directoryService.getDirectories(principal.getName(), parentId));
    }
}
