import MainHeader from '../components/main/MainHeader';
import HeroSection from '../components/main/HeroSection';
import StatsSection from '../components/main/StatsSection';
import RecentSolutionsSection from '../components/main/RecentSolutionsSection';

function MainPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainHeader />
      <main className="mx-auto max-w-7xl px-6">
        <HeroSection />
        <StatsSection />
        <RecentSolutionsSection />
      </main>
    </div>
  );
}

export default MainPage;