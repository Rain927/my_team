package com.myteam.club.model;

public class FinanceSummary {
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Long transactionCount;

    public FinanceSummary(Double totalIncome, Double totalExpense, Long transactionCount) {
        this.totalIncome = totalIncome != null ? totalIncome : 0.0;
        this.totalExpense = totalExpense != null ? totalExpense : 0.0;
        this.balance = this.totalIncome - this.totalExpense;
        this.transactionCount = transactionCount;
    }

    public Double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(Double totalIncome) { this.totalIncome = totalIncome; }

    public Double getTotalExpense() { return totalExpense; }
    public void setTotalExpense(Double totalExpense) { this.totalExpense = totalExpense; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Long transactionCount) { this.transactionCount = transactionCount; }
}
