package com.myteam.club.config;

import com.myteam.club.model.*;
import com.myteam.club.repository.FinanceRepository;
import com.myteam.club.repository.PlayerRepository;
import com.myteam.club.repository.TrainingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PlayerRepository playerRepository;
    private final TrainingRepository trainingRepository;
    private final FinanceRepository financeRepository;

    public DataInitializer(PlayerRepository playerRepository,
                           TrainingRepository trainingRepository,
                           FinanceRepository financeRepository) {
        this.playerRepository = playerRepository;
        this.trainingRepository = trainingRepository;
        this.financeRepository = financeRepository;
    }

    @Override
    public void run(String... args) {
        if (playerRepository.count() == 0) {
            initPlayers();
            initTrainings();
            initFinances();
        }
    }

    private void initPlayers() {
        createPlayer("Zhang Wei", 1, "GK", 28, "China", 50000.0, PlayerStatus.ACTIVE);
        createPlayer("Li Ming", 4, "CB", 26, "China", 45000.0, PlayerStatus.ACTIVE);
        createPlayer("Wang Qiang", 5, "CB", 30, "China", 48000.0, PlayerStatus.ACTIVE);
        createPlayer("Liu Yang", 2, "RB", 24, "China", 40000.0, PlayerStatus.ACTIVE);
        createPlayer("Chen Bo", 3, "LB", 25, "China", 42000.0, PlayerStatus.INJURED);
        createPlayer("Zhao Jun", 6, "CDM", 27, "China", 55000.0, PlayerStatus.ACTIVE);
        createPlayer("Sun Lei", 8, "CM", 23, "China", 52000.0, PlayerStatus.ACTIVE);
        createPlayer("Wu Hao", 10, "CAM", 22, "China", 60000.0, PlayerStatus.ACTIVE);
        createPlayer("Zhou Peng", 7, "RW", 21, "China", 58000.0, PlayerStatus.ACTIVE);
        createPlayer("Huang Tao", 11, "LW", 29, "China", 53000.0, PlayerStatus.SUSPENDED);
        createPlayer("Ma Lin", 9, "ST", 26, "China", 65000.0, PlayerStatus.ACTIVE);
    }

    private void createPlayer(String name, int number, String position, int age, String nationality, double salary, PlayerStatus status) {
        Player player = new Player();
        player.setName(name);
        player.setJerseyNumber(number);
        player.setPosition(position);
        player.setAge(age);
        player.setNationality(nationality);
        player.setSalary(salary);
        player.setStatus(status);
        player.setJoinDate(LocalDate.now().minusYears(age > 25 ? 3 : 1));
        playerRepository.save(player);
    }

    private void initTrainings() {
        createTraining("Morning Fitness", LocalDate.now().plusDays(1), LocalTime.of(8, 0), LocalTime.of(10, 0), "Main Stadium", TrainingType.PHYSICAL, "Full squad physical training");
        createTraining("Tactical Review", LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(11, 30), "Training Ground A", TrainingType.TACTICAL, "Reviewing formation and strategy");
        createTraining("Match Preparation", LocalDate.now().plusDays(3), LocalTime.of(10, 0), LocalTime.of(12, 0), "Main Stadium", TrainingType.MATCH_PREP, "Prepare for upcoming league match");
        createTraining("Recovery Session", LocalDate.now().plusDays(4), LocalTime.of(14, 0), LocalTime.of(15, 30), "Recovery Center", TrainingType.RECOVERY, "Light recovery exercises");
        createTraining("Team Drill", LocalDate.now().plusDays(5), LocalTime.of(9, 0), LocalTime.of(11, 0), "Training Ground B", TrainingType.TEAM, "Team coordination drills");
    }

    private void createTraining(String title, LocalDate date, LocalTime start, LocalTime end, String location, TrainingType type, String description) {
        TrainingSession session = new TrainingSession();
        session.setTitle(title);
        session.setDate(date);
        session.setStartTime(start);
        session.setEndTime(end);
        session.setLocation(location);
        session.setType(type);
        session.setDescription(description);
        trainingRepository.save(session);
    }

    private void initFinances() {
        createFinance(FinanceType.INCOME, "Sponsorship", 500000.0, LocalDate.now().minusDays(30), "Main sponsor annual payment", null);
        createFinance(FinanceType.INCOME, "Ticket Sales", 120000.0, LocalDate.now().minusDays(20), "Home match ticket revenue", null);
        createFinance(FinanceType.INCOME, "Merchandise", 45000.0, LocalDate.now().minusDays(15), "Jersey and merchandise sales", null);
        createFinance(FinanceType.INCOME, "Transfer", 200000.0, LocalDate.now().minusDays(10), "Player transfer fee received", "Huang Tao");
        createFinance(FinanceType.EXPENSE, "Salary", 638000.0, LocalDate.now().minusDays(5), "Monthly player salaries", null);
        createFinance(FinanceType.EXPENSE, "Facility", 50000.0, LocalDate.now().minusDays(7), "Training ground maintenance", null);
        createFinance(FinanceType.EXPENSE, "Equipment", 25000.0, LocalDate.now().minusDays(3), "Training equipment purchase", null);
        createFinance(FinanceType.EXPENSE, "Travel", 35000.0, LocalDate.now().minusDays(1), "Away match travel expenses", null);
    }

    private void createFinance(FinanceType type, String category, double amount, LocalDate date, String description, String relatedPlayer) {
        Finance finance = new Finance();
        finance.setType(type);
        finance.setCategory(category);
        finance.setAmount(amount);
        finance.setDate(date);
        finance.setDescription(description);
        finance.setRelatedPlayerName(relatedPlayer);
        financeRepository.save(finance);
    }
}
