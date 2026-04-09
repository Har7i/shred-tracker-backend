import React, { useState } from 'react';
import api from '../api';

const AddRecordForm = ({ onRecordAdded }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 默认今天
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || weight <= 0) return alert("请输入合理的体重数值");

    setLoading(true);
    try {
      // 这里的路径记得用我们刚对齐过的 /logs/
      await api.post('/logs/', {
        weight: parseFloat(weight),
        date: date
      });
      
      setWeight(''); // 清空输入框
      // 核心：调用父组件传进来的刷新函数
      onRecordAdded(); 
      alert('打卡成功！');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "打卡失败，请重试";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-blue-100 p-2 rounded-lg mr-2">📝</span>
        今日打卡
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">体重 (kg)</label>
          <input 
            type="number" step="0.1" required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-lg font-semibold"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 ml-1">日期</label>
          <input 
            type="date" required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-600"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {loading ? '同步中...' : '确认打卡'}
        </button>
      </form>
    </div>
  );
};

export default AddRecordForm;