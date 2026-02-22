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

export default function WebinarTemplate({ product }) {
  const [showVideo, setShowVideo] = useState(false);
  const [selectedOptionIds, setSelectedOptionIds] = useState([product.id]);
  const [optionDetail, setOptionDetail] = useState(null);

  const addItem = useCartStore((state) => state.addItem);
  
  // 1. 카테고리 및 타입 정의
  const isText = product.category === "텍스트 콘텐츠";
  const isSeminar = product.category === "세미나";
  const isConference = product.category === "컨퍼런스";
  const isOfflineEvent = isSeminar || isConference;

  // -------------------------------------------------------
  // 유튜브 Video ID 설정 로직
  // -------------------------------------------------------
  let videoId = '';
  let startTime = 0;

  if (isSeminar) {
    videoId = 'cE4or19pDe4'; // 세미나 영상
    startTime = 0;
  } else if (isConference) {
    videoId = 'g2khbD9pV5k'; // 컨퍼런스 영상
    startTime = 0;
  } else if (product.name.includes("촬영")) {
    videoId = 'C6KZIs-lG7I'; 
    startTime = 0; 
  } else if (product.name.includes("송출")) {
    videoId = 'BCwDTujzG6M';
    startTime = 615;
  } else if (product.youtubeLink) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = product.youtubeLink.match(regExp);
    videoId = (match && match[2].length === 11) ? match[2] : '';
  } else {
    videoId = '561QfjpRxzE'; // 기본 웨비나
    startTime = 0;
  }

  // 옵션 데이터 로드
  const optionProducts = product.options
    ? product.options.map(optId => productsData.find(p => p.id === optId)).filter(Boolean)
    : [];

  // 총 견적 계산
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

  const openSeminarReference = (type) => {
    if (type === 'venue') {
      setOptionDetail({
        id: 'ref-venue',
        name: "프리미엄 세미나 공간 & 서비스",
        headline: "전면 LED와 케이터링으로\n완성되는 품격.",
        subhead: "강남 인근의 접근성 좋은 전문 공간에서 귀사의 브랜드를 빛내보세요.",
        category: "Reference",
        heroImage: "https://via.placeholder.com/800x450/333333/ffffff?text=Seminar+Venue",
        detailImages: [],
        isReferenceOnly: true
      });
    } else if (type === 'online') {
      openOptionDetail('S-2');
    }
  };

  const getLabel = () => {
    if (isText) return 'Premium Content';
    if (isSeminar) return 'Offline Seminar';
    if (isConference) return 'Tech Conference';
    if (product.name.includes("촬영")) return 'Professional Production';
    if (product.name.includes("송출")) return 'Live Broadcasting';
    return 'Webinar Package';
  };

  const getIcon = () => {
    if (isText) return '📄';
    if (isConference) return '🚀';
    if (isSeminar) return '🎤';
    return '📹';
  };

  const getRefContent = () => {
    if (product.name.includes("촬영")) {
      return {
        leftLabel: "촬영 편집본 예시",
        leftImg: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/webinar_shooting_reference.png",
        rightLabel: "촬영 영상 다시보기"
      };
    }
    if (product.name.includes("송출")) {
      return {
        leftLabel: "송출 화면 예시",
        leftImg: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/webinar_broadcasting_reference.png",
        rightLabel: "송출 영상 다시보기"
      };
    }
    if (isSeminar) {
      return {
        leftLabel: "세미나 사진",
        leftImg: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/seminar_reference_1.png", 
        rightLabel: "세미나 송출 영상 다시보기"
      };
    }
    if (isConference) {
      return {
        leftLabel: "컨퍼런스 사진",
        leftImg: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/conference_reference.png", 
        rightLabel: "컨퍼런스 하이라이트 영상 다시보기"
      };
    }
    return {
      leftLabel: "eDM & 썸네일",
      leftImg: "https://sharedit.speedgabia.com/shareditad/2026/detailpage/webinar_package_reference.png",
      rightLabel: "웨비나 다시보기"
    };
  };

  // 상단 헤더 서브 문구 분리
  const getSubhead = () => {
    if (isSeminar) return "온라인이 줄 수 없는 깊은 유대감.\n쉐어드IT가 귀사의 기술과 고객을 오프라인 현장에서 직접 연결해 드립니다.";
    if (isConference) return "압도적인 스케일로 증명하는 기술 리더십.\n대규모 청중과 호흡하는 컨퍼런스를 완벽하게 기획하고 운영합니다.";
    return product.subhead;
  };

  // 하단 포함 내역(Tech Specs) 데이터 분리
  const getTechSpecs = () => {
    if (isText) {
      return [
        { title: "기획 (Planning)", items: ["주제 및 키워드 선정", "타겟 오디언스 분석", "인터뷰 진행 (필요시)"] },
        { title: "제작 (Writing)", items: ["전문 테크 라이터 배정", "초안 작성 및 수정", "이미지/도표 편집"] },
        { title: "검토 (Reviewing)", items: ["초안 공유", "광고주 담당자 검토", "최종 수정(횟수 제한 없음)"] },
        { title: "배포 (Distribution)", items: ["쉐어드IT 메인 노출", "뉴스레터 발송", "SNS 채널 공유"] }
      ];
    }
    if (isSeminar) {
      return [
        { title: "장소, F&B", items: ["전문 세미나 공간 대관 4시간", "대형 LED 스크린", "케이터링 (핑거푸드 또는 식사 대용)"] },
        { title: "제작물", items: ["초대장 제작", "행사 배너/현수막/네임택", "참석자 기념품 (1만원 상당)"] },
        { title: "세션 구성", items: ["광고주 발표 세션", "MC와 함께하는 Q&A 세션", "쉬는시간 또는 네트워킹 선택"] },
        { title: "현장 운영", items: ["현장 관리 스텝 x2", "등록 데스크 운영", "세미나 시간 최대 3시간"] }
      ];
    }
    if (isConference) {
      return [
        { title: "장소, F&B", items: ["4성급, 5성급 호텔 컨퍼런스룸", "쾌적한 부스 운영 공간", "커피 & 다과 + 식사"] },
        { title: "시스템", items: ["대형 LED 스크린", "전문 음향/영상/조명 시스템", "전 세션 촬영을 위한 4K 캠코더"] },
        { title: "현장 운영", items: ["광고주 가이드 기반 디자인", "초대장/현수막/배너/네임택", "참석자 기념품"] },
        { title: "현장 운영", items: ["현장 관리 스텝 x4", "AV 시스템 운영 감독, 카메라 감독", "경품 추첨 시스템 (명함 필요 없음)"] }
      ];
    }
    if (product.name.includes("촬영")) {
      return [
        { title: "촬영 (Shooting)", items: ["쉐어드IT 스튜디오", "55인치 4K TV", "다중 화면 동시 녹화(카메라 + 발표자료)"] },
        { title: "편집 (Editing)", items: ["풀영상 컷 편집", "말자막(옵션)", "자료 및 데모시연 화면 합성"] },
        { title: "장비 (Equipment)", items: ["4K 카메라: Sony A7R x3", "무선 마이크: Sony UWP-D27", "조명: Godox SL100Bi x2"] },
        { title: "결과물 (Output)", items: ["편집본(MP4) 제공", "클린본 제공 가능", "하이라이트 숏폼(옵션)"] }
      ];
    }
    if (product.name.includes("송출")) {
      return [
        { title: "송출 (Streaming)", items: ["송출 장비: ATEM Mini Extreme ISO", "송출 소프트웨어: OBS", "실시간 모니터링"] },
        { title: "플랫폼 (Platform)", items: ["Youtube 스트리밍 활용", "자체 웨비나 플랫폼으로 송출", "채팅창, 질문창 이원화 운영"] },
        { title: "현장 (On-site)", items: ["전문 엔지니어 1인 상주", "사전 리허설 진행", "돌발 상황 대처"] },
        { title: "결과물 (Report)", items: ["송출 원본 녹화 파일", "참석자 리스트, 설문 결과", "질문 & 답변 내역"] }
      ];
    }
    // 기본 웨비나 패키지
    return [
      { title: "제작 (Production)", items: ["전용 스튜디오 대관", "전문 MC 진행", "1.5h 촬영 / 1h 편집", "풀자막 제공"] },
      { title: "홍보 (Promotion)", items: ["eDM 제작 및 발송", "회원 대상 홍보", "뉴스레터 노출"] },
      { title: "운영 (Operation)", items: ["웨비나 플랫폼 송출", "참석자 기프티콘(50명+5명)", "실시간 Q&A 관리"] },
      { title: "데이터 (Data)", items: ["등록/참석자 리스트", "질문/설문 리포트", "편집 영상 파일 제공"] }
    ];
  };

  const refData = getRefContent();
  const techSpecs = getTechSpecs();

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex flex-col w-full">
      
      {/* 1. Hero Section */}
      <section className="w-full bg-white pt-32 pb-20 px-6 flex-none">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="mb-8 inline-block p-4 rounded-3xl bg-gray-50">
            <span className="text-5xl">{getIcon()}</span>
          </div>
          <h2 className="text-[#bf4800] font-bold tracking-widest text-sm mb-4 uppercase">
            {getLabel()}
          </h2>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight whitespace-pre-line bg-clip-text text-transparent bg-gradient-text">
            {isOfflineEvent ? (isConference ? "혁신을 경험하는 거대한 무대,\nTech Conference." : "화면 너머,\n고객과 눈을 맞추는 진짜 경험.") : product.headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto whitespace-pre-line">
            {getSubhead()}
          </p>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="w-full bg-[#f5f5f7] py-24 px-6 flex-none">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          {isText ? (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                글은 영상보다 더 깊고, 오래 남습니다.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>모든 고객이 영상을 끝까지 시청할 수는 없습니다. 하지만 잘 쓰인 칼럼 하나는 검색 결과에 영원히 남아, <br />진지하게 정보를 찾는 <strong className="text-primary">진성 고객</strong>을 끊임없이 데려옵니다.</p>
                <p>어려운 기술 용어를 쉽게 풀어내고, 업계의 통찰을 담아 귀사를 해당 분야의 리더로 포지셔닝 해드립니다.</p>
              </div>
            </>
          ) : isSeminar ? (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                눈을 맞추고 나누는 대화, 그 강력한 힘.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>디지털 마케팅 시대에도 오프라인 행사가 사라지지 않는 이유가 있습니다. 현장의 뜨거운 열기, 발표자와의 직접적인 소통, <br />그리고 쉬는 시간에 이루어지는 자연스러운 네트워킹.</p>
                <p>단순히 정보를 전달하는 것을 넘어, <strong className="text-primary">강력한 팬덤을 구축하고 즉각적인 영업 기회</strong>를 포착하세요. <br />최적의 장소부터 수준 높은 케이터링까지, 품격 있는 행사를 약속합니다.</p>
              </div>
            </>
          ) : isConference ? (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                빠르게 변화하는 트렌드 속에서<br />귀사의 존재감을 보여줄 차례입니다.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>수백 명의 함께하는 컨퍼런스는 단순한 이벤트를 넘어, 브랜드의 방향성과 메시지를 효과적으로 전달하는 중요한 자리입니다.</p>
                <p><strong className="text-primary">쾌적한 등록 시스템부터 부스 운영, 그리고 빈틈없는 현장 관리까지. </strong><br /> 쉐어드IT의 컨퍼런스는 체계적이고 안정적인 운영으로 행사의 완성도를 높이고, 귀사의 브랜드 가치를 더욱 분명하게 전달합니다.</p>
              </div>
            </>
          ) : product.name.includes("촬영") ? (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                가장 완벽한 영상으로<br />브랜드를 기록하세요.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p><>발표자의 목소리, 현장의 분위기, 그리고 중요한 자료 화면까지.<br/></><strong className="text-primary">전문 촬영 감독과 방송급 장비</strong>가 투입되어 귀사의 소중한 순간을 놓치지 않고 담아드립니다.</p>
                <p>단순 녹화가 아닙니다. <br></br>매끄러운 컷 편집, 발표 세션과 데모 세션 맞춤 화면, 전문 용어도 놓치지 않는 전체 풀자막이 더해져 시청자의 몰입감을 높입니다.</p>
              </div>
            </>
          ) : product.name.includes("송출") ? (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                끊김 없는 연결, 그 이상의 가치
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>웨비나 도중 영상이 끊기거나 소리가 들리지 않는 방송 사고는 브랜드 신뢰도에 치명적입니다.<br></br>하지만 생방송 중에 사고는 늘 발생할 수 있죠. 관건은 얼마나 빨리 대응할 수 있는가 입니다.<br></br><br></br>쉐어드IT 스튜디오에서는 현장 경험이 풍부한 <strong className="text-primary"> 방송 송출 전문 인력</strong>이 어떠한 돌발 상황에도 빠르게 대처합니다.<br></br>복잡한 기술 문제는 저희에게 맡기시고, 콘텐츠 전달에만 집중하세요.</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 leading-snug">
                성공적인 웨비나는<br />단순히 영상을 송출하는 것이 아닙니다.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p><>청중을 모으고, 몰입을 이끌어내고, 확실한 데이터로 결과를 증명해야 합니다.<br/></>쉐어드IT 전용 스튜디오에서의 고품질 촬영부터, 전문 MC의 매끄러운 진행, 그리고 안정적인 송출과 참석자 선물까지.</p>
                <p><strong className="text-primary"> 복잡한 준비 과정은 잊으세요. </strong>귀사의 솔루션이 가장 빛나는 1시간을 위해 모든 것을 준비해 두었습니다.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. Reference Section */}
      <section className="w-full bg-white py-24 px-6 flex-none">
        <div className="max-w-6xl mx-auto">
          {!isText && (
            <h3 className="text-2xl font-bold text-[#1d1d1f] mb-10">
              실제 진행 사례 (Reference)
            </h3>
          )}
          
          <div className={!isText ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-24"}>
            {isText ? (
              // 텍스트 콘텐츠 레이아웃 (지그재그)
              <>
                <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                   <div className="flex-1 text-left">
                      <span className="text-[#09afdf] font-bold text-xl mb-2 block">Event Review</span>
                      <h3 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 leading-tight">
                        묻혀 두기엔 아까운 세션,<br/>핵심만 요약해 드립니다.
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-8 break-keep">
                        열심히 준비해서 진행한 오프라인 컨퍼런스와 세미나, 온라인 웨비나의 세션을 이대로 묻혀 두기엔 너무 아깝습니다.<br/>
                        행사에 참석하지 않은 사람들에게도 세션 내용을 알려야 하지 않을까요?<br/><br/>
                        쉐어드IT는 세션의 중요한 내용들에 쉐어드IT만의 생각을 더해 다시 정리해서 콘텐츠로 배포합니다.
                        세션 내용이 온라인 공간에서 계속 살아 숨쉬게 만들어 잠재고객을 발굴해 보세요.
                      </p>
                   </div>
                   <div className="flex-1 w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-lg relative">
                      <img src="https://sharedit.speedgabia.com/shareditad/2026/detailpage/text_reference_1.png" alt="Event Review" className="w-full h-full object-cover"/>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-12 w-full">
                   <div className="flex-1 text-left md:text-right">
                      <span className="text-[#09afdf] font-bold text-xl mb-2 block">Solution Deep Dive</span>
                      <h3 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 leading-tight">
                        어려운 기술 용어는 빼고,<br/>고객의 언어로 설득합니다.
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-8 break-keep">
                        어려운 전문용어로 가득한 솔루션 소개서, 고객들이 잘 이해할 수 있을까요?<br/>
                        솔루션 소개자료의 내용에 쉐어드IT만의 생각을 더해 알기 쉽게 정리해 보세요.<br/><br/>
                        우리 회사 솔루션이 어떤 특징을 가지고 있는지, 고객들에게 어떠한 이점을 제공해 줄 수 있는지를
                        심도 있게, 하지만 이해하기 쉬운 콘텐츠로 만듭니다.
                      </p>
                      <a href="https://sharedit.co.kr/posts?post_type_id=5" target="_blank" className="text-[#09afdf] font-bold text-lg hover:underline inline-flex items-center gap-2 justify-end">
                        레퍼런스 바로가기 ↗
                      </a>
                   </div>
                   <div className="flex-1 w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-lg relative">
                      <img src="https://sharedit.speedgabia.com/shareditad/2026/detailpage/text_reference_2.png" alt="Solution Deep Dive" className="w-full h-full object-cover"/>
                   </div>
                </div>
              </>
            ) : (
              // 영상/세미나/컨퍼런스 공통 레이아웃 (좌: 이미지, 우: 영상)
              <>
                <div className="relative aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                   <img src={refData.leftImg} alt={refData.leftLabel} className="w-full h-full object-cover"/>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                   <p className="absolute bottom-0 left-0 right-0 text-center font-bold text-white bg-black/50 py-4 backdrop-blur-sm">
                     {refData.leftLabel}
                   </p>
                </div>

                {videoId && (
                  <div className="group relative aspect-video bg-black rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all" onClick={() => setShowVideo(true)}>
                    <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* 👇 여기가 수정된 부분입니다: 빨간색 효과 적용 (bg-red-600) */}
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-red-600 transition-all scale-100 group-hover:scale-110">
                        <span className="text-white text-3xl ml-1">▶</span>
                      </div>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 text-center font-bold text-white bg-black/50 py-4 backdrop-blur-sm">
                      {refData.rightLabel}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. Tech Specs */}
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

      {/* 5. Add-ons Section */}
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
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        openOptionDetail(opt.id); 
                      }} 
                      className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-white border border-gray-200 flex items-center justify-center transition-all z-10"
                      title="상세 보기"
                    >
                      ?
                    </button>

                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleOption(opt.id); 
                      }} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 z-10 ${
                        selectedOptionIds.includes(opt.id) 
                          ? 'bg-gray-200 text-gray-400' 
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                      title={selectedOptionIds.includes(opt.id) ? "선택 해제" : "추가하기"}
                    >
                      {selectedOptionIds.includes(opt.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Sticky Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-6 z-40 safe-area-pb">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-gray-500">
                {isConference ? "별도 문의" : `₩ ${product.price.toLocaleString()}`}
              </span>
              {!isConference && <span className="text-xs text-gray-400">기본가 (VAT 별도)</span>}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 block mb-1">총 예상 견적</span>
              <span className="text-3xl font-bold text-[#1d1d1f]">
                {isConference ? "별도 문의" : `₩ ${totalPrice.toLocaleString()}`}
              </span>
            </div>
            <button onClick={handleAddToCart} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30 active:scale-95 whitespace-nowrap">
              장바구니 담기
            </button>
          </div>
        </div>
      </div>

      <Portal>
        {/* Video Modal (수정됨: !isOfflineEvent 제거 -> 모든 영상에 모달 적용) */}
        {!isText && showVideo && videoId && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}`} title="YouTube video player" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
            <button className="absolute top-4 right-4 text-white text-xl font-bold p-2">✕ 닫기</button>
          </div>
        )}
        
        {/* Option Detail Modal */}
        {optionDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOptionDetail(null)}>
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up p-0 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setOptionDetail(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all font-bold text-xl shadow-sm">✕</button>
              
              {/* 이미지 영역 */}
              <div className="w-full h-auto bg-gray-100 relative aspect-video">
                 <img 
                   src={optionDetail.referenceImage || optionDetail.heroImage || "https://via.placeholder.com/800x450?text=No+Image"} 
                   alt={optionDetail.name} 
                   className="w-full h-full object-cover"
                 />
              </div>

              {/* 하단 버튼 영역 */}
              <div className="p-8 flex justify-center">
                {optionDetail.isReferenceOnly ? (
                  <button onClick={() => setOptionDetail(null)} className="px-10 py-4 rounded-full font-bold bg-[#1d1d1f] text-white hover:bg-black transition-all shadow-lg active:scale-95">확인</button>
                ) : (
                  <button 
                    onClick={() => { toggleOption(optionDetail.id); setOptionDetail(null); }} 
                    className={`px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95
                      ${selectedOptionIds.includes(optionDetail.id) 
                        ? 'bg-gray-200 text-gray-500 cursor-default' 
                        : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                  >
                    {selectedOptionIds.includes(optionDetail.id) ? '이미 선택됨' : '이 옵션 추가하기'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Portal>
    </div>
  );
}