import { FolderOpen, Podium, Trophy, Users, Wine } from 'lucide-react'
import React from 'react'

function KpiCards({ cardsData }: any) {

    const total_ranks = 12

    const colorPicker = (color: string) => {
        if (color.toLowerCase() == "pending") return "text-yellow-500"
        if (color.toLowerCase() == "completed") return "text-green-600"
        if (color.toLowerCase() == "not completed") return "text-red-600"

        return "text-black"
    }

    return (
        <div className='flex justify-evenly gap-4 pb-20'>
            <div className='w-[350px] h-[120px] bg-white shadow-md rounded-2xl flex gap-4 items-center px-4' >
                <div className='bg-[#E3F6F1] w-[80px] h-[80px] rounded-md flex justify-center items-center'>
                    <Podium className='text-green-600 text-xl font-bold' />
                </div>
                <div>
                    <p className='text-3xl font-bold '>
                        {Math.round(Number(cardsData?.total_avg))} / 100
                    </p>
                    <p className='text-sm text-gray-500'>Overall marks</p>
                </div>
            </div>
            <div className='w-[350px] h-[120px] bg-white shadow-md rounded-2xl flex gap-4 items-center px-4' >
                <div className='bg-[#f5f1cf] w-[80px] h-[80px] rounded-md flex justify-center items-center'>
                    <Trophy className='text-yellow-600 text-xl font-bold' />
                </div>
                <div>
                    <p className='text-3xl font-bold '>
                        #{cardsData?.rank} of {total_ranks}
                    </p>
                    <p className='text-sm text-gray-500'>Individual rank</p>
                </div>
            </div>
            <div className='w-[350px] h-[120px] bg-white shadow-md rounded-2xl flex gap-4 items-center px-4' >
                <div className='bg-[#e1d4f5] w-[80px] h-[80px] rounded-md flex justify-center items-center'>
                    <Users className='text-violet-600 text-xl font-bold' />
                </div>
                <div>
                    <p className='text-3xl font-bold '>
                        {cardsData?.team_perfomence?.team_members?.length} of 4
                    </p>
                    <p className='text-sm text-gray-500'>Members evaluvated</p>
                </div>
            </div>
            <div className='w-[350px] h-[120px] bg-white shadow-md rounded-2xl flex gap-4 items-center px-4' >
                <div className='bg-[#e1d4f5] w-[80px] h-[80px] rounded-md flex justify-center items-center'>
                    <FolderOpen className='text-violet-600 text-xl font-bold' />
                </div>
                <div>
                    <p className={`text-3xl font-bold ${colorPicker(cardsData?.project?.project_status)}`} >
                        {cardsData?.project?.project_status}
                    </p>
                    <p className='text-sm text-gray-500'>Project status</p>
                </div>
            </div>

        </div>
    )
}

export default KpiCards
