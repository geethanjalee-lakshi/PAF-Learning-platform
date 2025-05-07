package com.example.socialengagement.controller;

import com.example.socialengagement.dto.*;
import com.example.socialengagement.service.AuthService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            AuthResponse response = authService.register(req);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            // This is thrown if validation fails
            Map<String, Object> error = new HashMap<>();
            error.put("status", e.getStatusCode().value());
            error.put("error", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (Exception e) {
            // Fallback for unexpected errors
            Map<String, Object> error = new HashMap<>();
            error.put("status", 500);
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            AuthResponse response = authService.login(req);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", e.getStatusCode().value());
            error.put("error", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", 500);
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}