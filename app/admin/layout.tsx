import AdminNav from "@/app/_components/Adminnav";
import Session from "./Session";
import Adminsidebar from '@/app/_components/Adminsidebar'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Session>
      <div className="mt-12">
        <AdminNav />
        <div className="flex flex-col sm:flex-row sm:ml-80 justify-between">
          <Adminsidebar/>
          {children}
        </div>
      </div>
    </Session>
  );
};

export default layout;
