package com.example.apgov.security;

import com.example.apgov.entity.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final Users user;

    public CustomUserDetails(Users user) {
        this.user = user;
    }

    public Users getUser() {
        return this.user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map the user role to ROLE_role (e.g., ROLE_citizen, ROLE_mla, etc.)
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().toLowerCase()));
    }

    @Override
    public String getPassword() {
        // Passwordless auth, so returning null/empty
        return "";
    }

    @Override
    public String getUsername() {
        // We use the database UUID primary key as the username for standard context retrieval
        return user.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
