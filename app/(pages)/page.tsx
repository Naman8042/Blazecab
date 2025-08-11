import Testimonials from '@/app/_components/Testimonials'
import CarRentalSearch from '@/app/_components/CarRentalSearch';
import FeatureSection from '@/app/_components/Featuresection'
import Howitworks from '@/app/_components/Howitworks'

export default function Home() {
  return (
    <div className='flex flex-col gap-14 sm:gap-24'>
       <CarRentalSearch/>
       <FeatureSection/>
       <Howitworks/>
      <Testimonials/>
    </div>
  );
}
