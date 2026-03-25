package com.myteam.club.controller;

import com.myteam.club.model.TrainingSession;
import com.myteam.club.repository.TrainingRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    private final TrainingRepository trainingRepository;

    public TrainingController(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @GetMapping
    public List<TrainingSession> getAllTrainings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from != null && to != null) {
            return trainingRepository.findByDateBetweenOrderByDateAscStartTimeAsc(from, to);
        }
        if (from != null) {
            return trainingRepository.findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(from);
        }
        return trainingRepository.findAllByOrderByDateDescStartTimeDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingSession> getTraining(@PathVariable Long id) {
        return trainingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TrainingSession createTraining(@Valid @RequestBody TrainingSession training) {
        return trainingRepository.save(training);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingSession> updateTraining(@PathVariable Long id, @Valid @RequestBody TrainingSession training) {
        return trainingRepository.findById(id)
                .map(existing -> {
                    training.setId(id);
                    return ResponseEntity.ok(trainingRepository.save(training));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        return trainingRepository.findById(id)
                .map(training -> {
                    trainingRepository.delete(training);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public List<TrainingSession> getUpcomingTrainings() {
        return trainingRepository.findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(LocalDate.now());
    }
}
