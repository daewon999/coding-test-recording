import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;