import React from 'react'

function TeamMembers() {
    return (
        <div className=''>
            <h1 className='text-2xl font-bold text-white'>Team Members</h1>
            <div className='flex flex-col '>
                <div className='header  border-b border-b-gray-600 '>
                    <div className='flex gap-4 items-center '>
                        <p className='text-[#C5C8DE] w-[60px]'>Rank</p>
                        <p className='text-[#C5C8DE] w-[360px]'>Member</p>
                        <p className='text-[#C5C8DE] w-[150px]'>Internal/100</p>
                        <p className='text-[#C5C8DE] w-[150px]'>Lab/100</p>
                        <p className='text-[#C5C8DE] w-[150px]'>Viva/100</p>
                        <p className='text-[#C5C8DE] w-[150px]'>Project/100</p>
                        <p className='text-[#C5C8DE] w-[150px]'>Total</p>
                    </div>

                </div>
                <div className='td'>

                </div>

            </div>
        </div>
    )
}

export default TeamMembers
