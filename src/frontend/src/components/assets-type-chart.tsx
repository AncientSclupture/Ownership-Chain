import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';

export interface ChartDataInterface {
  name: string;
  nums: number;
}

export function AssetsbyTypeChart({ data }: { data: ChartDataInterface[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="nums" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartTransactionsAssets({ data }: { data: ChartDataInterface[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="nums" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export interface DividentChartDataInterface {
  name: string;
  grup: ChartDataInterface[];
}

const colors = [
  "#8884d8", // ungu
  "#82ca9d", // hijau muda
  "#ffc658", // kuning
  "#ff7f50", // coral
  "#8dd1e1", // biru muda
  "#a4de6c", // hijau lemon
  "#d0ed57", // kuning pucat
  "#ff9f40", // oranye
  "#c23531", // merah
  "#6a5acd", // slate blue
];

const generateColor = (index: number) => `hsl(${(index * 137.5) % 360}, 70%, 60%)`;

export function ChartDevidentsAssets({ data }: { data: DividentChartDataInterface[] }) {
  // Transform data
  const transformedData = data.map(entry => {
    const base: any = { name: entry.name };
    entry.grup.forEach(item => {
      if (!base[item.name]) base[item.name] = 0;
      base[item.name] += item.nums;
    });
    return base;
  });

  // Ambil nama-nama grup untuk Bar
  const allNames = Array.from(
    new Set(data.flatMap(d => d.grup.map(g => g.name)))
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine stroke="#000" />

        {allNames.map((name, idx) => (
          <Bar
            key={name}
            dataKey={name}
            fill={generateColor(idx)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}