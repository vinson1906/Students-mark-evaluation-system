import { Cpu, Trophy } from 'lucide-react';
import React from 'react'

function StudentTopBar({ student }: any) {

    const nameCaps = student?.student_name?.split(" ")
    console.log(nameCaps[0][0]);

    const teams_count = 12


    return (
        <div className='w-full rounded-4xl h-[30vh] my-10 bg-[#21265F] overflow-hidden'>
            <div className='flex items-center h-full px-20 justify-between relative  overflow-hidden '>
                <div className='flex items-center gap-4 '>
                    <div className='profile-pic h-[110px] w-[110px] rounded-2xl  border border-2 border-yellow-500 flex justify-center items-center' >
                        <h1 className='text-4xl font-bold text-white'>{nameCaps[0][0]}{nameCaps[1][0]}</h1>
                    </div>
                    <div className='std-details flex flex-col items-start h-[110px] gap-2'>
                        <h1 className='text-4xl font-sans text-white font-bold'>{student?.student_name}.</h1>
                        <div className='flex text-[#C5C8DE] gap-2  '>
                            <p>Reg.no: {student?.reg_no} </p><span className='flex items-center font-bold'>.</span>
                            <p>{student?.department_code}</p> <span className='flex items-center font-bold'>.</span>
                            <p>Section {student?.section} </p><span className='flex items-center font-bold'>.</span>
                            <p>Year {student?.year} </p><span className='flex items-center font-bold'>.</span>
                            <p>Semester {student?.semester} </p>
                        </div>
                        <div className='flex text-[#C5C8DE] gap-2'>
                            <p className='h-[30px] bg-amber-400 py-[2px] text-black font-medium rounded-xl flex items-center text-sm gap-[4px] px-[12px]'><Trophy size={15} />Rank {student?.rank} of {teams_count}</p>
                            <p className='h-[30px] bg-[#3B3E6A] py-[2px]  font-medium rounded-xl flex items-center text-sm gap-[4px] px-[12px]'>{student?.team_perfomence?.team_name} . {student?.team_perfomence?.team_code}</p>
                            <p className='h-[30px] bg-[#1FB5A3] py-[2px] text-black font-medium rounded-xl flex items-center text-sm gap-[4px] px-[12px]'>Grade {student?.grade}</p>
                        </div>
                    </div>
                </div>

                <div className='marks  h-[150px] w-[190px] flex flex-col items-center justify-center gap-2 overflow-hidden relative'>
                   
                    <h1 className='font-bold text-[#FFC141] text-6xl z-10'>{Math.round(student?.total_avg)}%</h1>
                    <p className='text-[#C5C8DE] z-10'>{Math.round(student?.total_avg)} / 100 total marks</p>
                </div>
                 <div className='w-[400px] h-[400px] absolute top-0 bg-[#393C8A] rounded-full right-[-80px] top-[-100px]'></div>
                 <div className='w-[200px] h-[200px] absolute top-0 bg-[#233F70] rounded-full right-[280px] top-[190px]'></div>
            </div>

        </div>
    )
}

export default StudentTopBar
