"use client"
import Link from 'next/link'
import React from 'react'

function FooterPallet() {
    return (
        <div className='bg-transparent flex justify-center items-center pb-[10px]'>
            <p className='text-sm text-[#C5C8DE] italic'>Design & developed by <Link href={`https://vinson-portfolio-plum.vercel.app/`} className='underline' target='_blank'>Vinson</Link></p>
        </div>
    )
}

export default FooterPallet
