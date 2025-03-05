import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SubjectMarksPieChart = ({ data }) => {
  // Sample data structure if none is provided
  const sampleData = [
    { name: 'Mathematics', value: 85, color: '#8884d8' },
    { name: 'Physics', value: 78, color: '#82ca9d' },
    { name: 'Chemistry', value: 92, color: '#ffc658' },
    { name: 'Biology', value: 74, color: '#ff8042' },
    { name: 'Computer Science', value: 88, color: '#0088fe' }
  ];

  // Use provided data or fall back to sample data
  const chartData = data || sampleData;

  // Custom tooltip to show the subject name and marks
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} marks`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Subject Marks Distribution</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubjectMarksPieChart;