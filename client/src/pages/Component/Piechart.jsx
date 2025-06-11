import { Cell, Pie, ResponsiveContainer, Tooltip,PieChart } from "recharts";

function Piechart({ complaintsByCategory }) {
  const COLORS = [
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#EC4899",
    "#84CC16",
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={complaintsByCategory}
            dataKey="complaint_count"
            nameKey="category_name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={3}
            label>
            {complaintsByCategory.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {complaintsByCategory.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}></div>
            <span className="text-sm text-gray-600">{item.category_name}</span>
            <span className="text-sm font-medium text-gray-900">
              {item.complaint_count}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Piechart;
