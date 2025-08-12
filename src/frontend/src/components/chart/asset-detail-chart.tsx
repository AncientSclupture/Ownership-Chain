import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';


interface BarConfig {
    key: string;
    color: string;
    name?: string;
}

interface CustomizableBarChartProps {
    data?: any[];
    xAxisKey?: string | null;
    bars?: BarConfig[];
    width?: string | number;
    height?: number;
    margin?: { top: number; right: number; left: number; bottom: number };
    barSize?: number;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    gridStroke?: string;
}

export function CustomizableBarChart({
    data = [],
    xAxisKey = null,
    bars = [],
    width = "100%",
    height = 300,
    margin = { top: 5, right: 30, left: 20, bottom: 5 },
    barSize = 20,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    gridStroke = "3 3"
}: CustomizableBarChartProps) {
    const getXAxisKey = () => {
        if (xAxisKey) return xAxisKey;
        if (!data || data.length === 0) return 'name';

        const firstItem = data[0];
        const stringKeys = Object.keys(firstItem).filter(key =>
            typeof firstItem[key] === 'string'
        );

        const priorityKeys = ['name', 'date', 'category', 'label', 'id'];
        for (const key of priorityKeys) {
            if (stringKeys.includes(key)) return key;
        }

        return stringKeys[0] || 'name';
    };

    const getBars = () => {
        if (bars && bars.length > 0) return bars;
        if (!data || data.length === 0) return [];

        const firstItem = data[0];
        const numericKeys = Object.keys(firstItem).filter(key =>
            typeof firstItem[key] === 'number'
        );

        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

        return numericKeys.map((key, index) => ({
            key,
            color: colors[index % colors.length],
            name: key.charAt(0).toUpperCase() + key.slice(1)
        }));
    };

    const xKey = getXAxisKey();
    const barConfigs = getBars();

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChart
                data={data}
                margin={margin}
                barSize={barSize}
            >
                <XAxis
                    dataKey={xKey}
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                {showTooltip && <Tooltip />}
                {showLegend && barConfigs.length > 1 && <Legend />}
                {showGrid && <CartesianGrid strokeDasharray={gridStroke} />}

                {barConfigs.map((barConfig, index) => (
                    <Bar
                        key={barConfig.key}
                        dataKey={barConfig.key}
                        fill={barConfig.color}
                        name={barConfig.name}
                        background={index === 0 ? { fill: '#eee' } : undefined}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}