package com.myteam.club.repository;

import com.myteam.club.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findByDateBetweenOrderByDateAscStartTimeAsc(LocalDate start, LocalDate end);
    List<TrainingSession> findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(LocalDate date);
    List<TrainingSession> findAllByOrderByDateDescStartTimeDesc();
}
