import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const WeightChart = ({ records }) => {
  // 1. 数据清洗：按日期排序（从小到大）
  const sortedData = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (sortedData.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center bg-blue-50 rounded-2xl border-2 border-dashed border-blue-100 text-blue-400 text-sm">
        需要至少 2 条数据来生成趋势图...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-green-100 p-2 rounded-lg mr-2">📈</span>
        体重趋势
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{fontSize: 12, fill: '#9ca3af'}}
              axisLine={false}
              tickLine={false}
              tickFormatter={(str) => str.split('-').slice(1).join('/')} // 格式化日期显示 MM/DD
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - 2', 'dataMax + 2']} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              labelStyle={{ color: '#9ca3af', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;