package com.example.apgov.security;

import com.example.apgov.entity.Constituencies;
import com.example.apgov.entity.Users;
import com.example.apgov.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if coordinator CO-KUP-001 exists
        if (userRepository.findByEmployeeId("CO-KUP-001").isEmpty()) {
            System.out.println("Seeding coordinator user: CO-KUP-001");
            
            // Find a constituency to assign
            List<Constituencies> constituencies = entityManager.createQuery(
                    "SELECT c FROM Constituencies c", Constituencies.class)
                    .setMaxResults(1)
                    .getResultList();
            
            if (constituencies.isEmpty()) {
                System.out.println("WARNING: Cannot seed coordinator user because no constituency exists in the database. Run dummy_data.sql first.");
                return;
            }

            Constituencies constituency = constituencies.get(0);

            Users coordinator = Users.builder()
                    .id(UUID.randomUUID().toString())
                    .employeeId("CO-KUP-001")
                    .ssoUid("SSO-CO-" + UUID.randomUUID())
                    .firstName("Ravi")
                    .lastName("Kumar")
                    .phone("+919988776655")
                    .role("coordinator")
                    .constituency(constituency)
                    .build();

            userRepository.save(coordinator);
            System.out.println("Coordinator user CO-KUP-001 successfully seeded!");
        } else {
            System.out.println("Coordinator user CO-KUP-001 already exists in database.");
        }
    }
}
