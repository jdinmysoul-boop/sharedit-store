import { motion } from 'framer-motion';

export default function CategoryNav({ activeTab, onTabChange }) {
  // 현재 카테고리 목록
  const categories = [
    "전체",
    "eDM",
    "배너",
    "웨비나",
    "영상 콘텐츠",
    "텍스트 콘텐츠",
    "설문조사",
    "세미나",
    "컨퍼런스",
    "앰배서더"
  ];

  // 카테고리 개수에 따라 폰트 크기와 간격을 자동으로 조절
  const getDynamicStyle = (count) => {
    if (count > 12) return { fontSize: 'text-sm', gap: 'gap-2' };
    if (count > 10) return { fontSize: 'text-base', gap: 'gap-3' };
    if (count > 8)  return { fontSize: 'text-lg', gap: 'gap-4' };
    return { fontSize: 'text-xl', gap: 'gap-6' };
  };

  const { fontSize, gap } = getDynamicStyle(categories.length);

  return (
    <nav className="sticky top-[60px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <ul className={`flex w-full items-center justify-between ${gap} py-4 overflow-x-auto no-scrollbar`}>
          {categories.map((category) => {
            const isActive = activeTab === category;
            
            return (
              <li key={category} className="shrink-0">
                <button
                  onClick={() => onTabChange(category)}
                  className={`
                    relative px-4 py-2 rounded-full transition-all duration-300 font-bold whitespace-nowrap
                    ${fontSize}
                    ${isActive 
                      ? 'bg-black text-white shadow-lg scale-105' 
                      : 'text-gray-400 hover:text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {category}
                  
                  {/* 🗑️ 여기에 있던 하얀 점 코드를 삭제했습니다. */}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}