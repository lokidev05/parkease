package com.parkease.backend.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private Long bookingId;
    private Double amount;
}