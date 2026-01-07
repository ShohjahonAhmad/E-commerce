import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { SellerCTA } from '@/components/home/SellerCTA';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <SellerCTA />
    </Layout>
  );
};

export default Index;
