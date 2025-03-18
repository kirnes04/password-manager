package com.example.hw.service;

import com.example.hw.dao.request.ShareRecordRequest;
import com.example.hw.dao.response.ShareTokenResponse;
import com.example.hw.entities.Record;
import com.example.hw.entities.ShareToken;
import javafx.util.Pair;

import java.time.LocalDateTime;

public interface ShareTokenService {
    ShareTokenResponse shareRecord(ShareRecordRequest request, String email);

    Pair<Record, LocalDateTime> useToken(String encodedToken, String email, Integer directoryId);
}
