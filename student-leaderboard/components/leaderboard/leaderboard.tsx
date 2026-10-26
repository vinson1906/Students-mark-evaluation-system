import React from 'react'
import TopSection from './top-section'
import LeaderBar from './leader-bar'
import LoginBanner from './login-banner'

export default function Leaderboard() {
    return (
        <div className=' bg-[#0E1130] flex justify-center'>
            <div className='w-[60%] '>

                <TopSection />
                <LeaderBar />
                <LoginBanner />
            </div>
        </div>
    )
}
