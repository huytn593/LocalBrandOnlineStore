import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LOCALBRAND.</h3>
            <p className="text-gray-400 text-sm">
              Trang phục dạo phố tối giản dành cho cá nhân hiện đại.
              Chất lượng luôn đặt lên hàng đầu.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/stores" className="hover:text-white transition">Hệ Thống Cửa Hàng</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Về Chúng Tôi</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Hỏi Đáp FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Liên Hệ</Link></li>
              <li><Link to="/policies" className="hover:text-white transition">Chính Sách Khách Hàng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Đăng ký nhận tin</h4>
            <p className="text-gray-400 text-sm mb-4">Theo dõi để nhận thông tin cập nhật, ưu đãi độc quyền và nhiều hơn nữa.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="bg-gray-800 text-white px-4 py-2 w-full outline-none focus:ring-1 focus:ring-white"
              />
              <button className="bg-white text-black px-4 py-2 font-semibold hover:bg-gray-200 transition shrink-0">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} LocalBrand Online Store. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
