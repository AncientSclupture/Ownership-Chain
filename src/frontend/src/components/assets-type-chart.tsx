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

interface DevidenthistoryInterface extends ChartDataInterface {
  diff?: number;
}

function ProcessData(data: ChartDataInterface[]): DevidenthistoryInterface[] {
  return data.map((item, index) => {
    if (index === 0) {
      return { ...item, diff: 0 };
    }

    const prev = data[index - 1];
    const diff = item.nums - prev.nums;

    return { ...item, diff };
  });
}

export function ChartDevidentsAssets({ data }: { data: ChartDataInterface[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={ProcessData(data)}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}

      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine stroke="#000" />
        <Bar dataKey="diff" fill="#82ca9d" />
        <Bar dataKey="nums" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}