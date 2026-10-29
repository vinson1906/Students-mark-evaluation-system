import TeamDetails from '@/components/team/teamDetails'
import { TeamMockData } from '@/components/team/teamMock'
import React from 'react'


function TeamDetailsPage() {
    return (
        <div className=' '>
            {/* <h1 className='text-white'>Deatails page</h1> */}
            <TeamDetails data={TeamMockData} />
        </div>
    )
}

export default TeamDetailsPage
