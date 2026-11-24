package com.daewon.backend.dto;

public record RecordSolutionRequest(
        ProblemCreateRequest problem,
        SolutionUpdateRequest solution,
        Long selectedProblemId,
        boolean createNew
) {}
