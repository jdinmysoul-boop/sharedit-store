import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useCartStore from '../../store/useCartStore';
import productsData from '../../data/products.json';

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function VideoTemplate({ product }) {
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(''); // 재생할 비디오 ID 저장
  const [selectedOptionIds, setSelectedOptionIds] = useState([product.id]);
  const [optionDetail, setOptionDetail] = useState(null);

  const addItem = useCartStore((state) => state.addItem);

  // 1. 상품 타입 정의
  const isSuda = product.name.includes("쉐어드잇수다");
  const isSalon = product.name.includes("쉐어드살롱");
  const isReview = product.name.includes("리뷰");

  // -------------------------------------------------------
  // [설정] 상품별 콘텐츠 데이터 매핑
  // -------------------------------------------------------
  const getContent = () => {
    // A. 쉐어드잇수다
    if (isSuda) {
      return {
        icon: '📑',
        label: 'IT CLASS 101',
        // 섹션 1: 인트로
        introTitle: "교실에서 배우는 재미난 IT",
        introDesc: "딱딱한 IT 이야기를 쉽고 재미있게 풀어냅니다.",
        introImg: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/V_Itsuda.png", 
        // 섹션 2: 하이라이트
        highlightTitle: "쉽게 가르쳐야\n오래 기억합니다",
        highlightDesc: "어려운 기술 설명은 이제 그만.\n전문가들의 편안한 수다를 통해 귀사의 솔루션을\n가장 자연스럽고 친근하게 소개합니다.",
        highlightVideoId: 'mSQi336H6u4', 
        // 섹션 3: 레퍼런스
        refTitle: "다수의 레퍼런스를\n직접 확인하세요",
        refDesc: "수많은 기업이 쉐어드잇수다를 통해 고객과 만났습니다.\n지금 쉐어드잇수다 재생목록을 확인해보세요.",
        refLink: "https://www.youtube.com/playlist?list=PLyPtqY7T1louP6I3ffo6thb5RA63GL0SN", 
        refVideoId: '3q46dE081hQ'
      };
    }
    // B. 쉐어드살롱
    if (isSalon) {
      return {
        icon: '🛋️',
        label: 'PREMIUM TALK SHOW',
        // 섹션 1
        introTitle: "깊이 있는 통찰,\n품격 있는 토크쇼",
        introDesc: "편안한 분위기 속에서 깊이 있는 인사이트를 나눕니다.",
        introImg: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/V_Salon.png", 
        // 섹션 2
        highlightTitle: "전문가의 시선으로\n브랜드를 탐구합니다",
        highlightDesc: "단순한 정보 전달을 넘어선 인사이트.\n업계 최고의 전문가들과 함께하는 고품격 토크쇼로\n귀사 브랜드의 가치를 높여드립니다.",
        highlightVideoId: 'tfmmL6gN16w', 
        // 섹션 3
        refTitle: "성공적인 브랜딩 사례를 \n확인하세요",
        refDesc: "날카로운 질문으로 깊이를 더합니다.\n쉐어드살롱의 레퍼런스를 확인해보세요.",
        refLink: "https://youtu.be/LVx4m0E3uak",
        refVideoId: 'LVx4m0E3uak'
      };
    }
    // C. 솔루션 리뷰
    if (isReview) {
      return {
        icon: '🔍',
        label: 'SOLUTION REVIEW',
        // 섹션 1
        introTitle: "백 마디 말보다,\n한 번의 확실한 검증",
        introDesc: "제3자의 객관적인 평가로 고객의 신뢰를 얻으세요.",
        introImg: "https://sharedit.speedgabia.com/shareditad/2026/thumbnail/V_Review.png", 
        // 섹션 2
        highlightTitle: "날카로운 분석,\n확실한 증명",
        highlightDesc: "기능 시연부터 실사용 테스트까지.\n쉐어드IT 전문 리뷰어가 귀사의 솔루션을\n사용자의 관점에서 철저하게 분석합니다.",
        highlightVideoId: 'urVLForI-HI', 
        // 섹션 3
        refTitle: "신뢰도를 높이는 리뷰 영상",
        refDesc: "도입을 망설이는 고객에게 확신을 심어주세요.\n정확한 딕션과 쉬운 설명으로 귀사의 솔루션을 리뷰합니다.",
        refLink: "https://www.youtube.com/playlist?list=PLyPtqY7T1loualgY9qpPaLodrHq0KYlwD",
        refVideoId: 'Z8hRDhRys1M'
      };
    }
    // 기본값
    return {
      icon: '🎬',
      label: 'VIDEO CONTENT',
      introTitle: "브랜드를 빛내는 영상",
      introDesc: "최적의 영상 콘텐츠를 제작해 드립니다.",
      introImg: "https://via.placeholder.com/800x450",
      highlightTitle: "핵심 기능 소개",
      highlightDesc: "귀사의 솔루션을 가장 효과적으로 전달합니다.",
      highlightVideoId: '',
      refTitle: "성공 사례",
      refDesc: "다양한 성공 사례를 확인해보세요.",
      refLink: "#",
      refVideoId: ''
    };
  };

  const content = getContent();

  // 옵션 데이터 로드
  const optionProducts = product.options
    ? product.options.map(optId => productsData.find(p => p.id === optId)).filter(Boolean)
    : [];

  const totalPrice = product.price + optionProducts
    .filter(opt => selectedOptionIds.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);

  const handleAddToCart = () => {
    addItem(product);
    selectedOptionIds.forEach(optId => {
      const optProduct = optionProducts.find(p => p.id === optId);
      if (optProduct) addItem(optProduct);
    });
  };

  const toggleOption = (optId) => {
    if (selectedOptionIds.includes(optId)) {
      setSelectedOptionIds(prev => prev.filter(id => id !== optId));
    } else {
      setSelectedOptionIds(prev => [...prev, optId]);
    }
  };

  const openOptionDetail = (optId) => {
    const opt = productsData.find(p => p.id === optId);
    if (opt) setOptionDetail(opt);
  };

  const playVideo = (id) => {
    setCurrentVideoId(id);
    setShowVideo(true);
  };

  // 하단 포함 내역 (Tech Specs)
  const getTechSpecs = () => {
    if (isSuda) {
      return [
        { title: "기획 (Planning)", items: ["주제 선정 및 구성안", "보조 MC 섭외(IT초보자/IT현직자)", "사전 미팅"] },
        { title: "촬영 (Shooting)", items: ["교실 스튜디오 섭외", "3캠 4K 촬영", "재미난 수업 분위기"] },
        { title: "편집 (Editing)", items: ["유튜브 예능형 자막", "컷 편집 및 보정", "자료화면 삽입"] },
        { title: "배포 (Distribution)", items: ["쉐어드IT 유튜브 업로드", "뉴스레터 발송", "LinkedIn 포스팅"] }
      ];
    }
    if (isSalon) {
      return [
        { title: "기획 (Planning)", items: ["토크쇼 주제 기획", "질문 리스트 작성", "사전 미팅"] },
        { title: "촬영 (Shooting)", items: ["스튜디오 섭외", "3캠 4K 촬영", "편안한 토크쇼 분위기"] },
        { title: "편집 (Editing)", items: ["깔끔한 말자막", "하이라이트 영상", "풀버전 편집"] },
        { title: "배포 (Distribution)", items: ["쉐어드IT 유튜브 업로드", "뉴스레터 발송", "LinkedIn 포스팅"] }
      ];
    }
    if (isReview) {
      return [
        { title: "체험 (Demo)", items: ["솔루션 기능 상세 분석", "최소 2주간 체험", "경쟁 솔루션 비교 분석"] },
        { title: "촬영 (Shooting)", items: ["쉐어드IT 스튜디오", "3캠 4K 촬영", "솔루션 장단점 솔직 리뷰"] },
        { title: "편집 (Edition)", items: ["깔끔한 말자막", "자료화면 삽입", "이해하기 쉬운 내레이션"] },
        { title: "배포 (Distribution)", items: ["쉐어드IT 유튜브 업로드", "뉴스레터 발송", "LinkedIn 포스팅"] }
      ];
    }
    return [];
  };

  const techSpecs = getTechSpecs();

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex flex-col w-full">
      
      {/* 1. Hero Section (공통) */}
      <section className="w-full bg-white pt-32 pb-20 px-6 flex-none">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="mb-8 inline-block p-4 rounded-3xl bg-gray-50 shadow-sm">
            <span className="text-5xl">{content.icon}</span>
          </div>
          <h2 className="text-[#bf4800] font-bold tracking-widest text-sm mb-4 uppercase">
            {content.label}
          </h2>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-snug whitespace-pre-line bg-clip-text text-transparent bg-gradient-text">
            {product.headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto whitespace-pre-line">
            {product.subhead}
          </p>
        </div>
      </section>

      {/* 2. Intro Section (좌: 텍스트 / 우: 이미지) */}
      <section className="w-full bg-white py-24 px-6 flex-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h3 className="text-[#09afdf] font-bold text-lg mb-2">{product.name}</h3>
            <h2 className="text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight whitespace-pre-line">
              {content.introTitle}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-line">
              {content.introDesc}
            </p>
          </div>
          <div className="flex-1 w-full">
             <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
               <img src={content.introImg} alt="Intro" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* 3. Highlight Section (좌: 영상 / 우: 텍스트) */}
      <section className="w-full bg-[#f5f5f7] py-24 px-6 flex-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* 좌측 영상 */}
          <div className="flex-1 w-full">
            <div 
              className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => playVideo(content.highlightVideoId)}
            >
               {content.highlightVideoId ? (
                 <>
                   <img src={`https://img.youtube.com/vi/${content.highlightVideoId}/maxresdefault.jpg`} alt="Highlight" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-red-600 transition-all scale-100 group-hover:scale-110">
                        <span className="text-white text-3xl ml-1">▶</span>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500">영상 준비중</div>
               )}
            </div>
          </div>

          {/* 우측 텍스트 */}
          <div className="flex-1 text-right md:text-right">
            <h3 className="text-[#09afdf] font-bold text-lg mb-2">Highlight Feature</h3>
            <h2 className="text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight whitespace-pre-line">
              {content.highlightTitle}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {content.highlightDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Reference Section (좌: 텍스트 / 우: 영상) */}
      <section className="w-full bg-white py-24 px-6 flex-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* 좌측 텍스트 */}
          <div className="flex-1 text-left">
            <h3 className="text-[#09afdf] font-bold text-lg mb-2">Reference</h3>
            <h2 className="text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight whitespace-pre-line">
              {content.refTitle}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line mb-8">
              {content.refDesc}
            </p>
            <a href={content.refLink} target="_blank" className="text-[#09afdf] font-bold text-lg hover:underline inline-flex items-center gap-2">
              레퍼런스 바로가기 ↗
            </a>
          </div>

          {/* 우측 영상 */}
          <div className="flex-1 w-full">
             <div 
              className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => playVideo(content.refVideoId)}
             >
               {content.refVideoId ? (
                 <>
                   <img src={`https://img.youtube.com/vi/${content.refVideoId}/maxresdefault.jpg`} alt="Reference" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-red-600 transition-all scale-100 group-hover:scale-110">
                        <span className="text-white text-3xl ml-1">▶</span>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500">영상 준비중</div>
               )}
             </div>
          </div>
        </div>
      </section>

      {/* 5. Tech Specs */}
      <section className={`w-full bg-[#f5f5f7] pt-24 px-6 flex-none ${optionProducts.length > 0 ? 'pb-12' : 'pb-48 min-h-[700px]'}`}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-12">포함 내역 (Included Items)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {techSpecs.map((spec, idx) => (
              <div key={idx} className="border-t border-gray-300 pt-4">
                <h4 className="font-bold text-[#1d1d1f] mb-3">{spec.title}</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  {spec.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Add-ons Section */}
      {optionProducts.length > 0 && (
        <section className="w-full bg-[#f5f5f7] py-24 px-6 border-t border-gray-200 pb-64">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[#1d1d1f] mb-4">
                추가 옵션 선택 <span className="text-gray-400 text-lg font-normal uppercase tracking-wider">(Add-ons)</span>
              </h3>
              <p className="text-gray-500">더 높은 성과를 위해 필요한 옵션을 추가해보세요.</p>
            </div>
            {/* 옵션 리스트 (기존 동일) */}
            <div className="grid grid-cols-1 gap-4">
              {optionProducts.map(opt => (
                <div 
                  key={opt.id} 
                  className={`flex items-center justify-between w-full bg-white p-6 rounded-2xl border transition-all cursor-pointer ${selectedOptionIds.includes(opt.id) ? 'border-primary shadow-md ring-1 ring-primary' : 'border-gray-200 hover:border-gray-400'}`}
                  onClick={() => toggleOption(opt.id)}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOptionIds.includes(opt.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                      {selectedOptionIds.includes(opt.id) && <span className="text-white text-sm">✓</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">{opt.name}</span>
                      <span className="text-gray-500 text-sm mt-1">{opt.subhead ? opt.subhead.split('\n')[0] : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-lg font-bold ${selectedOptionIds.includes(opt.id) ? 'text-primary' : 'text-gray-400'}`}>
                      + ₩{opt.price.toLocaleString()}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); openOptionDetail(opt.id); }} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-white border border-gray-200 flex items-center justify-center transition-all z-10">?</button>
                    <button onClick={(e) => { e.stopPropagation(); toggleOption(opt.id); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 z-10 ${selectedOptionIds.includes(opt.id) ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                      {selectedOptionIds.includes(opt.id) ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Sticky Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-6 z-40 safe-area-pb">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1d1d1f]">₩ {product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400">기본가 (VAT 별도)</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 block mb-1">총 예상 견적</span>
              <span className="text-3xl font-bold text-[#1d1d1f]">₩ {totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleAddToCart} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30 active:scale-95 whitespace-nowrap">
              장바구니 담기
            </button>
          </div>
        </div>
      </div>

      <Portal>
        {/* Video Modal */}
        {showVideo && currentVideoId && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
            <button className="absolute top-4 right-4 text-white text-xl font-bold p-2">✕ 닫기</button>
          </div>
        )}
        
        {/* Option Detail Modal */}
        {optionDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOptionDetail(null)}>
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up p-0 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setOptionDetail(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all font-bold text-xl shadow-sm">✕</button>
              <div className="w-full h-auto bg-gray-100 relative aspect-video">
                 <img src={optionDetail.referenceImage || optionDetail.heroImage || "https://via.placeholder.com/800x450?text=No+Image"} alt={optionDetail.name} className="w-full h-full object-cover"/>
              </div>
              <div className="p-8 flex justify-center">
                <button onClick={() => { toggleOption(optionDetail.id); setOptionDetail(null); }} className={`px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95 ${selectedOptionIds.includes(optionDetail.id) ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                  {selectedOptionIds.includes(optionDetail.id) ? '이미 선택됨' : '이 옵션 추가하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Portal>
    </div>
  );
}