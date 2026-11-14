import Image from 'next/image'
import React from 'react'
import LOGO from '@/public/asset/nandha_college_logo_white.png'
import Link from 'next/link'
import { LockKeyhole, User } from 'lucide-react'


function LoginPage() {
    return (
        <div className='bg-[#0A0C24] h-[280px] w-[380px] rounded-xl flex flex-col gap-4'>
            <div className='flex flex-col justify-center items-center mt-5' >
                <Image src={LOGO} alt='login logo image' height={70} width={70} />
                <h1 className='font-semibold text-xl tracking-wide  text-white'>Wellcome Back</h1>
                <p className='text-gray-300 text-xs'>Don't have an account yet? <Link href={`/auth/sign-up`} className='font-medium text-white'>Sign up</Link></p>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center px-2 bg-white mx-4 rounded-md '>
                    <User />
                    <input type="text" className='h-[36px] w-full outline-none rounded-md  bg-white p-2' placeholder='Enter your Reg.no' />
                </div>
                <div className='flex items-center px-2 bg-white mx-4 rounded-md'>
                    <LockKeyhole />
                    <input type="password" className='h-[36px] w-full outline-none rounded-md  bg-white p-2' placeholder='Enter your Password' />
                </div>

                <button className='h-[30px] text-white font-semibold rounded-md cursor-pointer bg-blue-600 mx-4'>Login</button>
            </div>

        </div>
    )
}

export default LoginPage
