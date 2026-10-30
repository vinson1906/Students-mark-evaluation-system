"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { getTopStudents, getTopTeams } from "./leaderboard.service"

export default function LeaderBar() {

    const [selected, setSelected] = useState<string>("individual")

    const { data: topStudents, isLoading: studentsLoading } = getTopStudents()
    const { data: topTeams, isLoading: teamsLoading } = getTopTeams()


    console.log("students and teams:", topStudents, topTeams);



    interface individual {
        id: string
        rank: number
        student_name: string
        total_marks: string
    }

    interface team {
        id: string
        rank: number
        team_name: string
        team_avg: string
    }

    interface TopBarData {
        individual: individual[]
        team: team[]
    }

    const data: TopBarData = {
        individual: topStudents ?? [
            {
                id: "112",
                rank: 1,
                student_name: "vinson",
                total_marks: "98"
            },
            {
                rank: 2,
                id: "113",
                student_name: "syed",
                total_marks: "95"
            },
            {
                id: "114",
                rank: 3,
                student_name: "shiranjeevi",
                total_marks: "90"
            },
            {
                id: "115",
                rank: 4,
                student_name: "suresh",
                total_marks: "88"
            },
            {
                id: "116",
                rank: 5,
                student_name: "jayanth",
                total_marks: "85"
            }
        ],
        team: topTeams ?? [
            {
                id: "6ae17e74ebdc4b75a714d709",
                rank: 1,
                team_name: "Team Minato",
                team_avg: "98"
            },
            {
                id: "T112",
                rank: 2,
                team_name: "Team Kakashi",
                team_avg: "95"
            },
            {
                id: "T113",
                rank: 3,
                team_name: "Team Guy",
                team_avg: "90"
            },
            {
                id: "T114",
                rank: 4,
                team_name: "Team Aasuma",
                team_avg: "88"
            },
            {
                id: "T115",
                rank: 5,
                team_name: "Team Kuranai",
                team_avg: "85"
            }
        ]
    }



    return (
        <div className=' mt-20 '>
            <h1 className='w-full max-w-[500px] pb-2 text-4xl font-bold text-white'>Rankings that treat every team fairly</h1>
            <p className='w-full max-w-[600px] text-[#9EAED4] text-sm'>Students are ranked by percentage of evaluated marks. Teams are ranked by the average of their members’ percentages, so a bigger team has no advantage.</p>

            <div className='flex items-center gap-4 bg-[#181C45] w-[160px] mt-6 p-[4px] rounded-md'>
                {
                    Object.keys(data).map((ele: any, i) => (
                        <div key={i} className=''>
                            <button onClick={() => setSelected(ele)} className={`p-2  cursor-pointer ${selected == ele ? 'bg-[#8B85FF] rounded-md text-white' : 'text-gray-400 hover:text-white'}`} >{ele}</button>
                        </div>
                    ))
                }
            </div>

            <div className='mt-10 mb-10 flex gap-40 items-center'>
                <div className='left max-w-[50%]'>
                    <div className='flex gap-2 items-end justify-center '>
                        <div className='h-[130px] w-[100px] bg-[#C5C8DE] rounded-t-xl flex flex-col pt-2 items-center'>
                            <p className='font-bold text-2xl '>2</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? data.individual[1].student_name : data.team[1].team_name}</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? Math.round(Number(data.individual[1].total_marks)) : Math.round(Number(data.team[1].team_avg))}%</p>
                        </div>
                        <div className='h-[180px] w-[100px] bg-[#FFC141] rounded-t-xl flex flex-col pt-2 items-center'>
                            <p className='font-bold text-2xl '>1</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? data.individual[0].student_name : data.team[0].team_name}</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? Math.round(Number(data.individual[0].total_marks)) : Math.round(Number(data.team[0].team_avg))}%</p>
                        </div>
                        <div className='h-[90px] w-[100px] bg-[#DA9F6F] rounded-t-xl flex flex-col pt-2 items-center'>
                            <p className='font-bold text-2xl '>3</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? data.individual[2].student_name : data.team[2].team_name}</p>
                            <p className='text-sm text-gray-700'>{selected == "individual" ? Math.round(Number(data.individual[2].total_marks)) : Math.round(Number(data.team[2].team_avg))}%</p>
                        </div>

                    </div>
                    <p className='text-[#9EAED4] mt-2 text-sm'>Sample preview only. Real rankings come from your evaluated marks.</p>
                </div>
                <div className='right'>
                    <div className=' bg-[#181C45]  w-[500px] rounded-md'>
                        <div className='flex w-full justify-around p-2 border-b border-b-gray-700 text-[#9EAED4]'>
                            <p>Rank</p>
                            <p>{selected == "individual" ? "Student" : "Team"}</p>
                            <p>{selected == "individual" ? "Score" : "Avg%"}</p>
                        </div>
                        <div className='flex flex-col'>
                            {
                                data[selected]?.map((ele: any, i: number) => (
                                    <Link href={`/${selected == "individual" ? "student" : "team"}/${ele.id}`} key={i} className='flex justify-center w-full'>
                                        <div className='flex justify-evenly p-2 w-full pl-16 gap-16 hover:bg-[#282B5F] cursor-pointer text-white font-medium'>
                                            <p className='w-24'>{ele.rank}</p>
                                            <p className='w-34'>{selected == "individual" ? ele.student_name : ele.team_name}</p>
                                            <p className='w-24'>{selected == "individual" ? Math.round(ele.total_marks) : Math.round(ele.team_avg)}%</p>
                                        </div>

                                    </Link>

                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
