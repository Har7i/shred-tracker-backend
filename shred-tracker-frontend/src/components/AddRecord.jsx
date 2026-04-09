import React, { useState } from 'react';
import api from '../api';

const AddRecord = ({ onRecordAdded }) => {
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 默认为今天

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 发送到后端 POST /records/
            await api.post('/logs/', {
                weight: parseFloat(weight),
                date: date
            });
            setWeight(''); // 清空输入框
            alert('打卡成功！');
            onRecordAdded(); // 触发父组件刷新列表
        } catch (error) {
            alert('打卡失败：' + (error.response?.data?.detail || '未知错误'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700">体重 (kg)</label>
                <input 
                    type="number" 
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    placeholder="例如: 75.5"
                />
            </div>
            <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700">日期</label>
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                />
            </div>
            <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors h-[42px]"
            >
                立即打卡
            </button>
        </form>
    );
};

export default AddRecord;