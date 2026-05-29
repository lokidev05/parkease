package com.parkease.backend.service;

import com.parkease.backend.dto.PaymentOrderRequest;
import com.parkease.backend.dto.PaymentOrderResponse;
import com.parkease.backend.dto.PaymentVerifyRequest;
import com.parkease.backend.model.Booking;
import com.parkease.backend.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final BookingRepository bookingRepository;

    public PaymentOrderResponse createOrder(PaymentOrderRequest request) throws Exception {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(request.getAmount() * 100));
        options.put("currency", "INR");
        options.put("receipt", "booking_" + request.getBookingId());

        Order order = client.orders.create(options);

        return new PaymentOrderResponse(
            order.get("id"),
            request.getAmount(),
            "INR",
            keyId
        );
    }

    public boolean verifyPayment(PaymentVerifyRequest request) throws Exception {
        String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        boolean isValid = Utils.verifySignature(data, request.getRazorpaySignature(), keySecret);

        if (isValid) {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return isValid;
    }
}