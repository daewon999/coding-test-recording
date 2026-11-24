package com.daewon.backend.service;

import com.daewon.backend.dto.*;
import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import com.daewon.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class RecordSolutionServiceTest {
    @Autowired RecordSolutionService service;
    @Autowired ProblemRepository problems;
    @MockitoSpyBean SolutionRepository solutions;

    @BeforeEach void clear() {
        reset(solutions);
        solutions.deleteAll();
        problems.deleteAll();
    }

    RecordSolutionRequest request(String title, String url, Long selected, boolean createNew) {
        var p = new ProblemCreateRequest();
        ReflectionTestUtils.setField(p, "platform", "OTHER");
        ReflectionTestUtils.setField(p, "title", title);
        ReflectionTestUtils.setField(p, "url", url);
        var s = new SolutionUpdateRequest();
        ReflectionTestUtils.setField(s, "language", "Python");
        ReflectionTestUtils.setField(s, "code", "print(1)");
        ReflectionTestUtils.setField(s, "memo", "new attempt");
        ReflectionTestUtils.setField(s, "correct", false);
        ReflectionTestUtils.setField(s, "solvedDate", LocalDate.of(2026, 11, 24));
        return new RecordSolutionRequest(p, s, selected, createNew);
    }

    @Test void urlReusesProblemAndPreservesOldSolution() {
        var first = service.record(request("Original", "https://example.com/task?id=1&utm_source=test", null, false));
        var second = service.record(request("Changed title", " https://EXAMPLE.com:443/task?id=1 ", null, false));
        assertThat(second.reusedProblem()).isTrue();
        assertThat(second.solution().getProblemId()).isEqualTo(first.solution().getProblemId());
        assertThat(second.solution().getId()).isNotEqualTo(first.solution().getId());
        assertThat(second.solution().getProblemTitle()).isEqualTo("Original");
        assertThat(problems.count()).isEqualTo(1);
        assertThat(solutions.count()).isEqualTo(2);
        assertThat(solutions.findById(first.solution().getId()).orElseThrow().getCode()).isEqualTo("print(1)");
    }

    @Test void sameTitleRequiresChoiceAndCanReuseOrCreateSeparateProblem() {
        var first = service.record(request("Same title", "", null, false));
        var pending = service.record(request("Same title", "", null, false));
        assertThat(pending.solution()).isNull();
        assertThat(pending.candidates()).hasSize(1);
        assertThat(solutions.count()).isEqualTo(1);
        service.record(request("Same title", "", first.solution().getProblemId(), false));
        service.record(request("Same title", "", null, true));
        assertThat(problems.count()).isEqualTo(2);
        assertThat(solutions.count()).isEqualTo(3);
    }

    @Test void problemNumberDoesNotIdentifyProblem() {
        var a = request("First", "", null, false);
        var b = request("Second", "", null, false);
        ReflectionTestUtils.setField(a.problem(), "problemNumber", "1000");
        ReflectionTestUtils.setField(b.problem(), "problemNumber", "1000");
        service.record(a);
        service.record(b);
        assertThat(problems.count()).isEqualTo(2);
    }

    @Test void queryIdentifiersAndHashRoutesStayDistinct() {
        service.record(request("First", "https://example.com/task?id=1", null, false));
        service.record(request("Second", "https://example.com/task?id=2", null, false));
        service.record(request("Third", "https://example.com/#/task/1", null, false));
        service.record(request("Fourth", "https://example.com/#/task/2", null, false));
        assertThat(problems.count()).isEqualTo(4);
    }

    @Test void existingDuplicateUrlsRequireSelection() {
        problems.save(new Problem("OTHER", "", "First", "https://example.com/task", ""));
        var selected = problems.save(new Problem("OTHER", "", "Second", "https://example.com/task", ""));
        assertThat(service.record(request("New", "https://example.com/task", null, true)).candidates()).hasSize(2);
        var result = service.record(request("New", "https://example.com/task", selected.getId(), false));
        assertThat(result.solution().getProblemId()).isEqualTo(selected.getId());
        assertThat(problems.count()).isEqualTo(2);
    }

    @Test void invalidInputAndUnrelatedChoiceDoNotSave() {
        assertThatThrownBy(() -> service.record(request(" ", "", null, false))).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.record(request("Title", "javascript:alert(1)", null, false))).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.record(request("Title", "", 999L, false))).isInstanceOf(ResponseStatusException.class);
        assertThat(problems.count()).isZero();
        assertThat(solutions.count()).isZero();
    }

    @Test void failedSolutionSaveRollsBackNewProblem() {
        doThrow(new IllegalStateException("simulated failure")).when(solutions).saveAndFlush(any(Solution.class));
        assertThatThrownBy(() -> service.record(request("Rollback", "", null, false)))
                .isInstanceOf(IllegalStateException.class);
        assertThat(problems.count()).isZero();
        assertThat(solutions.count()).isZero();
    }
}
