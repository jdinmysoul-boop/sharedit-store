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

export default function AmbassadorTemplate() { 
  // '앰배서더' 카테고리 상품만 가져오기
  const ambassadorProducts = productsData.filter(p => p.category === '앰배서더');
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const [selectedReference, setSelectedReference] = useState(null);

  // ----------------------------------------------------------------------
  // 👇 [설정] 앰배서더 상품별 이미지 (썸네일 & 상세 팝업)
  // ----------------------------------------------------------------------
  const ambassadorAssets = [
    // Ambassador Type 1
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/A_Insight.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Ambassador_profile.png" 
    },
    // Ambassador Type 2
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/A_RoundTable.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Ambassador_roundtable.png"
    },
    // Ambassador Type 3
    {
      thumb: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/A_Webinar.png",
      detail: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/Ambassador_webinar.png"
    },
  ];

  // 장바구니 담기
  const handleAddToCart = (e, item) => {
    e.stopPropagation(); 
    addItem(item);
    toggleDrawer(true);
    setSelectedReference(null);
  };

  // ----------------------------------------------------------------------
  // 👇 [설정] 앰배서더별 4대 성과 지표 (순서대로 적용됨)
  // ----------------------------------------------------------------------
  const getAmbassadorStats = (index) => {
    const statsData = [
      // 1. 첫 번째 상품 지표
      { label1: "참여 전문가 수", value1: "30 ~ 50명 / 서면 인터뷰", label2: "질문 수", value2: "15개 이하(주관식 가능)", label3: "조사 기간", value3: "1주일", label4: "결과물", value4: "조사 결과 + 참여자 개인정보" },
      // 2. 두 번째 상품 지표
      { label1: "참여 전문가 수", value1: "3 ~ 5명 / 화상회의 인터뷰", label2: "참여자 선정", value2: "인사이트 결과물을 토대로 선정", label3: "진행 방식", value3: "2시간동안 진행자와 질의응답", label4: "결과물", value4: "응답내용 녹화본" },
      // 3. 세 번째 상품 지표
      { label1: "진행 형태", value1: "진행자와 패널 간 토크쇼", label2: "진행 방식", value2: "질의응답 + 솔루션 소개", label3: "콘텐츠 유형", value3: "쉐어드IT 웨비나 패키지", label4: "결과물", value4: "참석자 리스트, 영상 파일 등" },
    ];
    
    // 데이터 매핑 (없으면 빈 값)
    const data = statsData[index] || { label1: "-", value1: "-", label2: "-", value2: "-", label3: "-", value3: "-", label4: "-", value4: "-" };

    return [
      { label: data.label1, value: data.value1 },
      { label: data.label2, value: data.value2 },
      { label: data.label3, value: data.value3 },
      { label: data.label4, value: data.value4 },
    ];
  };

  return (
    <div className="bg-white min-h-screen w-full pb-32">
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-8 inline-block p-4 rounded-3xl bg-gray-50">
          <span className="text-5xl">🤝</span>
        </div>
        <h2 className="text-[#bf4800] font-bold tracking-widest text-sm mb-4 uppercase">
          INFLUENCER MARKETING
        </h2>
        <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight whitespace-pre-line bg-clip-text text-transparent bg-gradient-text">
         신뢰할 수 있는 목소리,<br/>쉐어드IT 앰배서더
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto whitespace-pre-line">
          단순한 홍보가 아닙니다.<br/>
          현업 전문가의 통찰력으로 귀사의 솔루션을 강력하게 지지하고 검증합니다.
        </p>
      </section>

      {/* 2. List Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-32">
          {ambassadorProducts.map((product, index) => {
            const stats = getAmbassadorStats(index);
            const images = ambassadorAssets[index] || { thumb: "", detail: "" };
            
            return (
              <div key={product.id} className="flex flex-col md:flex-row items-center gap-16 w-full">
                
                {/* [좌측] 정보 영역 */}
                <div className="flex-1 w-full order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-full">TYPE {index + 1}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-4 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-10 break-keep whitespace-pre-line">
  {/* 헤드라인만 따로 묶어서 파란색(text-[#09afdf])과 굵게(font-bold) 적용 */}
  <strong className="text-[#09afdf] font-bold">{product.headline}</strong><br/>
  {product.subhead}
</p>
                  
                  {/* 4대 지표 그리드 */}
                  <div className="grid grid-cols-2 gap-4 mb-10 w-full">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-lg font-bold text-[#1d1d1f]">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 하단 금액 및 버튼 */}
                  <div className="flex items-center pt-4 border-t border-gray-100 w-full">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#1d1d1f]">₩ {product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">기본가 (VAT 별도)</span>
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="ml-auto bg-[#09afdf] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#078db3] transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap"
                    >
                      장바구니 담기
                    </button>
                  </div>
                </div>

                {/* [우측] 썸네일 이미지 영역 */}
                <div className="flex-1 w-full order-1 md:order-2">
                  <div 
                    className="relative aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                    onClick={() => setSelectedReference({ ...product, detailImage: images.detail })}
                  >
                    <img 
                      src={images.thumb || "https://via.placeholder.com/800x500?text=Ambassador+Image"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* 메인 페이지 스타일 호버 오버레이 */}
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
                    👆 이미지를 클릭하면 결과물 샘플을 볼 수 있습니다.
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Reference Modal (팝업) */}
      <Portal>
        {selectedReference && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setSelectedReference(null)}
          >
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
                   className="w-full h-auto object-contain max-h-[60vh]"
                 />
              </div>
              
              <div className="p-8 border-t border-gray-100 text-center bg-white sticky bottom-0 z-10">
                 <h3 className="text-2xl font-bold mb-2 text-[#1d1d1f]">{selectedReference.name}</h3>
                 <p className="text-gray-500 mb-6 text-sm">진행 예시 화면입니다.</p>
                 
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