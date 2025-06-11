import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Barcharts({complaintsByCity}) {
  return (
       <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complaintsByCity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey={name}
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
                    <Bar
                      dataKey="complaint_count"
                      fill="url(#colorGradient1)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="resolved_count"
                      fill="url(#colorGradient2)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient
                        id="colorGradient2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
  )
}

export default Barcharts