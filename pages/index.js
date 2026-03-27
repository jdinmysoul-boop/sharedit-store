import { useState } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';

export default function Home() {
  const [category, setCategory] = useState("전체");
  
  // AI 및 상태 관리
  const [aiMode, setAiMode] = useState(false);
  const [aiReason, setAiReason] = useState("");
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false); // 로딩 상태 추가

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // [수정됨] 실제 Gemini API 호출 함수
  const handleAiSearch = async (query) => {
    setIsAiLoading(true); // 로딩 시작
    setAiMode(true); // AI 모드 진입 (화면 전환)
    
    try {
      // 1. API 요청 보내기
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. 결과 적용
        setRecommendedIds(data.recommendedIds || []);
        setAiReason(data.reason || "조건에 맞는 상품을 찾았습니다.");
        setCategory("AI 추천");
        
        // 3. 스크롤 이동
        window.scrollTo({ top: 600, behavior: 'smooth' });
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      console.error(error);
      setAiReason("죄송합니다. AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setRecommendedIds([]);
    } finally {
      setIsAiLoading(false); // 로딩 끝
    }
  };

  // 탭 변경 시 AI 모드 해제
  const handleTabChange = (newCategory) => {
    setAiMode(false);
    setCategory(newCategory);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection onSearch={handleAiSearch} isLoading={isAiLoading} />

      {/* Category Nav */}
      <CategoryNav activeTab={category} onTabChange={handleTabChange} />

      {/* Product Grid */}
      <div className="bg-[#f5f5f7] min-h-screen pt-8">
        {/* 로딩 중일 때 표시할 UI (선택 사항) */}
        {isAiLoading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-600">AI가 최적의 마케팅 플랜을 분석 중입니다...</h3>
            <p className="text-gray-400 mt-2">잠시만 기다려주세요.</p>
          </div>
        ) : (
          <ProductGrid 
            selectedCategory={category} 
            aiMode={aiMode} 
            aiReason={aiReason} 
            recommendedIds={recommendedIds} 
          />
        )}
      </div>

      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </Layout>
  );
}