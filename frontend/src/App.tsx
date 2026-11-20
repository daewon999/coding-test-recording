import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import SolutionEditPage from './pages/SolutionEditPage';
import MainPage from './pages/MainPage';
import SolutionListPage from './pages/SolutionListPage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import SolutionCreatePage from './pages/SolutionCreatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={<MainPage />}
        />

        {/* 풀이 전체 목록 페이지 */}
        <Route
          path="/solutions"
          element={<SolutionListPage />}
        />

        {/* 특정 풀이 상세 페이지 */}
        <Route
          path="/solutions/:solutionId"
          element={<SolutionDetailPage />}
        />
        {/* 문제풀이 저장페이지 */}
        <Route
          path="/solutions/new"
          element={<SolutionCreatePage />}
        />
      <Route path="/solutions/:solutionId/edit" element={<SolutionEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
