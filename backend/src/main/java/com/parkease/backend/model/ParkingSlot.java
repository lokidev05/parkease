package com.parkease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parking_slots")
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

    @Column(nullable = false)
    private Double pricePerHour;

    @Column
    private String floor;

    public enum SlotType {
        CAR, BIKE, EV
    }

    public enum SlotStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}