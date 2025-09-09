package jtag.internship_project.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Entity
@Table(name = "TXN")
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_seq")
	@SequenceGenerator(name = "transaction_seq", sequenceName = "SEQ_TXN", allocationSize = 1)
	@Column(name = "TXN_ID") // اسم العمود الأساسي كما في قاعدة البيانات
	private Long id;

	@NotNull
	@Positive
	@Column(name = "AMOUNT")
	private Double amount;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "TYPE", length = 10)
	private TransactionTypeEnum type;

	@Column(name = "TXN_DATE")
	private LocalDate txnDate;

	@ManyToOne
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "CATEGORY_ID", nullable = false)
	private Category category;

	public Transaction() {
	}

	public Transaction(Long id, Double amount, TransactionTypeEnum type, LocalDate txnDate, User user,
			Category category) {
		this.id = id;
		this.amount = amount;
		this.type = type;
		this.txnDate = txnDate;
		this.user = user;
		this.category = category;
	}

	// Getters and Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public TransactionTypeEnum getType() {
		return type;
	}

	public void setType(TransactionTypeEnum type) {
		this.type = type;
	}

	public LocalDate getTxnDate() {
		return txnDate;
	}

	public void setTxnDate(LocalDate txnDate) {
		this.txnDate = txnDate;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}
