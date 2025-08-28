import AdminNav from "@/app/_components/Adminnav";
import Session from "./Session";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Session>
      <div>
        <AdminNav />
        {children}
      </div>
    </Session>
  );
};

export default layout;
