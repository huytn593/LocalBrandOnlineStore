import { Shield, Truck, RefreshCw } from 'lucide-react';

const Policies = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight mb-4">Chính Sách Khách Hàng</h1>
        <p className="text-gray-500">Mọi quy định và quyền lợi khi mua sắm tại hệ thống LocalBrand.</p>
      </div>

      <div className="space-y-12">
        {/* Policy Item */}
        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-8">
          <div className="bg-white p-4 rounded-2xl h-min shadow-sm pointer-events-none">
            <RefreshCw size={32} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Chính Sách Đổi Trả</h2>
            <div className="text-gray-600 space-y-3 leading-relaxed">
              <p>Khách hàng được quyền đổi sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng với điều kiện:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sản phẩm còn nguyên tem, mác, chưa qua sử dụng hay giặt ủi.</li>
                <li>Hóa đơn mua hàng hoặc biên nhận điện tử hợp lệ.</li>
                <li>Không áp dụng đổi trả cho các sản phẩm trong đợt Sale/Clearance.</li>
              </ul>
              <p className="pt-2 text-sm italic text-gray-500">* Chi phí vận chuyển đổi trả sẽ do khách hàng chi trả trừ trường hợp lỗi từ phía sản xuất.</p>
            </div>
          </div>
        </section>

        {/* Policy Item */}
        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-8">
          <div className="bg-white p-4 rounded-2xl h-min shadow-sm pointer-events-none">
            <Truck size={32} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">2. Chính Sách Giao Hàng</h2>
            <div className="text-gray-600 space-y-3 leading-relaxed">
              <p>Hệ thống vận chuyển của chúng tôi bao phủ toàn quốc với thời gian nhanh chóng:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nội thành HCM/HN:</strong> Chuyển phát trong vòng 1-2 ngày làm việc.</li>
                <li><strong>Các tỉnh thành khác:</strong> Giao hàng tiêu chuẩn 3-5 ngày làm việc.</li>
                <li>Free ship cho mọi đơn hàng giá trị trên 500,000 VNĐ.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Policy Item */}
        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-8">
          <div className="bg-white p-4 rounded-2xl h-min shadow-sm pointer-events-none">
            <Shield size={32} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">3. Bảo Mật Thông Tin</h2>
            <div className="text-gray-600 space-y-3 leading-relaxed">
              <p>Bảo mật thông tin của khách hàng là ưu tiên hàng đầu của chúng tôi:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dữ liệu cá nhân chỉ được sử dụng cho mục đích giao hàng và CSKH.</li>
                <li>Tuyệt đối không bán hay chia sẻ dữ liệu cho bên thứ ba.</li>
                <li>Giao dịch thanh toán (VNPAY) được mã hóa theo chuẩn bảo mật ngân hàng.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Policies;
