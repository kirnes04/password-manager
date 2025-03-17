package com.example.hw.dao.request;

import java.time.LocalDateTime;

public class ShareRecordRequest {
    Integer record_id;

    LocalDateTime expirationDate;

    public ShareRecordRequest() {
    }

    public ShareRecordRequest(Integer record_id, LocalDateTime expirationDate) {
        this.record_id = record_id;
        this.expirationDate = expirationDate;
    }

    public Integer getRecord_id() {
        return record_id;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }
}
