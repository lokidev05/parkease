package com.parkease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String slotNumber;
    private String slotType;
    private String floor;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationHours;
    private Double totalAmount;
    private Double penaltyAmount;
    private String status;
}