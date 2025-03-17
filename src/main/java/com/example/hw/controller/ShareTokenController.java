package com.example.hw.controller;

import com.example.hw.dao.request.ShareRecordRequest;
import com.example.hw.service.ShareTokenService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/records")
@CrossOrigin("*")
public class ShareTokenController {

    private final ShareTokenService shareTokenService;

    private final MeterRegistry meterRegistry;

    public ShareTokenController(ShareTokenService shareTokenService, MeterRegistry meterRegistry) {
        this.shareTokenService = shareTokenService;
        this.meterRegistry = meterRegistry;
    }

    @PostMapping(path = "/share")
    public ResponseEntity<?> shareRecord(@RequestBody ShareRecordRequest request, Principal principal) {
        try {
            var res = shareTokenService.shareRecord(request,  principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    @GetMapping(path = "/useToken/{token}")
    public ResponseEntity<?> useToken(@PathVariable("token") Integer token_id, @RequestParam Integer directoryId, Principal principal) {
        try {
            var res = shareTokenService.useToken(token_id, principal.getName(), directoryId);
            Timer timer = Timer
                    .builder("access_timer")
                    .publishPercentiles(0.5, 0.90, 0.95, 0.99)
                    .publishPercentileHistogram()
                    .register(meterRegistry);
            timer.record(res.getValue().until(LocalDateTime.now(), ChronoUnit.SECONDS), TimeUnit.SECONDS);
            return ResponseEntity.ok(res.getKey());
        } catch (IllegalArgumentException exception) {
            if (exception.getMessage().equals("This token is already used")) {
                meterRegistry.counter("access_used_tokens_counter").increment();
            } else if (exception.getMessage().equals("This token is expired")) {
                meterRegistry.counter("access_expired_tokens_counter").increment();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }
}
