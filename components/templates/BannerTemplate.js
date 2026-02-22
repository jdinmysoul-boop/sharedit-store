import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useCartStore from '../../store/useCartStore';
import productsData from '../../data/products.json';

// 팝업(모달)을 위한 포탈
function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function BannerTemplate() { 
  const bannerProducts = productsData.filter(p => p.category === '배너');
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const [selectedReference, setSelectedReference] = useState(null);

  const bannerAssets = [
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/Banner_A.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Banner_A.png" 
    },
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/Banner_B.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Banner_B.png"
    },
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/Banner_C.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Banner_C.png"
    },
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/Banner_D.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Banner_D.png"
    },
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/Banner_E.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Banner_E.png"
    },
  ];

  const handleAddToCart = (e, item) => {
    if(e) e.stopPropagation(); 
    addItem(item);
    toggleDrawer(true);
    setSelectedReference(null);
  };

  const getBannerStats = (index) => {
    const statsData = [
      { imp: "200,000+", ctr: "0.5%", slots: "2구좌", size: "260 x 260 px" }, 
      { imp: "100,000+", ctr: "0.7%", slots: "3구좌", size: "700 x 80 px" }, 
      { imp: "50,000+", ctr: "0.5%", slots: "3구좌", size: "700 x 80 px" }, 
      { imp: "30,000+", ctr: "0.3%", slots: "5구좌", size: "260 x 180 px" }, 
      { imp: "3,000+", ctr: "1.5%", slots: "1구좌", size: "2000 x 250 px" }, 
    ];
    const data = statsData[index] || { imp: "-", ctr: "-", slots: "-", size: "-" };

    return [
      { label: "월간 예상 노출", value: data.imp },
      { label: "월 평균 클릭률", value: data.ctr },
      { label: "구좌 수", value: data.slots },
      { label: "배너 사이즈", value: data.size },
    ];
  };

  return (
    <div className="bg-white min-h-screen w-full pb-32">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-8 inline-block p-4 rounded-3xl bg-gray-50">
          <span className="text-5xl">🚩</span>
        </div>
        <h2 className="text-[#bf4800] font-bold tracking-widest text-sm mb-4 uppercase">
          DISPLAY ADVERTISING
        </h2>
        <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight whitespace-pre-line bg-clip-text text-transparent bg-gradient-text">
          가장 확실한 노출,<br />쉐어드IT 배너 패키지
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto whitespace-pre-line">
          사이트 방문자에게 브랜드를 각인시키는 가장 직관적인 방법.<br/>
          타겟 고객의 동선에 맞춰 배치된 5가지 배너를 만나보세요.
        </p>
      </section>

      {/* Banner List Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-32">
          {bannerProducts.map((banner, index) => {
            const stats = getBannerStats(index);
            const images = bannerAssets[index] || { thumb: "", detail: "" };
            
            return (
              <div key={banner.id} className="flex flex-col md:flex-row items-center gap-16 w-full">
                <div className="flex-1 w-full order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-full">TYPE {index + 1}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-4 leading-tight">
                    {banner.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-10 break-keep whitespace-pre-line">
  {/* 헤드라인만 따로 묶어서 파란색(text-[#09afdf])과 굵게(font-bold) 적용 */}
  <strong className="text-[#09afdf] font-bold">{banner.headline}</strong><br/>
                    {banner.subhead}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10 w-full">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-lg font-bold text-[#1d1d1f]">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center pt-4 border-t border-gray-100 w-full">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#1d1d1f]">₩ {banner.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">기본가 (VAT 별도)</span>
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(e, banner)}
                      className="ml-auto bg-[#09afdf] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#078db3] transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap"
                    >
                      장바구니 담기
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full order-1 md:order-2">
                  <div 
                    className="relative aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                    onClick={() => setSelectedReference({ ...banner, detailImage: images.detail })}
                  >
                    <img 
                      src={images.thumb || "https://via.placeholder.com/800x500?text=No+Image"} 
                      alt={banner.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-white/30">
                        <span>자세히 보기 (Reference)</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    👆 이미지를 클릭하면 실제 적용 예시를 볼 수 있습니다.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 팝업 모달 */}
      <Portal>
        {selectedReference && (
          // 1. 배경: animate-fade-in
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setSelectedReference(null)}
          >
            {/* 2. 컨텐츠: animate-fade-in-up */}
            <div 
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-fade-in-up" 
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedReference(null)} 
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all font-bold text-xl shadow-sm"
              >
                ✕
              </button>

              <div className="w-full bg-gray-100 flex items-center justify-center p-0">
                 <img 
                   src={selectedReference.detailImage || selectedReference.heroImage} 
                   alt="Reference Detail" 
                   className="w-full h-auto object-contain"
                 />
              </div>
              
              <div className="p-8 border-t border-gray-100 text-center bg-white sticky bottom-0 z-10">
                 <h3 className="text-2xl font-bold mb-2 text-[#1d1d1f]">{selectedReference.name}</h3>
                 <p className="text-gray-500 mb-6 text-sm">실제 적용 예시 화면입니다.</p>
                 
                 <button 
                   onClick={(e) => handleAddToCart(e, selectedReference)}
                   className="bg-[#09afdf] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#078db3] transition-all shadow-lg shadow-blue-200 active:scale-95"
                 >
                   장바구니 담기
                 </button>
              </div>
            </div>
          </div>
        )}
      </Portal>

    </div>
  );
}