import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import MainPage from './pages/MainPage';
import SolutionListPage from './pages/SolutionListPage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import SolutionCreatePage from './pages/SolutionCreatePage';
import SolutionEditPage from './pages/SolutionEditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공통 레이아웃 */}

        <Route element={<AppLayout />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          {/* 풀이 전체 목록 페이지 */}
          <Route path="/solutions" element={<SolutionListPage />} />
          {/* 문제풀이 저장페이지 */}
          <Route path="/solutions/new" element={<SolutionCreatePage />} />
          {/* 특정 풀이 상세페이지 */}
          <Route
            path="/solutions/:solutionId"
            element={<SolutionDetailPage />}
          />
          {/* 문제풀이 수정페이지 */}
          <Route
            path="/solutions/:solutionId/edit"
            element={<SolutionEditPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;