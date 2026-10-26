import React from 'react'

function LoginBanner() {
    return (
        <div className='max-w-60% flex justify-center'>
            <div className='h-[300px] w-full rounded-4xl bg-[#0A0C24] m-10 flex flex-col justify-center items-center gap-4' >
                <div className='text-center'>
                    <h1 className='text-[42px] text-white font-bold'>Ready to see your marks?</h1>
                    <p className='text-[#9EAED4]'>Log in with your registration number to open your dashboard.</p>
                </div>
                <div className='text-center '>
                    <button className='h-10 w-20 bg-[#FFB900] font-bold rounded-md cursor-pointer text-center transition-transform duration-200 hover:-translate-y-0.5 hover:bg-amber-600 hover:text-white'>Log in</button>
                </div>

            </div>
        </div>
    )
}

export default LoginBanner
