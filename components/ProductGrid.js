import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import productsData from '../data/products.json';
import useCartStore from '../store/useCartStore';

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// [수정] props에 aiMode, aiReason, recommendedIds 추가
export default function ProductGrid({ selectedCategory, aiMode, aiReason, recommendedIds }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);

  const [previewItem, setPreviewItem] = useState(null);

  // [수정] 상품 필터링 로직 변경
  const getGroupedProducts = () => {
    let mainProducts = [];

    if (aiMode) {
      // 1. AI 모드: 추천 ID 목록에 있는 'main' 타입 상품만 필터링
      mainProducts = productsData.filter(p => 
        p.type === 'main' && recommendedIds.includes(p.id)
      );
    } else {
      // 2. 일반 모드: 기존 카테고리 로직
      mainProducts = selectedCategory === "전체" 
        ? productsData.filter(p => p.type === 'main')
        : productsData.filter(p => p.type === 'main' && p.category === selectedCategory);
    }

    return mainProducts.map(main => {
      const relatedOptions = main.options
        ? main.options.map(optId => productsData.find(p => p.id === optId)).filter(Boolean)
        : [];
      return { main, options: relatedOptions };
    });
  };

  const groupedItems = getGroupedProducts();

  const handleAddToCartFromPopup = (e) => {
    if(e) e.stopPropagation();
    if (previewItem) {
      addItem(previewItem);
      setPreviewItem(null); 
      toggleDrawer(true); 
    }
  };

  const handleQuickAdd = (e, item) => {
    e.stopPropagation(); 
    addItem(item);
    toggleDrawer(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-32">
      
      {/* 헤더 영역 */}
      <div className="mb-8">
        {aiMode ? (
          // [추가] AI 모드일 때 보여줄 추천 사유 박스
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#09afdf]/20 animate-fade-in-up mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#09afdf]/10 flex items-center justify-center text-2xl flex-shrink-0">
                🤖
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">AI 맞춤 제안</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  "{aiReason}"
                </p>
              </div>
            </div>
          </div>
        ) : (
          // 일반 모드 헤더
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-bold text-[#1d1d1f]">
              {selectedCategory === "전체" ? "모든 상품" : selectedCategory}
            </h2>
            <span className="text-sm text-gray-400 font-medium mb-1">
              ({groupedItems.length} items)
            </span>
          </div>
        )}
      </div>

      {/* 상품 그리드 (기존 코드 유지) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
        <AnimatePresence>
          {groupedItems.map(({ main, options }) => {
            const count = options.length;
            let spanClass = "lg:col-span-1";
            if (count >= 3) spanClass = "lg:col-span-3"; 
            else if (count > 0) spanClass = "lg:col-span-2";

            return (
              <motion.div
                key={main.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`${spanClass} flex flex-col md:flex-row gap-4 md:gap-6 h-full`}
              >
                {/* 메인 상품 */}
                <div className="flex-1 h-full">
                   <div className="h-full">
                     <ProductCard product={main} />
                   </div>
                </div>

                {/* 옵션 1-2 */}
                {count > 0 && (
                  <div className="flex-1 grid grid-rows-2 gap-4 md:gap-6 h-full">
                    {options.slice(0, 2).map(opt => (
                      <div 
                        key={opt.id} 
                        onClick={() => setPreviewItem(opt)}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden h-full"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-[#09afdf]">
                              옵션
                            </span>
                            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#09afdf] group-hover:text-white transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-[#1d1d1f] mb-1 group-hover:text-[#09afdf] transition-colors">{opt.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{opt.headline}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="font-bold text-[#1d1d1f]">
                            {opt.price === 0 ? '별도 문의' : `₩ ${opt.price.toLocaleString()}`}
                          </span>
                          <button 
                            onClick={(e) => handleQuickAdd(e, opt)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#09afdf] hover:text-white transition-all active:scale-95"
                            title="장바구니 담기"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {options.slice(0, 2).length === 1 && (
                      <div className="flex-1 hidden md:block opacity-0" aria-hidden="true"></div>
                    )}
                  </div>
                )}

                {/* 옵션 3+ */}
                {count >= 3 && (
                  <div className="flex-1 grid grid-rows-2 gap-4 md:gap-6 h-full">
                    {options.slice(2).map(opt => (
                      <div 
                        key={opt.id} 
                        onClick={() => setPreviewItem(opt)}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden h-full"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-[#09afdf]">
                              옵션
                            </span>
                            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#09afdf] group-hover:text-white transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-[#1d1d1f] mb-1 group-hover:text-[#09afdf] transition-colors">{opt.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{opt.headline}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="font-bold text-[#1d1d1f]">
                            {opt.price === 0 ? '별도 문의' : `₩ ${opt.price.toLocaleString()}`}
                          </span>
                          <button 
                            onClick={(e) => handleQuickAdd(e, opt)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#09afdf] hover:text-white transition-all active:scale-95"
                            title="장바구니 담기"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {options.slice(2).length === 1 && (
                      <div className="flex-1 hidden md:block opacity-0" aria-hidden="true"></div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* 검색 결과 없음 처리 */}
      {groupedItems.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          {aiMode 
            ? "조건에 맞는 추천 상품을 찾지 못했습니다. 다른 키워드로 검색해보세요." 
            : "해당 카테고리에 상품이 없습니다."}
        </div>
      )}

      {/* 팝업 모달 */}
      <Portal>
        {previewItem && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setPreviewItem(null)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-fade-in-up" 
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setPreviewItem(null)} 
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all font-bold text-xl shadow-sm"
              >
                ✕
              </button>
              
              <div className="w-full bg-gray-100 flex items-center justify-center p-0">
                 <img 
                   src={previewItem.referenceImage || previewItem.heroImage || "https://via.placeholder.com/800x450?text=No+Image"} 
                   alt={previewItem.name} 
                   className="w-full h-auto object-contain max-h-[60vh]"
                 />
                 {previewItem.youtubeLink && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                     <span className="text-white text-6xl opacity-80">▶</span>
                   </div>
                 )}
              </div>

              <div className="p-8 border-t border-gray-100 text-center bg-white sticky bottom-0 z-10">
                <span className="text-[#09afdf] font-bold text-xs uppercase tracking-wider mb-2 block">
                  {previewItem.category || "옵션 상품"}
                </span>
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-3">{previewItem.name}</h3>
                <p className="text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {previewItem.headline}
                </p>

                <button 
                  onClick={handleAddToCartFromPopup} 
                  className="bg-[#09afdf] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#078db3] transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        )}
      </Portal>

    </section>
  );
}