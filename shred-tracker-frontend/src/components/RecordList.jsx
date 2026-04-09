import React from 'react';

const RecordList = ({ records, onDelete }) => {
  // --- 1. “空状态”优化 ---
  // 如果后端传来的数组是空的，我们显示一个友好的提示，而不是一片空白
  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-16 text-center border-2 border-dashed border-gray-100">
        <div className="text-4xl mb-4">🥗</div>
        <h3 className="text-gray-800 font-bold text-lg">还没有记录呢</h3>
        <p className="text-gray-400 text-sm mt-2">
          每一滴汗水都值得被记录，快去上方打个卡吧！
        </p>
      </div>
    );
  }

  // --- 2. “数据排序” (确保图表和列表逻辑一致) ---
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sortedRecords.map((record) => (
        <div key={record.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-gray-400">{record.date}</span>
            
            {/* --- 3. “删除确认”优化 --- */}
            {/* 我们在点击按钮时，先弹窗询问，只有用户点“确定”才执行 onDelete */}
            <button 
              onClick={() => {
                if (window.confirm(`确定要删除 ${record.date} 这条记录吗？该操作不可撤销哦！`)) {
                  onDelete(record.date);
                }
              }}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-black text-gray-800">{record.weight}</span>
            <span className="ml-1 text-gray-400 font-bold">kg</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordList;