package com.example.bankapp.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RoleInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Example: block access to /api/admin/** if user not ADMIN (Spring Security handles this normally).
        if (request.getRequestURI().startsWith("/api/admin") &&
                (request.getUserPrincipal() == null || !request.isUserInRole("ADMIN"))) {
            response.setStatus(403);
            response.getWriter().write("Forbidden by RoleInterceptor");
            return false;
        }
        return true;
    }
}
