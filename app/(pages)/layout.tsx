import Navbar from '@/app/_components/Navbar'
import Footer from "@/app/_components/Footer";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
        <Navbar/>
        {children}
        <Footer/>
    </div>
  )
}

export default layout