package com.myteam.club.controller;

import com.myteam.club.model.Finance;
import com.myteam.club.model.FinanceSummary;
import com.myteam.club.model.FinanceType;
import com.myteam.club.repository.FinanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/finances")
public class FinanceController {

    private final FinanceRepository financeRepository;

    public FinanceController(FinanceRepository financeRepository) {
        this.financeRepository = financeRepository;
    }

    @GetMapping
    public List<Finance> getAllFinances(@RequestParam(required = false) FinanceType type) {
        if (type != null) {
            return financeRepository.findByType(type);
        }
        return financeRepository.findAllByOrderByDateDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Finance> getFinance(@PathVariable Long id) {
        return financeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Finance createFinance(@Valid @RequestBody Finance finance) {
        return financeRepository.save(finance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Finance> updateFinance(@PathVariable Long id, @Valid @RequestBody Finance finance) {
        return financeRepository.findById(id)
                .map(existing -> {
                    finance.setId(id);
                    return ResponseEntity.ok(financeRepository.save(finance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinance(@PathVariable Long id) {
        return financeRepository.findById(id)
                .map(finance -> {
                    financeRepository.delete(finance);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/summary")
    public FinanceSummary getFinanceSummary() {
        Double totalIncome = financeRepository.getTotalIncome();
        Double totalExpense = financeRepository.getTotalExpense();
        long count = financeRepository.count();
        return new FinanceSummary(totalIncome, totalExpense, count);
    }
}
