import { useState } from 'react'; // [추가] 상태 관리를 위해 필요
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { siteConfig } from '../config/siteConfig';
import useCartStore from '../store/useCartStore';

// [추가] 컴포넌트 불러오기
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';

export default function Layout({ children }) {
  const items = useCartStore((state) => state.items);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  
  // [추가] 견적서 모달 열림/닫힘 상태 관리
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const router = useRouter();
  const isDetailPage = router.pathname.startsWith('/products/');

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen font-sans text-[#1d1d1f] ${isDetailPage ? 'bg-white' : 'bg-[#f5f5f7]'}`}>
      <Head>
       <title>쉐어드IT - 광고상품 스토어</title>
  <meta name="description" content={siteConfig.description} />
</Head>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-14 flex items-center transition-all">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* 🛠️ [수정됨] 로고 클릭 영역 확대 및 따옴표 오류 해결 */}
          <Link 
            href="https://www.sharedit.co.kr" 
            target="_blank" 
            className="flex items-center gap-2 group p-2 -ml-2 rounded-lg hover:bg-gray-100/50 transition-colors"
          >
             {siteConfig.logo ? (
                <img 
                  src="https://sharedit.speedgabia.com/shareditad/2026/SharedIT_Logo.png" 
                  alt="SharedIT" 
                  className="h-6 w-auto" 
                />
             ) : (
                <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">쉐어드IT 광고상품 스토어</span>
             )}
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors hidden sm:block">스토어 홈</Link>
            <button 
              onClick={() => toggleDrawer(true)} 
              className="relative hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>장바구니</span>
              {totalItems > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full animate-fade-in-up">
        {children}
      </main>

      {/* Footer */}
      <footer className={`bg-white border-t border-gray-200 py-12 ${isDetailPage ? 'mt-0 border-t-0' : 'mt-20'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs mb-2">&copy; 2026 SharedIT. All rights reserved.</p>
         
        </div>
      </footer>

      {/* 장바구니 및 모달 컴포넌트 */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={true} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </div>
  );
}