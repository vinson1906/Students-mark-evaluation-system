import Image from 'next/image'
import React from 'react'
import Logo from "@/public/asset/logo.png"
import Link from 'next/link'

function Navbar() {
    return (
        // <div>
        <div className="bg-[#0A0C24]  w-full h-[80px] flex items-center justify-center sticky top-0 z-50 shadow-md">
            <div className="flex p-2 w-[60%] justify-between items-center">
                <div className="logo flex items-center gap-2">
                    <Link href={`/`} className=" overflow-hidden w-[80px] h-[80px] flex items-center justify-center ">
                        <Image src={Logo} alt="Logo" width={80} height={200} className="object-contain invert brightness-0 h-[50px] " />
                    </Link>
                    <p className="text-white font-bold text-lg">Nandha Engineering College</p>
                </div>
                <div className="nav-links text-gray-400 flex gap-4 font-sans items-center ">
                    <p className="hover:text-white cursor-pointer">Who it’s for</p>
                    <p className="hover:text-white cursor-pointer"> Leaderboard</p>
                    <p className="hover:text-white cursor-pointer">Get started</p>
                </div>
                <div className="login-btn hover:pb-2">
                    <button className="bg-[#FFB627] text-black font-sans font-bold text-sm h-11 flex items-center justify-center cursor-pointer hover:bg-amber-700 w-22 rounded-md p-2">Log in</button>
                </div>
            </div>
        </div>
        // </div>

    )
}

export default Navbar
