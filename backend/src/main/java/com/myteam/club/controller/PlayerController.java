package com.myteam.club.controller;

import com.myteam.club.model.Player;
import com.myteam.club.model.PlayerStatus;
import com.myteam.club.repository.PlayerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public List<Player> getAllPlayers(
            @RequestParam(required = false) String position,
            @RequestParam(required = false) PlayerStatus status) {
        if (position != null) {
            return playerRepository.findByPosition(position);
        }
        if (status != null) {
            return playerRepository.findByStatus(status);
        }
        return playerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Player createPlayer(@Valid @RequestBody Player player) {
        return playerRepository.save(player);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @Valid @RequestBody Player player) {
        return playerRepository.findById(id)
                .map(existing -> {
                    player.setId(id);
                    return ResponseEntity.ok(playerRepository.save(player));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(player -> {
                    playerRepository.delete(player);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count")
    public long getPlayerCount() {
        return playerRepository.count();
    }
}
