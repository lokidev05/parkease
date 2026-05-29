package com.parkease.backend.repository;

import com.parkease.backend.model.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByStatus(ParkingSlot.SlotStatus status);
    List<ParkingSlot> findByType(ParkingSlot.SlotType type);
    boolean existsBySlotNumber(String slotNumber);
}