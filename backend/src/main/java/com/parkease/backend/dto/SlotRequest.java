package com.parkease.backend.dto;

import lombok.Data;

@Data
public class SlotRequest {
    private String slotNumber;
    private String type;
    private Double pricePerHour;
    private String floor;
}