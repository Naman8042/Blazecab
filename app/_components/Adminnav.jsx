import Logo from "@/assets/photo_2025-10-13_20-42-02.png";
import Link from "next/link";
import Image from "next/image";

const Adminnav = () => {
  return (
    <div className="flex sm:justify-center bg-white sm:pl-20">
      <div className="px-4 sm:px-6 lg:px-6 py-1 sm:py-2  mx-auto fixed top-0 w-full bg-white">
      {" "}
      <Link href="/" className="flex items-center">
        <Image
          src={Logo}
          alt="BlazeCab Logo"
          className="w-[110px] sm:w-28 md:w-40 h-auto"
        />
      </Link>
    </div>
    </div>
  );
};

export default Adminnav;
