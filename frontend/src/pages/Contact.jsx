import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Liên Hệ</h1>
        <p className="text-gray-500">Chúng tôi luôn ở đây để hỗ trợ bạn. Vui lòng để lại lời nhắn hoặc liên hệ trực tiếp qua các thông tin bên dưới.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Info Column */}
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-black text-white p-3 rounded-full mr-4 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Trụ sở chính</h4>
                  <p className="text-gray-500">123 Phố Thời Trang, Quận Trung Tâm<br/>Thủ đô Hà Nội, Việt Nam</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-black text-white p-3 rounded-full mr-4 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Hotline</h4>
                  <p className="text-gray-500">1900 1234 56<br/>(8:00 - 22:00 hàng ngày)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-black text-white p-3 rounded-full mr-4 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-gray-500">support@localbrand.com<br/>partnership@localbrand.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Họ Tên</label>
                <input required type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số Điện Thoại</label>
                <input required type="tel" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" placeholder="090 123 4567" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lời Nhắn</label>
              <textarea required rows="4" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none" placeholder="Nhập nội dung bạn cần hỗ trợ..."></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition flex justify-center items-center">
              <Send size={18} className="mr-2" /> Gửi Yêu Cầu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
