package jtag.internship_project.entities;

import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "USERS")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
	@SequenceGenerator(name = "user_seq", sequenceName = "SEQ_USERS", allocationSize = 1)
	@Column(name = "USER_ID")
	private Long userId;

	@Column(name = "FULL_NAME")
	private String fullName;

	@Column(name = "EMAIL", unique = true)
	private String email;

	@Column(name = "PASSWORD")
	private String password;

	@Column(name = "INCOME", nullable = false)
	private Double income = 0.0; // default value

	// ✅ Hash password before insert/update
	@PrePersist
	@PreUpdate
	private void hashPassword() {
		if (this.password != null && !this.password.startsWith("$2a$")) {
			this.password = new BCryptPasswordEncoder().encode(this.password);
		}
	}

	// Getters and Setters
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Double getIncome() {
		return income;
	}

	public void setIncome(Double income) {
		this.income = income;
	}
}
