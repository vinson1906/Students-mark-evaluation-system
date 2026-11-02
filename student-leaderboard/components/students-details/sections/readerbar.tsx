"use client"
import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';





function Readerbar({ ReaderData }: any) {

    return (
        <div className='w-full h-full '>
            <RadarChart
                style={{ width: '100%', height: '100%', maxWidth: '680px', maxHeight: '80vh', aspectRatio: 1, cursor: 'pointer', outline: 'none', border: 'none', fill: "#393C8A", outlineColor: 'transparent' }}
                className='w-full h-full focus:outline-none'
                responsive
                data={ReaderData}
            >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Mike" dataKey="A" />
            </RadarChart>

        </div>
    )
}

export default Readerbar
