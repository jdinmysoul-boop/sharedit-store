// pages/_app.js
import '../styles/globals.css'; // 여기가 핵심! 우리가 만든 CSS를 불러옵니다.

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}