import { log } from 'console'
import React from 'react'

function TeamPerfomence({ teamPerfomenceData }: any) {


    const lab = 63
    const internal_mark = 70

    const viva = 94
    const project = 86



    return (
        <div className='border-b border-b-gray-600 pb-6'>
            <h1 className='text-2xl font-bold text-white'>Team Perfomence</h1>
            <div className='mt-6 flex flex-col gap-2'>
                <div className='flex gap-5 items-center'>
                    <p className='w-[150px] text-md text-white font-medium'>
                        Internal
                    </p>
                    <div className='status-bar w-[800px] bg-gray-800 h-[7px] rounded-md flex items-center'>
                        <div className={`  bg-amber-300 rounded-md h-full`} style={{
                            width: `${teamPerfomenceData.internal}%`
                        }}>

                        </div>
                    </div>
                    <p className='text-white pl-10'>
                        {teamPerfomenceData.internal}/100
                    </p>
                </div>
                <div className='flex gap-5 items-center'>
                    <p className='w-[150px] text-md text-white font-medium'>
                        Lab Record
                    </p>
                    <div className='status-bar w-[800px] bg-gray-800 h-[7px] rounded-md flex items-center'>
                        <div className={`  bg-amber-300 rounded-md h-full`} style={{
                            width: `${teamPerfomenceData.lab_record}%`
                        }}>

                        </div>
                    </div>
                    <p className='text-white pl-10'>
                        {teamPerfomenceData.lab_record}/100
                    </p>
                </div>
                <div className='flex gap-5 items-center'>
                    <p className='w-[150px] text-md text-white font-medium'>
                        Viva
                    </p>
                    <div className='status-bar w-[800px] bg-gray-800 h-[7px] rounded-md flex items-center'>
                        <div className={`   bg-amber-300 rounded-md h-full`} style={{
                            width: `${teamPerfomenceData.viva}%`
                        }}>

                        </div>
                    </div>
                    <p className='text-white pl-10'>
                        {teamPerfomenceData.viva}/100
                    </p>
                </div>
                <div className='flex gap-5 items-center'>
                    <p className='w-[150px] text-md text-white font-medium'>
                        Project
                    </p>
                    <div className='status-bar w-[800px] bg-gray-800 h-[7px] rounded-md flex items-center'>
                        <div className={`   bg-amber-300 rounded-md h-full`} style={{
                            width: `${teamPerfomenceData.internal}%`
                        }}>

                        </div>
                    </div>
                    <p className='text-white pl-10'>
                        {teamPerfomenceData.project}/100
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TeamPerfomence
