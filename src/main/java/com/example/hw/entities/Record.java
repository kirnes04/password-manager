package com.example.hw.entities;

import jakarta.persistence.*;

@Table(name = "record")
@Entity
public class Record {
    private Integer id;
    public String name;
    private String login;
    private String password;
    private String url;
    private Integer userId;

    private Integer directoryId;

    public Record() {
    }

    public Record(int id, String name, String login, String password, String url, Integer userId, Integer directoryId) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.password = password;
        this.url = url;
        this.userId = userId;
        this.directoryId = directoryId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "login")
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Column(name = "password", nullable = false)
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "url")
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }

    @Column(name = "user_id", nullable = false)
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Column(name = "directory_id", nullable = false)
    public Integer getDirectoryId() {
        return directoryId;
    }

    public void setDirectoryId(Integer directoryId) {
        this.directoryId = directoryId;
    }
}
