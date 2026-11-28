import { useEffect, useRef, useState } from 'react';
import './ActivityCalendar.css';
import { getSolutionActivity, type SolutionActivity } from '../../api/solutionAPI';

const DAY = 86400000;
const colors = ['#eff2f5', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const levels = ['0개', '1개', '2~3개', '4~5개', '6개 이상'];
function color(count: number) {
  return colors[count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4];
}

export default function ActivityCalendar() {
  const [activity, setActivity] = useState<SolutionActivity | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<{ date: string; count: number } | null>(null);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    getSolutionActivity().then((data) => {
      if (!ignore) setActivity(data);
    }).catch(() => {
      if (!ignore) setError(true);
    });
    return () => { ignore = true; };
  }, [attempt]);

  useEffect(() => {
    if (activity && scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [activity]);

  // 날짜 문자열은 UTC로 계산해 브라우저 시간대와 서머타임의 영향을 피합니다.
  const start = activity ? Date.parse(activity.startDate) : 0;
  const end = activity ? Date.parse(activity.endDate) : 0;
  const gridStart = start - new Date(start).getUTCDay() * DAY;
  const weekCount = activity ? Math.ceil(((end - gridStart) / DAY + 1) / 7) : 0;
  const counts = new Map(activity?.days.map((day) => [day.date, day.count]) ?? []);
  const total = activity?.days.reduce((sum, day) => sum + day.count, 0) ?? 0;
  const activeDays = activity?.days.filter((day) => day.count > 0).length ?? 0;
  const weeks = Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const time = gridStart + (week * 7 + day) * DAY;
      const date = new Date(time).toISOString().slice(0, 10);
      return { date, time, count: counts.get(date) ?? 0 };
    }),
  );

  return (
    <section aria-labelledby="activity-title" className="activity-calendar">
      <header className="activity-header">
        <div>
          <h2 id="activity-title">
            풀이 활동
          </h2>
        </div>
        {activity && <p>최근 1년 <strong>{total.toLocaleString()}개</strong>의 풀이 · <strong>{activeDays}일</strong> 활동</p>}
      </header>

      {error ? (
        <div role="alert" className="py-8 text-center text-sm text-red-700">
          풀이 활동을 불러오지 못했습니다.
          <button type="button" className="ml-3 underline" onClick={() => { setError(false); setAttempt(attempt + 1); }}>다시 시도</button>
        </div>
      ) : !activity ? (
        <p role="status" className="py-10 text-center text-sm text-zinc-500">풀이 활동을 불러오는 중입니다...</p>
      ) : (
        <>
          <div ref={scroll} className="activity-scroll" tabIndex={0} role="region" aria-label="최근 1년 풀이 달력, 가로 스크롤 가능">
            <div className="activity-canvas">
              <div className="activity-months" style={{ gridTemplateColumns: `repeat(${weekCount}, 12px)` }}>
                {weeks.map((week, index) => {
                  const first = week.find((day) => day.time >= start && day.time <= end && day.date.endsWith('-01'));
                  return <span key={week[0].date} className="whitespace-nowrap">{first ? `${Number(first.date.slice(5, 7))}월` : index === 0 && new Date(start).getUTCDate() <= 7 ? `${new Date(start).getUTCMonth() + 1}월` : ''}</span>;
                })}
              </div>
              <div className="activity-body">
                <div className="activity-weekdays">
                  {['', '월', '', '수', '', '금', ''].map((label, i) => <span key={i} className="flex items-center">{label}</span>)}
                </div>
                <div className="activity-weeks" style={{ gridTemplateColumns: `repeat(${weekCount}, 12px)` }}>
                  {weeks.map((week) => (
                    <div key={week[0].date} className="activity-week">
                      {week.map((day) => day.time < start || day.time > end ? (
                        <span key={day.date} className="activity-spacer" />
                      ) : (
                        <button key={day.date} type="button" title={`${day.date} · 풀이 ${day.count}개`}
                          aria-label={`${day.date}, 풀이 ${day.count}개`} aria-pressed={selected?.date === day.date}
                          onClick={() => setSelected(day)} onFocus={() => setSelected(day)} onMouseEnter={() => setSelected(day)}
                          style={{ backgroundColor: color(day.count) }} className="activity-day" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="activity-footer">
            <p aria-live="polite">{selected ? `${selected.date} · 풀이 ${selected.count}개` : total === 0 ? '첫 풀이를 기록하고 잔디를 채워보세요.' : '날짜를 선택하면 풀이 수를 확인할 수 있어요.'}</p>
            <div className="activity-legend" aria-label="풀이 수 색상 범례">
              <span className="mr-1">적음</span>
              {colors.map((value, i) => <span key={value} title={levels[i]} aria-label={levels[i]} style={{ backgroundColor: value }} className="activity-swatch" />)}
              <span className="ml-1">많음</span>
            </div>
          </div>
          <p className="activity-period">{activity.startDate} ~ {activity.endDate} · 풀이 날짜 기준</p>
        </>
      )}
    </section>
  );
}
