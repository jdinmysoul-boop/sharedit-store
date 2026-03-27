import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // 1. createPortal 불러오기
import useCartStore from '../store/useCartStore';
import { calculateItemTotal, calculateCartSummary } from '../lib/pricing';

export default function CartDrawer({ onCheckout }) {
  const { items, updateQuantity, removeItem, isDrawerOpen, toggleDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Hydration Error 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const summary = calculateCartSummary(items);

  // 2. createPortal을 사용하여 document.body에 직접 렌더링
  // 이렇게 하면 부모 요소의 스타일(transform 등)에 영향을 받지 않고 화면 전체에 고정됩니다.
  return createPortal(
    <>
      {/* 배경 오버레이 */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => toggleDrawer(false)}
        />
      )}

      {/* 슬라이드 패널 */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur">
            <h2 className="text-lg font-bold text-[#1d1d1f]">장바구니 ({items.length})</h2>
            <button onClick={() => toggleDrawer(false)} className="p-2 text-gray-400 hover:text-gray-900">✕</button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-4">🛒</span>
                <p>장바구니가 비어있습니다.</p>
              </div>
            ) : (
              items.map((item) => {
                const calc = calculateItemTotal(item);
                return (
                  <div key={`${item.id}-${item.selectedOption}`} className="flex gap-4">
                    {/* 이미지 */}
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      {item.heroImage ? (
                        <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                      )}
                    </div>
                    
                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-bold text-[#1d1d1f] text-sm truncate">{item.name}</h4>
                        <button onClick={() => removeItem(item.id, item.selectedOption)} className="text-xs text-gray-400 hover:text-red-500 shrink-0">삭제</button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate">{item.category}</p>

                      {/* 가격 및 수량 조절 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg h-8">
                          <button onClick={() => updateQuantity(item.id, item.selectedOption, -1)} className="px-2 h-full text-gray-500 hover:bg-gray-100 rounded-l-lg">-</button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedOption, 1)} className="px-2 h-full text-gray-500 hover:bg-gray-100 rounded-r-lg">+</button>
                        </div>
                        
                        <div className="text-right">
                          {calc.discount > 0 && (
                            <div className="flex items-center justify-end gap-1 mb-0.5">
                              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                                {calc.discountRate * 100}% SAVE
                              </span>
                              <span className="text-xs text-gray-400 line-through">₩ {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          )}
                          <p className="font-bold text-[#1d1d1f] text-sm">₩ {calc.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        {/* Footer (Total) */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="space-y-2 text-sm mb-6">
              
              {/* 🗑️ [삭제됨] 기존의 '총 상품금액' 표시는 지웠습니다. */}

              {/* 할인 내역 (할인이 있을 때만 표시) */}
              {summary.totalDiscount > 0 && (
                <div className="flex justify-between text-[#bf4800]">
                  <span>수량 할인</span>
                  <span>- ₩ {summary.totalDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* 공급가액 (이제 이게 첫 번째 줄입니다) */}
              <div className="flex justify-between text-gray-500">
                <span>공급가액</span>
                <span>₩ {summary.supplyPrice.toLocaleString()}</span>
              </div>

              {/* 부가세 */}
              <div className="flex justify-between text-gray-500">
                <span>부가세 (10%)</span>
                <span>₩ {summary.vat.toLocaleString()}</span>
              </div>

              {/* 최종 합계 */}
              <div className="flex justify-between items-end pt-2 mt-2 border-t border-gray-200">
                <span className="font-bold text-lg text-[#1d1d1f]">합계 금액</span>
                <span className="font-bold text-2xl text-primary">₩ {summary.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={items.length === 0}
              onClick={() => {
                toggleDrawer(false);
                onCheckout();
              }}
            >
              견적서 받기
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body // 3. document.body에 렌더링하도록 지정
  );
}