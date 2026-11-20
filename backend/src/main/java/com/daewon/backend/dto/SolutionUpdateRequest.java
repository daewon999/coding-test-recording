package com.daewon.backend.dto;

import java.time.LocalDate;

public class SolutionUpdateRequest {

    private String language;
    private String code;
    private String memo;
    private Integer attemptCount;
    private Boolean correct;
    private LocalDate solvedDate;

    public String getLanguage() {
        return language;
    }

    public String getCode() {
        return code;
    }

    public String getMemo() {
        return memo;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public LocalDate getSolvedDate() {
        return solvedDate;
    }
}