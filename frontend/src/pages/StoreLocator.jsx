import { MapPin, Phone, Clock } from 'lucide-react';

const StoreLocator = () => {
  const stores = [
    {
      city: "Hà Nội",
      name: "Flagship Store Hoàn Kiếm",
      address: "Số 1 Phố Hàng Khay, Phường Tràng Tiền, Quận Hoàn Kiếm, HN",
      phone: "024 1234 5678",
      hours: "09:00 - 22:00",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
    },
    {
      city: "Hồ Chí Minh",
      name: "Megastore Quận 1",
      address: "Tầng 2, TTTM Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
      phone: "028 8765 4321",
      hours: "09:30 - 22:00",
      image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80"
    },
    {
      city: "Đà Nẵng",
      name: "Premium Boutique Hải Châu",
      address: "154 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng",
      phone: "0236 1122 3344",
      hours: "08:30 - 21:30",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Hệ Thống Cửa Hàng</h1>
          <p className="text-gray-400">Trải nghiệm mua sắm trực tiếp tại các chi nhánh trên toàn quốc</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stores.map((store, idx) => (
             <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
               <div className="h-48 overflow-hidden bg-gray-200 relative group">
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-black px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full">
                    {store.city}
                  </div>
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="p-8">
                 <h2 className="text-xl font-bold mb-6">{store.name}</h2>
                 
                 <div className="space-y-4 text-sm text-gray-600">
                   <div className="flex items-start">
                     <MapPin size={18} className="shrink-0 mr-3 text-black" />
                     <span>{store.address}</span>
                   </div>
                   <div className="flex items-center">
                     <Phone size={18} className="shrink-0 mr-3 text-black" />
                     <span>{store.phone}</span>
                   </div>
                   <div className="flex items-center">
                     <Clock size={18} className="shrink-0 mr-3 text-black" />
                     <span>{store.hours} (Thứ 2 - CN)</span>
                   </div>
                 </div>
                 
                 <button className="w-full mt-8 border-2 border-black text-black font-bold py-3 rounded-xl hover:bg-black hover:text-white transition-colors">
                   Chỉ Đường
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
