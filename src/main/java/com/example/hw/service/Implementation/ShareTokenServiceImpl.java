package com.example.hw.service.Implementation;

import com.example.hw.dao.request.ShareRecordRequest;
import com.example.hw.entities.Record;
import com.example.hw.entities.ShareToken;
import com.example.hw.repository.RecordRepository;
import com.example.hw.repository.ShareTokenRepository;
import com.example.hw.repository.UserRepository;
import com.example.hw.service.ShareTokenService;
import javafx.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class ShareTokenServiceImpl implements ShareTokenService {
    private static final Logger logger = LoggerFactory.getLogger(ShareTokenServiceImpl.class);
    private final ShareTokenRepository shareTokenRepository;
    private final RecordRepository recordRepository;
    private final UserRepository userRepository;

    public ShareTokenServiceImpl(ShareTokenRepository shareTokenRepository, RecordRepository recordRepository, UserRepository userRepository) {
        this.shareTokenRepository = shareTokenRepository;
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        logger.info("Initializing ShareTokenServiceImpl");
    }

    @Override
    public ShareToken shareRecord(ShareRecordRequest request, String email) {
        logger.debug("Creating share token for record {} by user: {} with expiration date: {}", request.getRecord_id(), email, request.getExpirationDate());
        var userId = userRepository.findIdByEmail(email);
        var record = recordRepository.findById(request.getRecord_id());
        if (!(record.isPresent() && Objects.equals(record.get().getUserId(), userId))) {
            logger.warn("Failed to create share token: user {} does not own record {}", email, request.getRecord_id());
            throw new IllegalArgumentException("You can share only your own record");
        }
        var token = new ShareToken(0, false,
                LocalDateTime.now(),
                (request.getExpirationDate() == null) ?
                        LocalDateTime.now().plusYears(1) :
                        request.getExpirationDate(),
                record.get().getId());
        ShareToken savedToken = shareTokenRepository.save(token);
        logger.info("Successfully created share token {} for record {}", savedToken.getId(), request.getRecord_id());
        return savedToken;
    }

    // token is token_id

    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Override
    public Pair<Record, LocalDateTime> useToken(Integer tokenId, String email, Integer directoryId) {
        logger.debug("Using share token {} by user: {}", tokenId, email);
        if (!shareTokenRepository.existsById(tokenId)) {
            logger.warn("Failed to use token: token {} does not exist", tokenId);
            throw new IllegalArgumentException("Such token does not exist");
        }

        var token = shareTokenRepository.getReferenceById(tokenId);
        var userId = userRepository.findIdByEmail(email);
        if (token.getIsUsed()) {
            logger.warn("Failed to use token: token {} is already used", tokenId);
            throw new IllegalArgumentException("This token is already used");
        }
        if (!token.getExpirationDate().isAfter(LocalDateTime.now())) {
            logger.warn("Failed to use token: token {} is expired", tokenId);
            throw new IllegalArgumentException("This token is expired");
        }

        token.setIsUsed(true);
        var record = recordRepository.findById(token.getRecordId());
        if (record.isEmpty()) {
            logger.error("Failed to use token: record {} not found for token {}", token.getRecordId(), tokenId);
            throw new IllegalArgumentException("Something went wrong and such record does not exist");
        }

        var newRecord = new Record(0,
                record.get().getName(),
                record.get().getLogin(),
                record.get().getPassword(),
                record.get().getUrl(),
                userId,
                directoryId);
        Record savedRecord = recordRepository.save(newRecord);
        logger.info("Successfully used share token {} to create record {}", tokenId, savedRecord.getId());
        return new Pair<Record, LocalDateTime>(savedRecord, token.getCreationDate());
    }
}
