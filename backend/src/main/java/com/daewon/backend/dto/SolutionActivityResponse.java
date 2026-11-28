package com.daewon.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record SolutionActivityResponse(LocalDate startDate, LocalDate endDate,
        List<SolutionActivityDay> days) {}
