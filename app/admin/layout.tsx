// import AdminNav from "@/app/_components/Adminnav";
import Session from "./Session";
import Adminsidebar from '@/app/_components/Adminsidebar'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Session>
      <div className="">
        {/* <AdminNav /> */}
        {/* <div className="flex flex-col sm:flex-row justify-between"> */}
          <Adminsidebar/>
          <main className="flex-1 sm:ml-64 mt-16 sm:mt-0 min-h-screen">
     {children}
  </main>
        {/* </div> */}
      </div>
    </Session>
  );
};

export default layout;
