package com.parkease.backend.repository;

import com.parkease.backend.model.Booking;
import com.parkease.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findBySlotId(Long slotId);
}