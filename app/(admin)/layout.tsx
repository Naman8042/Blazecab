import AdminNav from "@/app/_components/Adminnav";
import Session from "./Session";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Session>
      <div className="mt-16">
        <AdminNav />
        {children}
      </div>
    </Session>
  );
};

export default layout;
