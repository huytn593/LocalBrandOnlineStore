import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const QAItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4 bg-white transition-all duration-300">
      <button 
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-lg pr-8">{question}</h3>
        <ChevronDown className={`transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
      </button>
      <div 
        className={`px-6 text-gray-600 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}
      >
         {answer}
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "Thời gian giao hàng là bao lâu?",
      a: "Thông thường đơn hàng nội thành sẽ mất 1-2 ngày, và 3-5 ngày đối với khu vực tỉnh. Các trường hợp vào dịp Sale lớn có thể chậm hơn 1-2 ngày."
    },
    {
      q: "Tôi có thể đổi size nếu mặc không vừa không?",
      a: "Tất nhiên rồi! LocalBrand áp dụng chính sách đổi hàng trong vòng 7 ngày kể từ khi bạn nhận được hàng. Hãy liên hệ hotline hoặc nhắn tin Fanpage để được hỗ trợ thủ tục đổi trả."
    },
    {
      q: "Hệ thống thanh toán VNPAY có an toàn không?",
      a: "VNPAY là cổng thanh toán điện tử chuẩn quốc gia được kết nối qua API mã hóa checksum 256-bit an toàn tuyệt đối. LocalBrand không lưu giữ bất kỳ thông tin số thẻ hay mật khẩu ngân hàng nào của bạn."
    },
    {
      q: "Làm sao để biết tôi mặc size nào?",
      a: "Trong mỗi trang Chi tiết sản phẩm đều có một BẢNG KÍCH THƯỚC (Size Guide). Bạn có thể đối chiếu dựa trên Chiều cao và Cân nặng để chọn size chuẩn nhất."
    },
    {
      q: "LocalBrand có xưởng sỉ không?",
      a: "Hiện tại chúng tôi chỉ phân phối bán lẻ thông qua các kênh chính thức để đảm bảo độ nguyên bản và chất lượng sản phẩm."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">Hỏi Đáp</h1>
        <p className="text-gray-500">Những câu hỏi thường gặp nhất được chúng tôi tổng hợp lại.</p>
      </div>
      
      <div>
        {faqs.map((faq, index) => (
          <QAItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
