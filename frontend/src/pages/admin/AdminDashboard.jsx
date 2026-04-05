import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LayoutGrid } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-[1400px] mx-auto py-8">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-black tracking-wider uppercase">Bảng điều khiển</h2>
          
          <nav className="space-y-2">
             <NavLink 
               to="/admin/analytics" 
               className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
             >
               <LayoutDashboard size={20} />
               <span className="font-medium">Thống kê</span>
             </NavLink>

             <NavLink 
               to="/admin/categories" 
               className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
             >
               <LayoutGrid size={20} />
               <span className="font-medium">Quản lý danh mục</span>
             </NavLink>
             
             <NavLink 
               to="/admin/products" 
               className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
             >
               <Package size={20} />
               <span className="font-medium">Quản lý sản phẩm</span>
             </NavLink>
             
             <NavLink 
               to="/admin/orders" 
               className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
             >
               <ShoppingCart size={20} />
               <span className="font-medium">Quản lý đơn hàng</span>
             </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminDashboard;
