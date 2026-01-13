'use client';

import { metricCards } from "@/app/constants/mockData";
import { MetricCard } from "./metric-card";



export const MetricCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {metricCards.map((card, index) => (
        <MetricCard key={index} data={card} />
      ))}
    </div>
  );
};