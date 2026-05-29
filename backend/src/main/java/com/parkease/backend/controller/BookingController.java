package com.parkease.backend.controller;

import com.parkease.backend.dto.BookingRequest;
import com.parkease.backend.dto.BookingResponse;
import com.parkease.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
            bookingService.createBooking(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication) {
        return ResponseEntity.ok(
            bookingService.getUserBookings(authentication.getName()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}