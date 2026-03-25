package com.myteam.club.repository;

import com.myteam.club.model.Finance;
import com.myteam.club.model.FinanceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {
    List<Finance> findByType(FinanceType type);
    List<Finance> findAllByOrderByDateDesc();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Finance f WHERE f.type = 'INCOME'")
    Double getTotalIncome();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Finance f WHERE f.type = 'EXPENSE'")
    Double getTotalExpense();
}
