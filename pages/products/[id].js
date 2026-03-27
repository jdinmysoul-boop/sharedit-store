import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import productsData from '../../data/products.json';

// 템플릿 컴포넌트들
import WebinarTemplate from '../../components/templates/WebinarTemplate';
import VideoTemplate from '../../components/templates/VideoTemplate';
import EdmTemplate from '../../components/templates/EdmTemplate';
import BannerTemplate from '../../components/templates/BannerTemplate';
import AmbassadorTemplate from '../../components/templates/AmbassadorTemplate'; // 👈 [추가됨]

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = productsData.find((p) => p.id === id);

  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  // ---------------------------------------------------------
  // 카테고리별 템플릿 연결 로직
  // ---------------------------------------------------------
  let TemplateComponent;

  if (product.category === '배너') {
    TemplateComponent = BannerTemplate;
  } else if (product.category === '앰배서더') {
    TemplateComponent = AmbassadorTemplate; // 👈 [추가됨] 앰배서더 연결
  } else if (product.category === '설문조사' || product.category === 'eDM') {
    TemplateComponent = EdmTemplate;
  } else if (
    product.category === '영상 콘텐츠' || 
    product.name.includes('수다') || 
    product.name.includes('살롱') || 
    product.name.includes('리뷰')
  ) {
    TemplateComponent = VideoTemplate;
  } else {
    TemplateComponent = WebinarTemplate;
  }

  return (
    <Layout>
      <Head>
        <title>{product.name} | Shared IT</title>
        <meta name="description" content={product.headline} />
      </Head>
      <TemplateComponent product={product} />
    </Layout>
  );
}