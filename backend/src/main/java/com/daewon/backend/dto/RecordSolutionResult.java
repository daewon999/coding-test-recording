package com.daewon.backend.dto;

import com.daewon.backend.entity.Problem;
import java.util.List;

public record RecordSolutionResult(
        SolutionResponse solution,
        boolean reusedProblem,
        List<Problem> candidates,
        boolean canCreateNew
) {}
