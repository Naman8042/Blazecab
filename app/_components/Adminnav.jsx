import Logo from "@/assets/blazecab_logo.webp";
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
          className=" w-32 h-12 sm:w-32 md:h-[55px] md:w-[160px]"
        />
      </Link>
    </div>
    </div>
  );
};

export default Adminnav;
