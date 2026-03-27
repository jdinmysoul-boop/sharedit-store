import { useRouter } from 'next/router';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product, onClick }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    addItem(product);
  };

  const displayPrice = product.price === 0 ? "별도 문의" : `₩ ${product.price.toLocaleString()}`;

  return (
    <div 
      onClick={handleCardClick}
      className="group/card relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md cursor-pointer h-full border border-gray-100"
    >
      {/* 1. 이미지 영역 (group/image) */}
      <div className="group/image relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.heroImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
        />
        
        {/* 메인 상품 태그 */}
        <div className="absolute top-4 left-4">
          <span className="inline-block rounded-md bg-black px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            {product.category}
          </span>
        </div>

        {/* 👇 [수정됨] 호버 시 오버레이: 애니메이션 속성(transition-opacity duration-300) 삭제 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/image:opacity-100">
          {/* 버튼: 마우스 호버 시 색상 변경(Stage 3)은 유지 */}
          <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/20 px-5 py-2.5 backdrop-blur-md text-white font-bold hover:bg-white/30 transition-colors">
             <span>자세히 보기</span>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
             </svg>
          </div>
        </div>
      </div>

      {/* 2. 텍스트 정보 영역 */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-2 leading-snug">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-500 leading-relaxed mb-4">
            {product.headline}
          </p>
        </div>
        
        {/* 하단 영역 */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <span className="font-bold text-[#1d1d1f]">{displayPrice}</span>
          
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#09afdf] hover:text-white transition-all active:scale-95"
            title="장바구니 담기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}