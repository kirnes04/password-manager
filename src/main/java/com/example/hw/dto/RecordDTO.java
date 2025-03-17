package com.example.hw.dto;

public class RecordDTO {
        public int id;
        public String name;

        public RecordDTO() {
        }
        public RecordDTO(int id, String name) {
                this.id = id;
                this.name = name;
        }
        public String getName() {
                return name;
        }
}
