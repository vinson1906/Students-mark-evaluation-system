import React from 'react'
import TopSection from './top-section'
import LeaderBar from './leader-bar'

export default function Leaderboard() {
    return (
        <div className='h-[100vh] bg-[#0E1130] flex justify-center'>
            <div className='w-[60%] '>

                <TopSection />
                <LeaderBar />

            </div>
        </div>
    )
}
