package com.example.hellowebswing;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class HighScoreService {

    private static final int MAX_SCORES = 10;

    private final List<HighScoreEntry> scores = new ArrayList<>();

    public synchronized List<HighScoreEntry> getTopScores() {
        return List.copyOf(scores);
    }

    public synchronized List<HighScoreEntry> addScore(HighScoreRequest request) {
        String initials = normalizeInitials(request.initials());
        int score = request.score();

        if (score <= 0) {
            throw new IllegalArgumentException("Score must be greater than zero.");
        }

        scores.add(new HighScoreEntry(initials, score, Instant.now()));
        scores.sort(Comparator
                .comparingInt(HighScoreEntry::score)
                .reversed()
                .thenComparing(HighScoreEntry::achievedAt));

        if (scores.size() > MAX_SCORES) {
            scores.subList(MAX_SCORES, scores.size()).clear();
        }

        return List.copyOf(scores);
    }

    private String normalizeInitials(String rawInitials) {
        if (rawInitials == null) {
            throw new IllegalArgumentException("Initials are required.");
        }

        String cleaned = rawInitials.replaceAll("[^A-Za-z]", "").toUpperCase();
        if (cleaned.length() < 2 || cleaned.length() > 3) {
            throw new IllegalArgumentException("Initials must be 2 or 3 letters.");
        }

        return cleaned;
    }
}
