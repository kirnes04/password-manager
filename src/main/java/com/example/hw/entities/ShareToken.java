package com.example.hw.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "share_token", schema = "public")
public class ShareToken {
    Integer id;

    Boolean isUsed;

    LocalDateTime creationDate;

    LocalDateTime expirationDate;

    Integer recordId;

    public ShareToken() {

    }

    public ShareToken(Integer id,
                      Boolean isUsed,
                      LocalDateTime creationDate,
                      LocalDateTime expirationDate,
                      Integer recordId
    ) {
        this.id = id;
        this.isUsed = isUsed;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
        this.recordId = recordId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "is_used", nullable = false)
    public Boolean getIsUsed() {
        return isUsed;
    }

    public void setIsUsed(Boolean isUsed) {
        this.isUsed = isUsed;
    }

    @Column(name = "creation_date", nullable = false)
    public LocalDateTime getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
    @Column(name = "expiration_date")
    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    @Column(name = "record_id", nullable = false)
    public Integer getRecordId() {
        return recordId;
    }

    public void setRecordId(Integer recordId) {
        this.recordId = recordId;
    }
}
