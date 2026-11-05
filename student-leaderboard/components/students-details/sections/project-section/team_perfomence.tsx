"use client"
import React, { useState } from 'react'
import Link from 'next/link'
function TeamPerfomence({ perfomenceData }: any) {

    const [selectedStudent, setSelectedStudent] = useState(perfomenceData?.team_perfomence?.team_members?.[0]);


    const colors = ['#FFBB28', '#0088FE', '#FF8041', '#8884D8', '#233F70']

    return (
        <div className='w-full flex flex-col gap-4 bg-white max-w-[40%] p-4 my-6 rounded-2xl' >
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-xl text-gray-500 font-medium '>Team Performance</h1>
                <p className=' font-bold text-violet-600 rounded-4xl bg-blue-200 w-30 flex justify-center items-center text-sm px-2 h-8'> Rank {perfomenceData?.team_perfomence?.team_members?.length} of 4 </p>
            </div>
            <div>
                <p className=' font-bold text-4xl '> {parseFloat(perfomenceData?.team_perfomence?.team_avg)}%  </p>
                <p className='text-gray-500 text-sm pl-1'>Team Average : Team {perfomenceData?.team_perfomence?.team_name}</p>
            </div>
            <div className="members flex flex-col ">
                {
                    perfomenceData?.team_perfomence?.team_members?.map((ele: any, i: number) => (
                        <Link href={`/student/${ele.student_id}`} key={i} className='w-full flex justify-between items-center my-2 p-3 rounded-md cursor-pointer' onMouseEnter={() => setSelectedStudent(ele)} style={{ backgroundColor: selectedStudent?.student_id === ele.student_id ? '#E8E7FD' : 'transparent' }} >
                            <div className='flex gap-4 items-center' >
                                <div className='w-10 h-10 rounded-full  flex items-center justify-center outline-3 outline-white' style={
                                    {
                                        backgroundColor: colors[i % colors.length]
                                    }
                                }>
                                    <span className='text-lg font-bold text-white'>{ele.student_name.charAt(0)}</span>
                                </div>
                                <p className='font-medium text-gray-700'>{ele.student_name}</p><span className='text-sm text-gray-500'> {perfomenceData?.student_name == ele.student_name ? ' (You)' : ''}</span>
                            </div>
                            <p className='font-bold text-lg'>{Math.round(ele.total_avg)}%</p>
                        </Link>
                    ))
                }
            </div>
            <Link className='text-blue-500 hover:underline' href={`/team/${perfomenceData?.team_perfomence?.team_id}`}>View Team Details</Link>
        </div>
    )
}

export default TeamPerfomence
