package com.parkease.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long slotId;
    private Integer durationHours;
}