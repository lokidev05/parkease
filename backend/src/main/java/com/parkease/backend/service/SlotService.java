package com.parkease.backend.service;

import com.parkease.backend.dto.SlotRequest;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final ParkingSlotRepository slotRepository;

    public ParkingSlot createSlot(SlotRequest request) {
        if (slotRepository.existsBySlotNumber(request.getSlotNumber())) {
            throw new RuntimeException("Slot number already exists");
        }
        ParkingSlot slot = new ParkingSlot();
        slot.setSlotNumber(request.getSlotNumber());
        slot.setType(ParkingSlot.SlotType.valueOf(request.getType()));
        slot.setStatus(ParkingSlot.SlotStatus.AVAILABLE);
        slot.setPricePerHour(request.getPricePerHour());
        slot.setFloor(request.getFloor());
        return slotRepository.save(slot);
    }

    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAll();
    }

    public List<ParkingSlot> getAvailableSlots() {
        return slotRepository.findByStatus(ParkingSlot.SlotStatus.AVAILABLE);
    }

    public ParkingSlot updateSlotStatus(Long id, String status) {
        ParkingSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setStatus(ParkingSlot.SlotStatus.valueOf(status));
        return slotRepository.save(slot);
    }

    public void deleteSlot(Long id) {
        slotRepository.deleteById(id);
    }
}