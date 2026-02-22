/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 지정하신 메인 컬러 (밝은 사이언 블루)
        primary: {
          DEFAULT: '#09afdf', 
          light: '#4dcdf5',   // 버튼 호버 시 살짝 밝게
          dark: '#0083cb',    // 클릭 시 살짝 어둡게
        },
        // Apple 스타일 배경색
        background: '#f5f5f7', 
      },
      fontFamily: {
        // Pretendard를 기본 산세리프 폰트로 지정
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        // 헤드라인 그라데이션: #09afdf -> 보라색(#7c3aed)
        'gradient-text': 'linear-gradient(to right, #09afdf, #7c3aed)',
      }
    },
  },
  plugins: [],
}