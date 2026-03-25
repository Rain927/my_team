package com.myteam.club.repository;

import com.myteam.club.model.Player;
import com.myteam.club.model.PlayerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByPosition(String position);
    List<Player> findByStatus(PlayerStatus status);
    long countByStatus(PlayerStatus status);
}
