package haukientruc.hr.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {
            log.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());

            // DEBUG: Log all headers
            java.util.Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                log.info("Header: {} = {}", headerName, request.getHeader(headerName));
            }

            String token = getTokenFromRequest(request);

            if (token != null) {
                log.info("Token found in header");
                if (jwtTokenProvider.validateToken(token)) {
                    String username = jwtTokenProvider.getUsername(token);
                    String role = jwtTokenProvider.getRole(token);
                    log.info("Token valid. Username: {}, Role: {}", username, role);

                    if (username != null && role != null) {
                        // Konvert role -> GrantedAuthority
                        // Lưu ý: Spring Security thường cần prefix "ROLE_" nhưng code cũ có vẻ dùng raw
                        // string.
                        // Để an toàn ta cứ thêm logic, nhưng ở đây set cứng theo roleCode từ DB
                        var authorities = java.util.Collections.singletonList(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_" + role.toUpperCase()));

                        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                username, null, authorities);

                        authentication
                                .setDetails(
                                        new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                                                .buildDetails(request));

                        org.springframework.security.core.context.SecurityContextHolder.getContext()
                                .setAuthentication(authentication);
                        log.info("Authentication set in SecurityContext");
                    } else {
                        log.warn("Username or Role is null");
                    }
                } else {
                    log.warn("Token validation failed for token: {}",
                            (token.length() > 10 ? token.substring(0, 10) + "..." : token));
                }
            } else {
                log.debug("No Authorization header found or malformed");
            }
        } catch (Exception e) {
            log.error("Could not set user authentication in security context", e);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (org.springframework.util.StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}
