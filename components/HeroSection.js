import { useState } from 'react';

export default function HeroSection({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!isLoading && query.trim()) {
      onSearch(query); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-[#f5f5f7] pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        {/* 👇 [수정됨] 그라데이션 텍스트 복구 */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#09afdf] to-[#5468ff]">
          IT 마케팅은 쉐어드IT와 함께
        </span>
      </h1>
      <p className="text-xl text-gray-500 mb-10">
        예산과 목적만 알려주시면 AI가 최적의 플랜을 제안합니다. <br></br> 물론, 직접 고르셔도 됩니다.
      </p>

      {/* 검색바 영역 */}
      <div className="relative w-full max-w-3xl">
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input 
          type="text" 
          className="w-full pl-16 pr-20 py-5 rounded-full border border-gray-200 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#09afdf]/50 transition-all disabled:bg-gray-50 disabled:text-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading} 
          placeholder={isLoading ? "AI가 분석 중입니다..." : "예: 예산 500만원으로 콘텐츠 마케팅을 하고 싶은데 뭐가 좋을까?"}
        />
        
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#09afdf] hover:bg-[#089ac2] text-white'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}