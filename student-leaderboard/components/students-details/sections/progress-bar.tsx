
"use client";

import {
    Pie,
    PieChart,
    PieLabelRenderProps,
    PieSectorShapeProps,
    Sector,
    Tooltip,
    useActiveTooltipDataPoints,
    useIsTooltipActive,
    TooltipContentProps,
    TooltipIndex,
} from "recharts";



const RADIAN = Math.PI / 180;

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8041",
    "#8884D8",
    "#FF6384",
    "red"
];

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipContentProps) => {
    const firstPayload = payload?.[0];
    const isVisible = active && firstPayload != null;

    return (
        <div
            className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
            style={{
                visibility: isVisible ? "visible" : "hidden",
            }}
        >
            {isVisible && (
                <>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {`${label ?? firstPayload.name} : ${firstPayload.value} / ${firstPayload.payload.fullMark}`}
                    </p>

                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        {String(firstPayload.name ?? "")}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Student performance breakdown
                    </p>
                </>
            )}
        </div>
    );
};

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: PieLabelRenderProps) => {
    if (
        cx == null ||
        cy == null ||
        innerRadius == null ||
        outerRadius == null
    ) {
        return null;
    }

    const radius =
        innerRadius + (outerRadius - innerRadius) * 0.5;

    const centerX = Number(cx);
    const centerY = Number(cy);

    const x =
        centerX + radius * Math.cos(-(midAngle ?? 0) * RADIAN);

    const y =
        centerY + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > centerX ? "start" : "end"}
            dominantBaseline="central"
            className="text-xs font-semibold"
        >
            {`${((percent ?? 0) * 100).toFixed(0)}%`}
        </text>
    );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
    const activePoints = useActiveTooltipDataPoints();
    const isTooltipActive = useIsTooltipActive();

    const isThisPieActive =
        isTooltipActive &&
        props.payload === activePoints?.[0]?.payload;

    const fillOpacity =
        isTooltipActive && !isThisPieActive ? 0.5 : 1;

    return (
        <Sector
            {...props}
            fill={COLORS[(props.index ?? 0) % COLORS.length]}
            stroke="none"
            fillOpacity={fillOpacity}
            style={{ transition: "fill-opacity 0.3s ease" }}
        />
    );
};

export default function ProgressPieChart({
    chartData,
    isAnimationActive = true,
    defaultIndex,
}: {
    chartData: { subject: string; A: number }[];
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
}) {



    const data = chartData.map((item: any) => ({
        name: item.subject,
        value: item.A,
        fullMark: item.fullMark,
    }));




    return (
        <div className="w-full bg-white rounded-lg shadow-md p-4 flex gap-4 items-center" >
            <PieChart
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    maxHeight: "80vh",
                    aspectRatio: 1,
                    cursor: "pointer",
                }}
                responsive
            >
                <Pie
                    data={data}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={isAnimationActive}
                    shape={MyCustomPie}
                />

                <Tooltip
                    content={CustomTooltip}
                    isAnimationActive={isAnimationActive}
                    defaultIndex={defaultIndex}
                />
            </PieChart>
            <div>
                {
                    data.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center mb-2">
                            <div
                                className="w-4 h-4 mr-2 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{entry.name}</span>
                            <span className="ml-2 text-sm text-gray-600">{entry.value}</span>
                            <span className="ml-1 text-sm text-gray-400">/ {entry.fullMark}</span>

                        </div>
                    ))
                }
            </div>
        </div>

    );
}
