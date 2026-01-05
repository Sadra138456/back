import React, { useMemo } from 'react';
import { Repository } from '../types';
import { useLanguage } from '../language';

interface ContributionGraphProps {
  repositories: Repository[];
}

const LEVEL_COLORS = [
  '#161b22', // Level 0 (Empty)
  '#0e4429', // Level 1 (1 contribution)
  '#006d32', // Level 2 (2 contributions)
  '#26a641', // Level 3 (3 contributions)
  '#39d353', // Level 4 (4+ contributions)
];

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ repositories }) => {
  const { t, lang } = useLanguage();

  // 1. Calculate contribution data based on repositories
  const { grid, totalContributions } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Map: "YYYY-MM-DD" -> count
    const contributions: Record<string, number> = {};
    let total = 0;

    repositories.forEach(repo => {
      // We rely on repo.id being a timestamp (from server.js: Date.now().toString())
      // If repo.id is missing or not a timestamp (static data), we skip it for the graph
      if (repo.id && !isNaN(Number(repo.id))) {
        const date = new Date(parseInt(repo.id));
        const dateString = date.toISOString().split('T')[0];
        
        // Only count if within the last year
        if (date >= oneYearAgo && date <= today) {
          contributions[dateString] = (contributions[dateString] || 0) + 1;
          total++;
        }
      }
    });

    // Generate the 52x7 Grid
    const gridData = [];
    // Start date needs to be aligned to the closest past Sunday relative to 1 year ago
    const startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay(); // 0 (Sun) - 6 (Sat)
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let w = 0; w < 53; w++) {
      const weekCols = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7) + d);
        
        // Don't render days in the future
        if (currentDate > today) {
           // Optional: render empty placeholders or break
        }

        const dateString = currentDate.toISOString().split('T')[0];
        const count = contributions[dateString] || 0;
        
        let level = 0;
        if (count >= 4) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        weekCols.push({
          date: dateString,
          count: count,
          level: level,
          color: LEVEL_COLORS[level]
        });
      }
      gridData.push(weekCols);
    }

    return { grid: gridData, totalContributions: total };
  }, [repositories]);

  return (
    <div className="border border-gh-border rounded-md p-4 bg-gh-bg w-full overflow-hidden">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-sm font-normal text-gh-text">
            {totalContributions} {t('contributionsLastYear')}
         </h4>
         <div className="text-xs text-gh-secondary hidden sm:block">
            {t('contributionSettings')} ▾
         </div>
      </div>
      
      <div className="overflow-x-auto pb-2" dir="ltr">
        <div className="flex gap-[3px] min-w-max">
            {grid.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dIndex) => (
                        <div 
                            key={`${wIndex}-${dIndex}`}
                            className="w-[10px] h-[10px] rounded-[2px] transition-colors duration-200"
                            style={{ backgroundColor: day.color }}
                            title={`${day.count} contributions on ${day.date}`}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs text-gh-secondary mt-2">
        <span>{t('less')}</span>
        {LEVEL_COLORS.map((c, i) => (
           <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: c}}></div>
        ))}
        <span>{t('more')}</span>
      </div>
    </div>
  );
};
