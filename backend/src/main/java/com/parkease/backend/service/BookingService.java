package com.parkease.backend.service;

import com.parkease.backend.dto.BookingRequest;
import com.parkease.backend.dto.BookingResponse;
import com.parkease.backend.model.Booking;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.model.User;
import com.parkease.backend.repository.BookingRepository;
import com.parkease.backend.repository.ParkingSlotRepository;
import com.parkease.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ParkingSlotRepository slotRepository;
    private final UserRepository userRepository;

    public BookingResponse createBooking(BookingRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ParkingSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getStatus() != ParkingSlot.SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot is not available");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSlot(slot);
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(LocalDateTime.now().plusHours(request.getDurationHours()));
        booking.setDurationHours(request.getDurationHours());
        booking.setTotalAmount(slot.getPricePerHour() * request.getDurationHours());
        booking.setPenaltyAmount(0.0);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        slot.setStatus(ParkingSlot.SlotStatus.OCCUPIED);
        slotRepository.save(slot);

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    public List<BookingResponse> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        booking.setStatus(Booking.BookingStatus.COMPLETED);

        if (now.isAfter(booking.getEndTime())) {
            long overtimeMinutes = java.time.Duration.between(booking.getEndTime(), now).toMinutes();
            double penalty = (overtimeMinutes / 60.0) * booking.getSlot().getPricePerHour() * 1.5;
            booking.setPenaltyAmount(Math.round(penalty * 100.0) / 100.0);
        }

        booking.getSlot().setStatus(ParkingSlot.SlotStatus.AVAILABLE);
        slotRepository.save(booking.getSlot());

        return mapToResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getSlot().getSlotNumber(),
                b.getSlot().getType().name(),
                b.getSlot().getFloor(),
                b.getStartTime(),
                b.getEndTime(),
                b.getDurationHours(),
                b.getTotalAmount(),
                b.getPenaltyAmount(),
                b.getStatus().name()
        );
    }
}