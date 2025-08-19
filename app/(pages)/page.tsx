import Testimonials from '@/app/_components/Testimonials'
import CarRentalSearch from '@/app/_components/CarRentalSearch';
import FeatureSection from '@/app/_components/Featuresection'
// import Howitworks from '@/app/_components/Howitworks'
import Service from '../_components/Service'
import FAQ from '@/app/_components/FAQ'

export default function Home() {
  return (
    <div className='flex flex-col gap-14 sm:space-y-24 mb-24'>
       <CarRentalSearch/>
       <FeatureSection/>
       {/* <Howitworks/> */}
       <Service/>
       <FAQ/>
      <Testimonials/>
    </div>
  );
}
