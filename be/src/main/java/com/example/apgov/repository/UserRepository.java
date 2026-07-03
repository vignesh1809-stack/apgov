package com.example.apgov.repository;

import com.example.apgov.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    Optional<Users> findByPhone(String phone);
    Optional<Users> findByEmployeeId(String employeeId);
    Optional<Users> findBySsoUid(String ssoUid);
}
