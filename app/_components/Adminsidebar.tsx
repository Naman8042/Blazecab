"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu,Book } from "lucide-react";


 const Sidebar = () => {
  const router = useRouter()  
  const { data: session, status } = useSession(); // <-- GET THE 'status'


  // 1. Handle the loading state
  if (status === "loading") {
    return (
      <div className="">
      </div>
    );
  }

  // 2. Handle the unauthenticated state
  if (status === "unauthenticated") {
    toast.error("Please log in to view this page.");
    router.push("/login");
    return null; // Return null while redirecting
  }

  // 3. Handle authenticated but not admin
  // This check now only runs *after* we know the status is "authenticated"
  if (status === "authenticated" && !session.user.isAdmin) {
    toast.error("You are not authorized to view this page.");
    router.push("/"); // Redirect to homepage or another safe page
    return null;
  }

  // 4. If we get here, status is "authenticated" AND user is admin
  //    (We also need this check in case session is somehow still null)
  if (!session) {
    // Failsafe, should be covered by status checks
    router.push("/login");
    return null;
  }


  return (
    <>
    <div className="sm:w-80 h-full bg-[#6aa4e0] text-white p-4 hidden sm:block overflow-y-auto fixed left-0 ">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-8">
        <button
          onClick={() => router.push("/admin/routes")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Menu size={20} /> Routes
        </button>
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Book size={20} /> Bookings
        </button>
        <button
          onClick={() => router.push("/admin/cars")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Menu size={20} /> Cars
        </button>
      </nav>
    </div>
    <header className="sm:hidden bg-[#6aa4e0] text-white p-4 flex justify-between items-center w-full">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <nav className="space-x-4">
          <button
            onClick={() => router.push("/admin/bookings")}
          >
            Bookings
          </button>
          <button
            onClick={() => router.push("/admin/routes")}
          >
            Routes
          </button>
          <button
            onClick={() => router.push("/admin/cars")}
          >
            Cars
          </button>
        </nav>
      </header>
      </>
  );
};

export default Sidebar

 

// const Content = ({ active }: { active: string }) => {
//   const [routeType, setRouteType] = useState<
//     "oneway" | "roundtrip" | "localtrip"
//   >("oneway");

//   return (
//     <div className=" w-full">
//       {/* {active === "home" && <div>Welcome to the Admin Dashboard</div>} */}
//       {active === "routes" && (
//         <div className="p-4 h-full ">
//           <Tabs
//             defaultValue="oneway"
//             className=" w-full flex   items-center sm:items-start"
//             onValueChange={(val) =>
//               setRouteType(val as "oneway" | "roundtrip" | "localtrip")
//             }
//           >
//             <TabsList className="mb-4">
//               <TabsTrigger value="oneway">One Way</TabsTrigger>
//               <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
//               <TabsTrigger value="localtrip">Local Trip</TabsTrigger>
//             </TabsList>
//           </Tabs>

//           {routeType === "oneway" && <OnewayRoute />}
//           {routeType === "roundtrip" && <RoundtripRoute />}
//           {routeType === "localtrip" && <LocalRoute />}
//         </div>
//       )}

//       {active === "bookings" && <BookingsView />}
//       {active === "cars" && <CarsView />}
//     </div>
//   );
// };