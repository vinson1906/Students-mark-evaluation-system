'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import LOGO from '@/public/asset/nandha_college_logo_white.png'
import Link from 'next/link'
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react'

type LoginData = {
    regNo: string
    password: string
}

function LoginPage() {
    const [formData, setFormData] = useState<LoginData>({
        regNo: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Login data:', formData)
    }

    return (
        <div className='relative w-[380px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A0C24] shadow-2xl shadow-blue-950/50'>
            {/* soft glow behind the logo */}
            <div className='pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl' />

            <div className='relative flex flex-col items-center px-6 pt-8'>
                <div className='flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5'>
                    <Image src={LOGO} alt='Nandha College logo' height={56} width={56} />
                </div>
                <h1 className='mt-4 text-2xl font-semibold tracking-wide text-white'>Welcome back</h1>
                <p className='mt-1 text-sm text-gray-400'>
                    Don&apos;t have an account yet?{' '}
                    <Link
                        href='/auth/sign-up'
                        className='font-medium text-blue-400 transition-colors hover:text-blue-300'
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className='relative flex flex-col gap-4 px-6 pb-8 pt-6'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='regNo' className='text-xs font-medium text-gray-300'>
                        Register number
                    </label>
                    <div className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30'>
                        <User size={18} className='text-gray-400' />
                        <input
                            id='regNo'
                            name='regNo'
                            type='text'
                            value={formData.regNo}
                            onChange={handleChange}
                            autoComplete='off'
                            placeholder='Enter your Reg.no'
                            className='h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500'
                            
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='password' className='text-xs font-medium text-gray-300'>
                        Password
                    </label>
                    <div className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30'>
                        <LockKeyhole size={18} className='text-gray-400' />
                        <input
                            id='password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete='new-password'
                            placeholder='Enter your password'
                            className='h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className='cursor-pointer text-gray-400 transition-colors hover:text-white'
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type='submit'
                    className='mt-2 h-11 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage