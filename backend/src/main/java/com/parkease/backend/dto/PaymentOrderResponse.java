package com.parkease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentOrderResponse {
    private String orderId;
    private Double amount;
    private String currency;
    private String keyId;
}