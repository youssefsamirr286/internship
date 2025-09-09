package jtag.internship_project.service;

import jtag.internship_project.entities.User;
import jtag.internship_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public User registerUser(User user) {
		if (userRepository.emailExists(user.getEmail())) {
			throw new IllegalArgumentException("Email already in use");
		}

		// ✅ معالجة الباسورد لو ال Entity مش بتعملها
		if (user.getPassword() != null) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		}

		// ✅ معالجة income علشان ميعملش ORA-01400
		if (user.getIncome() == null) {
			user.setIncome(0.0);
		}

		return userRepository.save(user);
	}

	public Optional<User> getUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
	}

	public boolean matchesPassword(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}
}
