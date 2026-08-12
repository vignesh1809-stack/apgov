package com.example.apgov.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * High-performance sliding window rate limiter for authentication endpoints.
 * Protects against OTP flooding and brute-force credential stuffing attacks.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long resetTimeMs;

        public RequestCounter(long windowMs) {
            this.resetTimeMs = System.currentTimeMillis() + windowMs;
        }

        public boolean tryConsume(int maxAllowed, long windowMs) {
            long now = System.currentTimeMillis();
            if (now > resetTimeMs) {
                synchronized (this) {
                    if (now > resetTimeMs) {
                        count.set(0);
                        resetTimeMs = now + windowMs;
                    }
                }
            }
            return count.incrementAndGet() <= maxAllowed;
        }
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Apply rate limit specifically to /api/auth endpoints
        if (path.startsWith("/api/auth/")) {
            String clientIp = getClientIp(request);
            String key = "ip:" + clientIp;

            RequestCounter counter = requestCounts.computeIfAbsent(
                    key,
                    k -> new RequestCounter(60_000L) // 1 minute sliding window
            );

            if (!counter.tryConsume(MAX_REQUESTS_PER_MINUTE, 60_000L)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests. Rate limit exceeded. Please try again in 1 minute.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
