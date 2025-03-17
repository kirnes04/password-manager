package com.example.hw.dto;

public class CreateRecordDTO {
    String name;
    String login;
    String password;
    String url;

    public CreateRecordDTO(String name, String login, String password, String url) {
        this.name = name;
        this.login = login;
        this.password = password;
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
