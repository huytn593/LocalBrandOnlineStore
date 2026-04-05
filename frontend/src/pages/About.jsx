const About = () => {
  return (
    <div>
      <div className="bg-black text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Định Hình Phong Cách. <br />Khẳng Định Bản Thân.</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Hành trình xây dựng LocalBrand bắt đầu từ khát khao mang tới những giá trị thực chất nhất cho thời trang đường phố Việt.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shrink-0">
             <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop" alt="Brand Story" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-700" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-6">Câu Chọn Của Sự Tối Giản</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Ra đời vào năm 2021, LocalBrand mong muốn xóa bỏ ranh giới của sự cầu kỳ rườm rà. Chúng tôi tin rằng, trang phục đẹp nhất là thứ khiến bạn tự tin bước ra đường mỗi ngày mà không cần phải suy nghĩ.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Các thiết kế của hệ thống không chạy theo xu hướng nhất thời, mà tập trung vào **Chất liệu, Phom dáng** và sự **Tiện dụng**.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Tầm Nhìn</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Trở thành thương hiệu Basic Streetwear hàng đầu tại Việt Nam, đưa sản phẩm local vươn tầm kiểm định quốc tế.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Sứ Mệnh</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Nâng chuẩn chất lượng tủ đồ của tủ đồ nam giới và nữ giới với mức giá dễ tiếp cận nhất.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Sản Xuất</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Tất cả sản phẩm đều được thiết kế, gia công và hoàn thiện tại các xưởng may công nghệ cao ở Việt Nam.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
