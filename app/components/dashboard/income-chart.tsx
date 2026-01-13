"use client";

import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const generateDateData = () => {
  const dates = [];
  const startDate = new Date("2025-12-01");
  const endDate = new Date("2025-12-31");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  return dates;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const generateChartData = () => {
  const dates = generateDateData();
  
  return dates.map((date, index) => {
    const progress = index / (dates.length - 1);
    
    let thisPeriod = 17;
    let lastPeriod = 14;
    
    if (progress < 0.2) {
      thisPeriod = 17 + progress * 25;
      lastPeriod = 14 - progress * 2;
    } else if (progress < 0.4) {
      thisPeriod = 22 - (progress - 0.2) * 5;
      lastPeriod = 13.5 + (progress - 0.2) * 1.5;
    } else if (progress < 0.6) {
      thisPeriod = 21 + (progress - 0.4) * 15;
      lastPeriod = 14 - (progress - 0.4) * 2;
    } else if (progress < 0.8) {
      thisPeriod = 24 - (progress - 0.6) * 4;
      lastPeriod = 13 + (progress - 0.6) * 1;
    } else {
      thisPeriod = 22.4 - (progress - 0.8) * 0.4;
      lastPeriod = 13.2 - (progress - 0.8) * 0.2;
    }
    
    return {
      date: formatDate(date),
      dateObj: date,
      thisPeriod: Math.round(thisPeriod * 100) / 100,
      lastPeriod: Math.round(lastPeriod * 100) / 100,
    };
  });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="flex flex-col w-40 items-start gap-2 px-3 py-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_16px_32px_-12px_#0d0d121a]">
        <div className="flex items-center justify-center font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
          NET INCOME
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center justify-center font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-[#009688] text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
              ${(data.thisPeriod / 1000).toFixed(1)}K
            </div>

            <div className="flex items-center justify-center font-body-small-regular font-[number:var(--body-small-regular-font-weight)] text-greyscale-500 text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] [font-style:var(--body-small-regular-font-style)]">
              {data.date}
            </div>
          </div>

          <div className="flex justify-between w-full items-center">
            <div className="flex items-center justify-center font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-alertswarning-100 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
              ${(data.lastPeriod / 1000).toFixed(1)}K
            </div>

            <div className="flex items-center justify-center font-body-small-regular font-[number:var(--body-small-regular-font-weight)] text-greyscale-500 text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] [font-style:var(--body-small-regular-font-style)]">
              {data.date}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const IncomeChart = () => {
  const data = generateChartData();

  return (
    <div className="flex items-start gap-6 w-full">
      <div className="inline-flex flex-col h-[180px] items-start justify-between">
        {["$25K", "$20K", "$15K", "$10K"].map((label, index) => (
          <div
            key={index}
            className="flex items-center justify-center font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex h-[180px] items-start justify-between flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="colorThisPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#009688" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#009688" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9800" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#FF9800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#dfe1e6"
              vertical={true}
              horizontal={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              domain={[10, 25]}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="thisPeriod"
              stroke="none"
              fill="url(#colorThisPeriod)"
            />
            <Area
              type="monotone"
              dataKey="lastPeriod"
              stroke="none"
              fill="url(#colorLastPeriod)"
            />
            <Line
              type="monotone"
              dataKey="thisPeriod"
              stroke="#009688"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#009688", stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="lastPeriod"
              stroke="#FF9800"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#FF9800", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
