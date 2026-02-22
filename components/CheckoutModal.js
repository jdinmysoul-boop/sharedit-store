import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import { calculateCartSummary } from '../lib/pricing';

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    consultation: true,
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const summary = calculateCartSummary(items);

    // 👇👇👇 [여기에 구글 앱스 스크립트 배포 URL을 넣어주세요] 👇👇👇
    // 따옴표("") 안에 아까 복사한 주소(https://script.google.com/...)를 붙여넣으세요.
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyt90wNeA8gIxRZGvK-iTRac7GTBU0LIkQxxASGiQnWt_CnjDGdJvo2sFmC3BrgFa37WQ/exec"; 

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // 구글 스크립트 전송 필수 설정
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData, // company, name, email, phone, message 등 폼 데이터
          items,       // 장바구니 상품 목록
          summary      // 금액 정보
        }),
      });

      // no-cors 모드는 성공 여부를 알 수 없으므로, 에러가 안 나면 성공으로 처리
      setSuccess(true);
      clearCart();
      
    } catch (error) {
      console.error("Error:", error);
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-hidden animate-fade-in-up">
        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">접수되었습니다!</h2>
            <p className="text-gray-500 mb-8">
              입력하신 정보가 담당자에게 전달되었습니다.<br/>
              빠르게 확인 후 연락드리겠습니다.
            </p>
            <button onClick={onClose} className="bg-[#1d1d1f] text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors">
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1d1d1f]">견적서 요청</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">회사명</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">담당자명</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">연락처</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">이메일</label>
                <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="consultation"
                  checked={formData.consultation}
                  onChange={e => setFormData({...formData, consultation: e.target.checked})}
                  className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer accent-primary" 
                />
                <label htmlFor="consultation" className="text-sm cursor-pointer select-none">
                  <span className="font-bold text-[#1d1d1f] block">구체적인 상담이 필요합니다.</span>
                  <span className="text-xs text-gray-500">체크하시면 담당자가 상품 상세 안내 및 미팅 일정을 제안드립니다.</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">문의사항 (선택)</label>
                <textarea rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : "견적서 요청하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}