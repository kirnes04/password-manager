package com.example.hw.dto;

public class DirectoryDTO {
    public int id;
    public String name;

    public DirectoryDTO() {
    }
    public DirectoryDTO(int id, String name) {
        this.id = id;
        this.name = name;
    }
    public String getName() {
        return name;
    }
}
