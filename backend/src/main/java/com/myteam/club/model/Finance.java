package com.myteam.club.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "finances")
public class Finance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Type is required")
    @Enumerated(EnumType.STRING)
    private FinanceType type;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @Column(length = 500)
    private String description;

    private String relatedPlayerName;

    public Finance() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinanceType getType() { return type; }
    public void setType(FinanceType type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRelatedPlayerName() { return relatedPlayerName; }
    public void setRelatedPlayerName(String relatedPlayerName) { this.relatedPlayerName = relatedPlayerName; }
}
