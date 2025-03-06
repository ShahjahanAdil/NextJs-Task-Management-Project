import Link from "next/link";
import { IoMdArrowForward } from "react-icons/io";

export default function Unauthorized() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-[24px] font-bold">Access Denied</h1>
            <Link href="/" className='hero-btn flex items-center gap-2 w-fit text-[18px]'>Go to homepage <IoMdArrowForward /></Link>
        </div>
    );
}