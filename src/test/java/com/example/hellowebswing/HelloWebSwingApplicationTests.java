package com.example.hellowebswing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HelloWebSwingApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void rootServesSnakePage() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("index.html"));
    }

    @Test
    void highScoresCanBeSavedAndLoaded() throws Exception {
        mockMvc.perform(post("/api/highscores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"initials":"abc","score":12}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$[0].initials").value("ABC"))
                .andExpect(jsonPath("$[0].score").value(12));

        mockMvc.perform(get("/api/highscores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].initials").value("ABC"))
                .andExpect(jsonPath("$[0].score").value(12));
    }

    @Test
    void invalidHighScoreSubmissionReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/highscores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"initials":"1","score":0}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }
}