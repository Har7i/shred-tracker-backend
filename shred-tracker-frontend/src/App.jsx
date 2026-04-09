import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AddRecordForm from './components/AddRecordForm';
import RecordList from './components/RecordList';
import api from './api';
import WeightChart from './components/WeightChart';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化检查登录状态
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 尝试去后端拿一次数据，顺便验证 Token 是否真的有效
          const response = await api.get('/logs/');
          setRecords(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Token 已失效:", error);
          // 如果后端返回 401 或报错，说明 Token 坏了，清理掉它
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      // 无论有没有 Token，最后都要关掉加载状态
      setLoading(false); 
    };
    checkLoginStatus();
  }, []);

  // 刷新数据的函数
  const fetchRecords = async () => {
    try {
      const response = await api.get('/logs/');
      setRecords(response.data);
    } catch (error) {
      console.error("获取记录失败", error);
    }
  };

  // 删除逻辑
  const handleDelete = async (logDate) => {
    if (!window.confirm(`确定要删除 ${logDate} 的记录吗？`)) return;
    try {
      await api.delete(`/logs/${logDate}`);
      fetchRecords(); 
    } catch (error) {
      alert('删除失败');
    }
  };
  
  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRecords([]);
  };

  // --- 逻辑分水岭 ---

  // 1. 如果还在加载中，只显示这个
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-bold animate-pulse">正在同步数据...</div>
      </div>
    );
  }

  // 2. 加载完成后，根据是否登录显示不同页面
  // ... 前面的逻辑代码不变 ...

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {isLoggedIn ? (
        <div className="max-w-7xl mx-auto">
          {/* 顶部导航栏 */}
          <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                SHRED <span className="text-blue-600">TRACKER</span>
              </h1>
              <p className="text-sm text-gray-400 font-medium">欢迎回来，继续你的蜕变之旅</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              安全退出
            </button>
          </header>

          {/* 主布局：大屏左右，小屏上下 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 左侧/上方：趋势图表 (占据 2/3 宽度) */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <WeightChart records={records} />
              </section>
              
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">历史足迹</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                    共 {records.length} 条记录
                  </span>
                </div>
                <RecordList records={records} onDelete={handleDelete} />
              </section>
            </div>

            {/* 右侧/下方：操作面板 (占据 1/3 宽度) */}
            <div className="space-y-6">
              <div className="sticky top-6">
                <AddRecordForm onRecordAdded={fetchRecords} />
                
                {/* 装饰统计卡片 */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
                  <h4 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">当前状态</h4>
                  <p className="text-2xl font-black">持续蜕变中</p>
                  <div className="mt-4 h-1.5 w-full bg-blue-400/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;