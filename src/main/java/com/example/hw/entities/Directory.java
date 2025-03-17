package com.example.hw.entities;

import jakarta.persistence.*;

@Table(name = "directory")
@Entity
public class Directory {
    Integer id;
    String name;
    Integer userId;
    Integer parentId;

    public Directory() {
    }

    public Directory(int id, String name, int userId, int parentId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.parentId = parentId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "user_id", nullable = false)
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Column(name = "parent_id", nullable = false)
    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
}
