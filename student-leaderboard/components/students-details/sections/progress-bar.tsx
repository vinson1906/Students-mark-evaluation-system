
"use client";

import {
    Pie,
    PieChart,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6384"
];

const CustomTooltip = ({ active, payload }: any) => {

    if (!active || !payload?.length) return null;

    const item = payload[0].payload;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">

            <p className="text-sm font-semibold text-gray-900">
                {item.name}
            </p>

            <p className="text-sm text-gray-600">
                Marks: {item.value} / {item.fullMark}
            </p>

            <p className="text-xs text-gray-400 mt-1">
                Student performance breakdown
            </p>

        </div>
    );
};

export default function ProgressPieChart({
    chartData,
    isAnimationActive = true
}: {
    chartData: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
    isAnimationActive?: boolean;
}) {

    // Convert API data into Recharts format
    const data = chartData
        .map((item) => ({
            name: item.subject,
            value: Number(item.A) || 0,
            fullMark: Number(item.fullMark) || 0
        }))
        .filter(item => item.value > 0);

    const totalMarks = data.reduce(
        (sum, item) => sum + item.value,
        0
    );

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-4">

            <h2 className="text-lg font-bold text-gray-800 mb-3">
                Marks Distribution
            </h2>

            {totalMarks > 0 ? (

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 h-75 min-w-0">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="85%"
                                    labelLine={false}
                                    label={({ percent }) =>
                                        `${((percent || 0) * 100).toFixed(0)}%`
                                    }
                                    isAnimationActive={isAnimationActive}
                                >

                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="none"
                                        />
                                    ))}

                                </Pie>

                                <Tooltip content={<CustomTooltip />} />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="w-full md:w-1/2">

                        {chartData.map((entry, index) => (

                            <div
                                key={`legend-${index}`}
                                className="flex items-center justify-between gap-2 mb-3"
                            >

                                <div className="flex items-center gap-2 min-w-0">

                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: COLORS[index % COLORS.length]
                                        }}
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        {entry.subject}
                                    </span>

                                </div>

                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                    {entry.A} / {entry.fullMark}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            ) : (

                <div className="h-[300px] flex items-center justify-center text-gray-400">
                    No marks available to display
                </div>

            )}

        </div>
    );
}
