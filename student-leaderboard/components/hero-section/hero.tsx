"use client"
import React, { useState } from 'react'

function Hero() {
    const [progress, setProgress] = useState({
        internal: "72",
        record: "75",
        viva: "94",
        project: "89"
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setProgress((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const calculation = () => {
        const total: number = Object.values(progress ?? {}).reduce((sum, a) => sum + Number(a), 0)
        let sum = Math.round(Number(total) / 400 * 100)

        return sum
    }

    const percentage = calculation() ?? 78

    let color;

    const Grade = () => {
        if (percentage >= 90) {
            color = "#4DB917"
            return "Grade A"
        }
        else if (80 < percentage && percentage < 90) {
            color = "#22C55E"
            return "Grade B+"
        }
        else if (80 >= percentage && percentage >= 70) {
            color = "#0D9488"
            return "Grade B"
        }
        else if (70 > percentage && percentage >= 60) {
            color = "#3B82F6"
            return "Grade C"
        }
        else if (60 > percentage && percentage >= 50) {
            color = "#A855F7"
            return "Grade D"
        }
        else if (50 > percentage && percentage >= 45) {
            color = "#F59E0B"
            return "Grade E"
        }
        else {
            color = "#EF4444"
            return "Fail"
        }
    }

    let result = Grade() ?? "Pass"

    return (
        <div className='bg-[#0A0C24] flex justify-center'>
            <div className=" w-[60%]  h-[50vh] pt-10 flex gap-2">
                <div className=' flex justify-center  gap-4 h-full'>
                    <div className='w-[60%]  ' >
                        <h1 className='text-6xl text-white font-extrabold pb-4 text-inherit'>Every mark, evaluated. Every rank, earned.</h1>
                        <p className='text-md font-sans text-[#9EAED4]'>MarkSheet gathers lab, exam and project marks in one place, so students see where they stand and faculty spend less time on spreadsheets.</p>
                        <div className='flex gap-2 mt-4'>
                            <button className='h-10 w-[200px] rounded-md bg-[#FFB627] text-md font-medium cursor-pointer'>Log in to your dashboard</button>
                            <button className='h-10 w-[200px] border-2 border-gray-100 text-gray-100 rounded-md cursor-pointer'> See the leaderboard</button>
                        </div>
                    </div>
                    <div className='w-[40%] bg-[#181C45] h-[330px] rounded-xl shadow-md p-4'>
                        <div>
                            <h1 className='text-white font-bold text-lg'>Try the marks calculator</h1>
                            <p className='text-gray-400 text-xs'>Drag the sliders to see your percentage and grade.</p>
                        </div>
                        <div className='flex gap-4 h-35 items-center'>
                            <div className=''>

                                <div
                                    className="relative w-28 h-28 rounded-full flex items-center justify-center "
                                    style={{
                                        background: `conic-gradient(
                                                        from 0deg,
                                                    ${color} ${percentage * 3.6}deg,
                                                    ${color} ${percentage * 3.6}deg
                                                    )`,
                                    }}
                                >
                                    <div className="absolute inset-[10px] rounded-full bg-[#151B4B] flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                                <h1 className='text-3xl font-bold  pb-[1px]' style={
                                    { color: color }
                                }>{result}</h1>
                                <p className='text-gray-400 text-md pl-[3px]'>{calculation()} / 100 marks</p>
                            </div>
                        </div>
                        <div className='text-gray-300 text-md flex flex-col gap-2'>
                            <div className='flex gap-2 items-center '>
                                <p className='w-20'>Internal</p>
                                <input type="range" className='bg-black accent-[#8B85FF] cursor-pointer w-48' name='internal' max={100} min={0} value={progress.internal || 0} onChange={handleChange} />
                                <p className='text-sm font-bold font-sans'>{progress.internal} / 100</p>
                            </div>
                            <div className='flex gap-2 items-center '>
                                <p className='w-20'>Lab record</p>
                                <input type="range" name='record' className='bg-black accent-[#8B85FF] w-48 cursor-pointer' min={0} max={100} value={progress.record || 0} onChange={handleChange} />
                                <p className='text-sm font-bold font-sans'>{progress.record} / 100</p>
                            </div>
                            <div className='flex gap-2 items-center '>
                                <p className='w-20'>Viva</p>
                                <input type="range" className='bg-black accent-[#8B85FF] w-48 cursor-pointer' min={0} max={100} name='viva' value={progress.viva || 0} onChange={handleChange} />
                                <p className='text-sm font-bold font-sans'>{progress.viva} / 100</p>
                            </div>
                            <div className='flex gap-2 items-center '>
                                <p className='w-20'>Project</p>
                                <input type="range" className='bg-black accent-[#8B85FF] w-48 cursor-pointer' name='project' min={0} max={100} value={progress.project || 0} onChange={handleChange} />
                                <p className='text-sm font-bold font-sans'>{progress.project} / 100</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Hero
