import Navbar from '@/app/_components/Navbar'
import Footer from "@/app/_components/Footer";
import Providers from './providers';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
       <Providers> 
        <Navbar/>
        {children}
        <Footer/>
        </Providers>
    </div>
  )
}

export default layout