package com.example.hw.service;

import com.example.hw.dao.request.ShareRecordRequest;
import com.example.hw.entities.Record;
import com.example.hw.entities.ShareToken;
import javafx.util.Pair;

import java.time.LocalDateTime;

public interface ShareTokenService {
    ShareToken shareRecord(ShareRecordRequest request, String email);

    Pair<Record, LocalDateTime> useToken(Integer token, String email);
}
