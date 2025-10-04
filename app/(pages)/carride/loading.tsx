import Image from 'next/image'; 
import CarLoader from '@/assets/carloader.gif'

const Loading = () => {
  return (
    <div
      role="status"
      className="h-screen sm:h-[56vh] w-full flex items-center justify-center bg-white"
    >
    <Image src={CarLoader} width={500} height={500} alt='Car Loader'/>
    </div>
  );
};

export default Loading;
