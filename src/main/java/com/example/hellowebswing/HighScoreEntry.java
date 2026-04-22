package com.example.hellowebswing;

import java.time.Instant;

public record HighScoreEntry(String initials, int score, Instant achievedAt) {
}
