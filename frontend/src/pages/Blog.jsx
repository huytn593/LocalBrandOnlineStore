import { useState, useCallback } from 'react';
import { ArrowRight, X, Clock, Tag, ChevronRight, Loader2 } from 'lucide-react';

const ALL_POSTS = [
  {
    id: 1,
    tag: "Lookbook",
    tagColor: "bg-black text-white",
    date: "01/04/2026",
    readTime: "4 phút đọc",
    title: "Khám phá phong cách Urban Chic qua Bộ sưu tập Spring/Summer 2026",
    excerpt: "Sự giao thoa mượt mà giữa tính ứng dụng và nét tinh tế của đường phố đô thị hiện đại. Bộ sưu tập SS26 đặt trọng tâm vào những tông màu đất trung tính nhưng không kém phần cá tính.",
    content: `Bộ sưu tập **Spring/Summer 2026** của LocalBrand lần này mang đến một cái nhìn hoàn toàn mới về streetwear tối giản. Lấy cảm hứng từ kiến trúc đô thị và nhịp sống năng động của Hà Nội, từng thiết kế được chắt lọc để tạo nên sự cân bằng hoàn hảo giữa thoải mái và thẩm mỹ.

**Điểm nhấn của bộ sưu tập:**
- Tông màu Greige (gam màu chủ đạo xuyên suốt)  
- Chất liệu Cotton Rib 250GSM cao cấp không xù, không nhăn
- Form dáng Oversize chuẩn Hàn với tay drop-shoulder
- Cổ áo Ribbed tăng cường độ bền theo thời gian  

Sản phẩm dự kiến ra mắt chính thức vào đầu tháng 5/2026. Các thành viên đăng ký email sẽ được quyền tiếp cận sớm với ưu đãi Early Bird giảm 15%.`,
    image: "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=900&q=85&fit=crop",
    fallbackBg: "from-stone-100 to-stone-200",
    fallbackEmoji: "👗"
  },
  {
    id: 2,
    tag: "Bộ Sưu Tập",
    tagColor: "bg-gray-700 text-white",
    date: "25/03/2026",
    readTime: "3 phút đọc",
    title: "Chất liệu thân thiện với môi trường — Bước tiến tiếp theo của LocalBrand",
    excerpt: "Việc chuyển đổi sang quy trình dệt nhuộm bền vững đang được thực hiện ở nhà máy mới. Đây là cam kết dài hạn của chúng tôi với môi trường và thế hệ tương lai.",
    content: `Trong hành trình hướng tới thời trang bền vững, LocalBrand đã hợp tác với 3 nhà cung cấp vải tái chế hàng đầu tại Việt Nam và Đài Loan. Bắt đầu từ quý 2/2026, **30% sản phẩm** trong danh mục sẽ được sản xuất từ cotton hữu cơ (OCS) hoặc vải recycled polyester (rPET).

**Cam kết môi trường của chúng tôi:**
- Giảm 40% lượng nước tiêu thụ trong quy trình nhuộm
- 100% túi đóng gói từ vật liệu tái chế vào năm 2027
- Chương trình thu hồi quần áo cũ – đổi voucher mua sắm
- Carbon Neutral Shipping cho đơn hàng nội địa

Chúng tôi tin rằng thời trang đẹp không nhất thiết phải đánh đổi bằng sự lãng phí tài nguyên.`,
    image: "https://images.unsplash.com/photo-1489987707023-af619f3900dc?w=900&q=85&fit=crop",
    fallbackBg: "from-green-50 to-emerald-100",
    fallbackEmoji: "🌿"
  },
  {
    id: 3,
    tag: "Tips",
    tagColor: "bg-amber-500 text-white",
    date: "15/03/2026",
    readTime: "5 phút đọc",
    title: "Bí quyết giữ phom áo thun luôn như mới sau 100 lần giặt",
    excerpt: "Một số mẹo nhỏ bạn chưa biết khi phân loại và giặt ủi áo thun basic để kéo dài tuổi thọ sản phẩm lên đến 3–5 năm.",
    content: `Áo thun basic là nền tảng của mọi tủ đồ tối giản, nhưng để giữ được form và màu sắc ban đầu sau nhiều lần giặt không phải ai cũng biết cách.

**5 quy tắc vàng cần nhớ:**

1. **Lật mặt trong khi giặt** — Hạn chế ma sát trực tiếp lên mặt vải bên ngoài, bảo vệ màu in và màu nhuộm.

2. **Nhiệt độ giặt ≤ 30°C** — Nước nóng là nguyên nhân chính khiến cotton bị co và xù lông.

3. **Không dùng máy sấy** — Nhiệt từ máy sấy phá vỡ cấu trúc sợi cotton. Phơi nơi thoáng mát, tránh nắng trực tiếp.

4. **Không dùng nước xả vải thường xuyên** — Hóa chất trong nước xả làm mềm sợi vải nhưng cũng khiến vải mỏng dần.

5. **Gấp thay vì móc** — Áo thun bị kéo giãn cổ do móc quá lâu. Hãy xếp gọn vào ngăn kéo theo chiều đứng (phương pháp KonMari).`,
    image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=900&q=85&fit=crop",
    fallbackBg: "from-blue-50 to-indigo-100",
    fallbackEmoji: "👕"
  },
  {
    id: 4,
    tag: "Khuyến Mãi",
    tagColor: "bg-red-500 text-white",
    date: "10/03/2026",
    readTime: "2 phút đọc",
    title: "SALE hè 2026 — Giảm đến 40% toàn bộ dòng Basic Tees & Shorts",
    excerpt: "Đợt thanh lý cuối mùa lớn nhất năm sắp diễn ra. Cơ hội sở hữu các thiết kế core collection với mức giá chưa từng có.",
    content: `Chào bạn, đây là thông báo quan trọng từ team LocalBrand!

Từ ngày **15/03 – 31/03/2026**, toàn bộ danh mục Basic Tees và Summer Shorts sẽ được áp dụng mức giảm:

| Danh mục | Mức giảm |
|---|---|
| Áo thun basic | -20% |
| Áo thun premium | -30% |
| Shorts kaki | -25% |
| Combo (áo + quần) | -40% |

**Điều kiện áp dụng:**
- Không giới hạn số lượng mua.
- Áp dụng tự động khi thêm vào giỏ hàng.
- Không kết hợp với voucher khác.

Đừng bỏ lỡ — số lượng hàng thanh lý có hạn!`,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85&fit=crop",
    fallbackBg: "from-red-50 to-rose-100",
    fallbackEmoji: "🏷️"
  },
  {
    id: 5,
    tag: "Lookbook",
    tagColor: "bg-black text-white",
    date: "05/03/2026",
    readTime: "6 phút đọc",
    title: "Phong cách Monochrome: Bộ cơ bản phối một tông màu dễ mặc nhất",
    excerpt: "Từ trắng thuần, đen tuyền đến be/cream, monochrome là cách phối đồ thông minh nhất để trông chỉn chu mọi lúc mọi nơi mà không tốn quá nhiều công sức.",
    content: `Monochrome — phối đồ toàn một sắc độ — luôn là công thức an toàn nhất trong thế giới thời trang tối giản. Nhưng để phối thực sự đẹp, có vài điều bạn cần chú ý thêm ngoài việc chỉ mặc cùng màu.

**Công thức Monochrome BasicCore:**

**All-White:** Áo thun oversize trắng + quần baggy cotton trắng + giày canvas trắng. Điểm nhấn là chất liệu — texture tạo chiều sâu khi màu đồng phẳng.

**All-Black:** Áo crewneck đen + quần track pants đen + Chelsea boots hoặc sneakers đen. Classic không bao giờ sai.

**Greige/Cream Tone:** Tone đất từ be nhạt đến nâu kem — đây là lựa chọn đang rất hot năm 2026 vì dễ mix với mọi diện và cực ăn ảnh dưới ánh sáng tự nhiên.

Chìa khóa thành công là **chơi texture** (cotton nhám vs. vải trơn mượt) và **layering** (áo blazer cùng tone khoác ngoài).`,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&fit=crop",
    fallbackBg: "from-gray-100 to-gray-200",
    fallbackEmoji: "🖤"
  },
  {
    id: 6,
    tag: "Bộ Sưu Tập",
    tagColor: "bg-gray-700 text-white",
    date: "20/02/2026",
    readTime: "3 phút đọc",
    title: "Giới thiệu dòng sản phẩm Accessories — Nón, Túi, Dây đai LocalBrand",
    excerpt: "Sau nhiều tháng chờ đợi, LocalBrand chính thức mở rộng sang dòng phụ kiện thời trang. Đơn giản, tinh tế và hoàn toàn matching với tủ đồ basic.",
    content: `Bước tiến tiếp theo trong hành trình xây dựng một wardrobe hoàn chỉnh — Accessories Collection mùa hè 2026 của LocalBrand đã chính thức lên kệ!

**Các sản phẩm trong BST:**

🧢 **Bucket Hat Premium** — Vành xéo kiểu Hàn, chất liệu cotton ripstop chống nước nhẹ. Available 4 màu: Đen, Be, Xanh rêu, Caramel.

👜 **Tote Bag Canvas** — Túi vải dày 16oz, 2 màu trắng/đen. In logo deboss thay vì in phun để bền màu theo thời gian.

🪢 **Web Belt** — Dây đai dệt textile 3.5cm kiểu thể thao tối giản. Khóa D-ring bằng kim loại mờ matte.

🧣 **Ribbed Beanie** — Mũ len knit unisex, chất cotton-acrylic blend giữ ấm tốt và không gây dị ứng da.

Tất cả sản phẩm accessories hiện đã có trong mục sản phẩm của website và hệ thống cửa hàng toàn quốc.`,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85&fit=crop",
    fallbackBg: "from-purple-50 to-violet-100",
    fallbackEmoji: "🧢"
  }
];

const CATEGORIES = ["Tất cả", "Lookbook", "Bộ Sưu Tập", "Tips", "Khuyến Mãi"];
const PAGE_SIZE = 3;

const ImageWithFallback = ({ src, alt, fallbackBg, fallbackEmoji }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${fallbackBg} flex flex-col items-center justify-center`}>
        <span className="text-6xl mb-2">{fallbackEmoji}</span>
        <span className="text-sm font-medium text-gray-500">LocalBrand</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      onError={() => setError(true)}
    />
  );
};

const ArticleModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image */}
        <div className="h-64 bg-gray-100 relative shrink-0">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            fallbackBg={post.fallbackBg}
            fallbackEmoji={post.fallbackEmoji}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition"
          >
            <X size={20} />
          </button>
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${post.tagColor}`}>
            {post.tag}
          </span>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-8 flex-1">
          <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1"><Tag size={12} /> {post.tag}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          </div>

          <h2 className="text-2xl font-black text-black mb-6 leading-snug">{post.title}</h2>

          <div className="text-gray-600 leading-relaxed text-[15px] space-y-4">
            {post.content.split('\n').map((line, i) => {
              if (!line.trim()) return null;
              // Bold via **text**
              const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              return (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{ __html: rendered }}
                  className={line.startsWith('-') ? 'pl-4' : ''}
                />
              );
            })}
          </div>
        </div>

        <div className="px-8 pb-8 pt-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition"
          >
            Đóng bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const filtered = activeCategory === "Tất cả"
    ? ALL_POSTS
    : ALL_POSTS.filter(p => p.tag === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 600);
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Tin Tức & Lookbook</h1>
            <p className="text-gray-500">Cập nhật nhanh nhất xu hướng thời trang đường phố</p>
          </div>

          {/* Category Filter */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium">Không có bài viết nào trong chủ đề này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visible.map(post => (
              <article
                key={post.id}
                className="group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    fallbackBg={post.fallbackBg}
                    fallbackEmoji={post.fallbackEmoji}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${post.tagColor}`}>
                      {post.tag}
                    </span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-gray-600 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                  <div className="inline-flex items-center font-bold text-sm pb-1 border-b border-black gap-1 group-hover:gap-2 transition-all">
                    Đọc Tiếp <ChevronRight size={16} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-16 text-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-black font-bold hover:bg-black hover:text-white transition-all disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  Tải Thêm Bài Viết
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          ) : filtered.length > PAGE_SIZE ? (
            <p className="text-gray-400 font-medium">Bạn đã xem hết tất cả bài viết 🎉</p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Blog;
