import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import SolutionListPage from './pages/SolutionListPage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소로 접속하면 풀이 목록으로 이동 */}
        <Route
          path="/"
          element={<Navigate to="/solutions" replace />}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;