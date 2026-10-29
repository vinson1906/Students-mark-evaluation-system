"use client"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import type { Team } from './teamMock'

function TopSection({ teamData }: any) {
    return (

        <div className=' flex flex-col justify-start h-[40vh] w-full max-w-[60%] '>
            <Link href={`/`} className='flex  items-center h-[40px] cursor-pointer gap-2  text-gray-400 mt-6' >
                <ArrowLeft className='hover:text-white ' size={20} />
                <p className='hover:text-white'>Back to the leaderboard</p>
            </Link>
            <div className='text-white mt-6'>
                <div className='team-details'>
                    <div className='flex justify-between text-[80px] font-bold font-sans'>
                        <h1>{teamData.team_name}</h1>
                        <h1 className='text-yellow-400'>{Math.round(teamData.team_avg)}%</h1>
                    </div>
                    <div className='text-gray-400 flex justify-between text-md mt-2'>
                        <p>{teamData?.section?.department_name} · {teamData?.section?.section_name} · Team number {teamData?.team_no}</p>
                        <p className=''>Team average</p>
                    </div>
                </div>
                <div className="w-full h-[6px] overflow-hidden rounded-full bg-[#303344] my-6">
                    <div
                        className="h-full w-[90%] rounded-full 
                            bg-gradient-to-r
                            from-teal-500
                            via-yellow-400
                            to-amber-500"
                    />
                </div>
                <div className='head flex justify-around text-gray-500'>
                    <div className='border-r border-r-gray-400 w-40'>
                        <p>Rank</p>
                        <p className='text-lg font-bold text-white'>{teamData.team_rank} of 4</p>
                    </div>

                    <div className='border-r border-r-gray-400 w-60'>
                        <p>Members evaluated</p>
                        <p className='text-lg font-bold text-white'>3 of 3</p>
                    </div>
                    <div className='border-r border-r-gray-400 w-40'>
                        <p>Top member</p>
                        <p className='text-lg font-bold text-white'>{teamData?.top_scorer?.name} · {teamData?.top_scorer?.score}%</p>
                    </div>
                    <div>
                        <p>Project</p>
                        <p className='text-lg font-bold text-white'>{teamData?.project?.project_status}</p>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default TopSection
