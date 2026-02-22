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

export default function EdmTemplate({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  
  const isSurvey = product.category === "설문조사";
  
  const [selectedOptionIds, setSelectedOptionIds] = useState([product.id]);
  const [optionDetail, setOptionDetail] = useState(null);

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
    toggleDrawer(true);
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

  const renderStory = () => {
    if (isSurvey) {
      return (
        <div className="flex-1 space-y-6">
          <h3 className="text-3xl font-bold text-[#1d1d1f]">
            질문의 깊이에 따라<br/>인사이트가 달라집니다
          </h3>
          <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
            <p>
              설문조사의 목적은 단순히 숫자를 채우는 것이 아닌, 우리 제품을 구매할 잠재 고객을 찾아내는 것입니다.
            </p>
            <p>
              경품만 노리는 체리피커는 걸러내고, IT 예산을 집행하는 <strong className="text-primary">현업 담당자의 <br /> 생생한 목소리</strong>를 확인해 보세요.
            </p>
            <p>
              단순 응답 수집을 넘어, 영업 기회로 연결되는 고품질 리드를 보장합니다.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 space-y-6">
        <h3 className="text-3xl font-bold text-[#1d1d1f]">
          숫자의 함정에<br/>빠지지 마세요.
        </h3>
        <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
          <p>
            타 매체보다 전체 모수는 적을 수 있습니다. 하지만 허수는 없습니다. <br />
            쉐어드IT의 1.8만 명은 단순 관심자가 아닌, 현업에서 IT를 고민하는 <strong className="text-primary">100% 실무자</strong>입니다.
          </p>
          <p>
            정교한 타겟팅 기술은 필요 없습니다. <br />이곳에 모인 모두가 당신의 타겟이기 때문입니다.
          </p>
        </div>
      </div>
    );
  };

  const renderGraph = () => {
    if (isSurvey) {
      return (
        <div className="flex-1 w-full bg-white rounded-3xl p-8 shadow-sm">
          <h4 className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-wider">Valid Lead Comparison</h4>
          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2"><span>일반 IT 미디어</span><span>유효 리드: 50% ↓</span></div>
            <div className="h-12 w-full bg-gray-100 rounded-xl overflow-hidden relative flex">
              <div className="h-full bg-gray-400 w-1/2 flex items-center justify-center text-white font-bold tracking-wider text-xs">체리피커/허수 다수</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold text-primary mb-2"><span>쉐어드IT 설문</span><span>유효 리드: 80% ↑</span></div>
            <div className="h-12 w-full bg-primary/10 rounded-xl overflow-hidden relative">
              <div className="h-full bg-primary w-[80%] flex items-center justify-center text-white font-bold tracking-wider text-xs">IT 담당자 위주</div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 w-full bg-white rounded-3xl p-8 shadow-sm">
        <h4 className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-wider">Target Purity Comparison</h4>
        <div className="mb-6">
          <div className="flex justify-between text-sm font-bold text-gray-500 mb-2"><span>타 매체</span><span>Target: 15%</span></div>
          <div className="h-12 w-full bg-gray-100 rounded-xl overflow-hidden relative flex">
            <div className="h-full bg-gray-400 w-[15%] flex items-center justify-center text-white text-xs text-[10px]">Target</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-bold text-primary mb-2"><span>Shared IT</span><span>Target: 100%</span></div>
          <div className="h-12 w-full bg-primary/10 rounded-xl overflow-hidden relative">
            <div className="h-full bg-primary w-full flex items-center justify-center text-white font-bold tracking-wider animate-pulse text-xs">100% TARGET</div>
          </div>
        </div>
      </div>
    );
  };

  let statsData = [];
  if (isSurvey) {
    statsData = [
      { label: "보장 리드", value: "100건", sub: "기본 계약 기준" },
      { label: "타겟 대상", value: "IT 담당자", sub: "인프라 운영 및 의사 결정권자" },
      { label: "제공 데이터", value: "응답자 개인정보", sub: "이메일/연락처 포함" },
      { label: "설문 기간", value: "종료 익일 리포트", sub: "빠른 결과 제공" },
    ];
  } else {
    statsData = [
      { label: "발송 대상", value: "18,000명", sub: "IT 담당자/실무자" },
      { label: "평균 오픈율", value: "15% ~ 20%", sub: "업계 평균 상회" },
      { label: "평균 클릭률", value: "1.5% ~ 2.0%", sub: "고관여 유저 타겟" },
      { label: "제공 사항", value: "결과 리포트", sub: "클릭/오픈 상세 분석" },
    ];
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-8 inline-block p-4 rounded-3xl bg-gray-50">
          <span className="text-5xl">{isSurvey ? '📝' : '✉️'}</span>
        </div>
        <h2 className="text-[#bf4800] font-bold tracking-widest text-sm mb-4 uppercase">{product.category}</h2>
        <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight whitespace-pre-line bg-clip-text text-transparent bg-gradient-text">
          {product.headline}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto whitespace-pre-line">
          {product.subhead}
        </p>
      </section>

      <section className="bg-[#f5f5f7] py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {renderStory()}
          {renderGraph()}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-2xl font-bold text-[#1d1d1f] mb-12">예상 성과 (Performance)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100 hover:border-primary/30 transition-colors">
              <p className="text-gray-500 text-sm font-bold mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mb-2 break-keep">{stat.value}</p>
              <p className="text-sm text-gray-400 break-keep">{stat.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-gray-400 text-xs font-medium">
          {isSurvey 
            ? "* 설문조사 응답자가 100명을 넘을 경우 전체 응답자 중 100명을 선택할 수 있습니다." 
            : "* 위 지표는 평균 수치이며, 콘텐츠 제목 및 내용에 따라 실제 결과는 달라질 수 있습니다."}
        </p>
      </section>

      <section className="py-20 px-6 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f]">
            {isSurvey ? '설문조사 예시 (Reference)' : 'eDM 예시 (Reference)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(num => (
              <div key={num} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-[3/4] relative group">
                <img 
                  src={isSurvey ? `https://sharedit.speedgabia.com/shareditad/2026/detailpage/survey_reference_${num}.png` : `https://sharedit.speedgabia.com/shareditad/2026/detailpage/eDM_reference_${num}.png`}
                  alt={`Reference ${num}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <p className="absolute bottom-0 left-0 right-0 text-center font-bold text-white bg-black/40 py-4 backdrop-blur-sm">
                  {isSurvey ? `설문조사 #${num}` : `eDM #${num}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isSurvey && (
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#1d1d1f] mb-4">100건 달성할 때까지, 멈추지 않습니다.</h3>
            <p className="text-lg text-gray-600">쉐어드IT가 보유한 <strong className="text-primary">모든 홍보 채널을 총동원</strong>하여 목표를 달성해 드립니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">📧</div>
              <h4 className="text-xl font-bold text-[#1d1d1f] mb-2">타겟 eDM 발송</h4>
              <p className="text-gray-500 text-sm text-balance">1.8만 명의 검증된 IT 회원에게 설문 참여 독려 메일을 발송합니다.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">🔗</div>
              <h4 className="text-xl font-bold text-[#1d1d1f] mb-2">LinkedIn 홍보</h4>
              <p className="text-gray-500 text-sm text-balance">쉐어드IT 공식 LinkedIn에 설문을 게시해서 참여를 유도합니다.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">📰</div>
              <h4 className="text-xl font-bold text-[#1d1d1f] mb-2">뉴스레터 노출</h4>
              <p className="text-gray-500 text-sm text-balance">매주 금요일 발송되는 주간 뉴스레터에 설문 이벤트를 상단 고정합니다.</p>
            </div>
          </div>
        </section>
      )}

      {optionProducts.length > 0 && (
        <section className="w-full bg-[#f5f5f7] py-24 px-6 border-t border-gray-200 pb-64">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[#1d1d1f] mb-4">
                추가 옵션 선택 <span className="text-gray-400 text-lg font-normal uppercase tracking-wider">(Add-ons)</span>
              </h3>
              <p className="text-gray-500">더 높은 성과를 위해 필요한 옵션을 추가해보세요.</p>
            </div>

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
                    <button 
                      onClick={(e) => { e.stopPropagation(); openOptionDetail(opt.id); }} 
                      className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-white border border-gray-200 flex items-center justify-center transition-all z-10"
                    >?</button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleOption(opt.id); }} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 z-10 ${selectedOptionIds.includes(opt.id) ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white hover:bg-primary-dark'}`}
                    >
                      {selectedOptionIds.includes(opt.id) ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-6 z-40 safe-area-pb">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-gray-500">₩ {product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400">기본가 (VAT 별도)</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 block mb-1">총 예상 견적</span>
              <span className="text-3xl font-bold text-[#1d1d1f]">₩ {totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleAddToCart} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 whitespace-nowrap">
              장바구니 담기
            </button>
          </div>
        </div>
      </div>

      <Portal>
        {optionDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOptionDetail(null)}>
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <button onClick={() => setOptionDetail(null)} className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all font-bold text-xl shadow-sm">✕</button>
              <div className="w-full bg-gray-100 flex items-center justify-center p-0">
                 <img src={optionDetail.referenceImage || optionDetail.heroImage || "https://via.placeholder.com/800x450?text=No+Image"} alt={optionDetail.name} className="w-full h-auto object-contain max-h-[60vh]"/>
              </div>
              <div className="p-8 flex justify-center bg-white sticky bottom-0 z-10 border-t border-gray-100">
                <button 
                  onClick={() => { toggleOption(optionDetail.id); setOptionDetail(null); }} 
                  className={`px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95 ${selectedOptionIds.includes(optionDetail.id) ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}
                >
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