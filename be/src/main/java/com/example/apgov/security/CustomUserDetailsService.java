package com.example.apgov.security;

import com.example.apgov.entity.Users;
import com.example.apgov.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        // Loads user by database primary key ID (stored in JWT subject)
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserByPhone(String phone) throws UsernameNotFoundException {
        Users user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + phone));
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserByEmployeeId(String employeeId) throws UsernameNotFoundException {
        Users user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with employee ID: " + employeeId));
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserBySsoUid(String ssoUid) throws UsernameNotFoundException {
        Users user = userRepository.findBySsoUid(ssoUid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with SSO UID: " + ssoUid));
        return new CustomUserDetails(user);
    }
}
