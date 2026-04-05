import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { formatPrice } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, revenueRes, topRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRevenueByMonth(),
        adminService.getTopProducts(5)
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (revenueRes.success) setRevenueByMonth(revenueRes.data);
      if (topRes.success) setTopProducts(topRes.data);
    } catch (err) {
      console.error('Failed fetching analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Chart Data Preparation
  const revenueChartData = {
    labels: revenueByMonth.map(item => `Tháng ${item.month}/${item.year}`),
    datasets: [
      {
        label: 'Doanh thu hàng tháng (VNĐ)',
        data: revenueByMonth.map(item => item.totalRevenue),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }
    ],
  };

  const topProductsChartData = {
    labels: topProducts.map(p => {
      const name = p?.productName || 'Sản phẩm';
      return name.length > 15 ? name.substring(0, 15) + '...' : name;
    }),
    datasets: [
      {
        label: 'Số lượng bán',
        data: topProducts.map(p => p?.totalQuantitySold || 0),
        backgroundColor: [
          '#000000',
          '#333333',
          '#666666',
          '#999999',
          '#cccccc'
        ],
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Tổng doanh thu</h3>
          <p className="text-3xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Tổng người dùng</h3>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Tổng sản phẩm</h3>
          <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-96">
          <h3 className="text-lg font-bold mb-4">Doanh thu theo tháng</h3>
          <Bar 
            data={revenueChartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } } 
            }} 
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-96 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 w-full text-left">Sản phẩm bán chạy nhất</h3>
          <div className="w-full max-w-xs flex-grow relative">
             <Pie 
               data={topProductsChartData} 
               options={{ 
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: { legend: { position: 'bottom' } }
               }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
