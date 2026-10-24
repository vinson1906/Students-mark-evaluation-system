import React from 'react'

export default function LeaderBar() {



    interface individual {
        rank: number
        student_name: string
        score: string
    }

    interface team {
        rank: number
        team_name: string
        avg: string
    }

    interface TopBarData {
        individual: individual[]
        team: team[]
    }

    const data: TopBarData = {
        individual: [
            {
                rank: 1,
                student_name: "vinson",
                score: "98"
            },
            {
                rank: 2,
                student_name: "syed",
                score: "95"
            },
            {
                rank: 3,
                student_name: "shiranjeevi",
                score: "90"
            },
            {
                rank: 4,
                student_name: "suresh",
                score: "88"
            },
            {
                rank: 5,
                student_name: "jayanth",
                score: "85"
            }
        ],
        team: [
            {
                rank: 1,
                team_name: "Team Minato",
                avg: "98"
            },
            {
                rank: 2,
                team_name: "Team Kakashi",
                avg: "95"
            },
            {
                rank: 3,
                team_name: "Team Guy",
                avg: "90"
            },
            {
                rank: 4,
                team_name: "Team Aasuma",
                avg: "88"
            },
            {
                rank: 5,
                team_name: "Team Kuranai",
                avg: "85"
            }
        ]
    }

    return (
        <div className=' mt-20 '>
            <h1 className='w-full max-w-[500px] pb-2 text-4xl font-bold text-white'>Rankings that treat every team fairly</h1>
            <p className='w-full max-w-[600px] text-[#9EAED4] text-sm'>Students are ranked by percentage of evaluated marks. Teams are ranked by the average of their members’ percentages, so a bigger team has no advantage.</p>

            
        </div>
    )
}
