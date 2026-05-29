package com.parkease.backend.controller;

import com.parkease.backend.dto.SlotRequest;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {
        return ResponseEntity.ok(slotService.getAllSlots());
    }

    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlot>> getAvailableSlots() {
        return ResponseEntity.ok(slotService.getAvailableSlots());
    }

    @PostMapping
    public ResponseEntity<ParkingSlot> createSlot(@RequestBody SlotRequest request) {
        return ResponseEntity.ok(slotService.createSlot(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(slotService.updateSlotStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.ok().build();
    }
}