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
            name = name.replaceAll("^\"|\"$", "");
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

    @GetMapping(path = "/root")
    public ResponseEntity<?> getRootDirectory(Principal principal) {
        return ResponseEntity.ok(directoryService.getRootDirectory(principal.getName()));
    }

    @GetMapping(path = "/parents/{id}")
    public ResponseEntity<?> getParents(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(directoryService.getParentByDirectoryId(id));
    }

    @GetMapping(path = "/children/{id}")
    public ResponseEntity<?> getChildren(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(directoryService.getChildrenByDirectoryId(id));
    }
}
