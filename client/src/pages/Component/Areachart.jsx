import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Areachart({monthlyTrends}) {
  return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrends}>
                <defs>
                    <linearGradient
                        id="colorComplaints"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="complaint_count"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorComplaints)"
                    strokeWidth={3}
                />
                <Area
                    type="monotone"
                    dataKey="resolved_count"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                    strokeWidth={3}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default Areachart