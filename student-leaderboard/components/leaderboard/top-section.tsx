"use client";
import { title } from "process";
import React, { useState } from "react";

export default function TopSection() {
    const [selected, setSelected] = useState<keyof Data>("student");

    interface innnerData {
        title: string;
        desc: string
    }

    interface Data {
        student: innnerData[]
        staff: innnerData[]
        admin: innnerData[]
    }

    const data: Data = {
        student: [
            {
                title: "See your rank",
                desc: "Check where you stand among classmates and in your team.",
            },
            {
                title: "Track every evaluation",
                desc: "Lab, internal and project marks in one view.",
            },
            {
                title: "Private by default",
                desc: "You see only your own marks and your team’s scores.",
            },
        ],
        staff: [
            {
                title: "Enter marks once",
                desc: "Evaluate by section and lab without juggling files.",
            },
            {
                title: "Spot pending work",
                desc: "See which students or teams are not yet evaluated.",
            },
            {
                title: "Review team progress",
                desc: "Open any team to see member scores side by side.",
            },
        ],
        admin: [
            {
                title: "Manage departments",
                desc: "Keep departments, sections and labs organised.",
            },
            {
                title: "Control access",
                desc: "Decide who can view, enter or edit marks.",
            },
            {
                title: "Trust the numbers",
                desc: "Pending records never count towards a ranking.",
            },
        ],
    };

    return (
        <section className="mt-20">
            <h1 className="w-full max-w-[500px] pb-2 text-4xl font-bold text-white">
                One system, three ways to use it
            </h1>

            <p className="text-sm text-[#9EAED4]">
                Choose a role to see what you get after logging in.
            </p>


            <div className="mt-5 flex h-[45px] w-fit gap-1 rounded-md bg-[#181C45] p-1">
                {Object.keys(data).map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setSelected(role)}
                        className={`flex h-full items-center justify-center rounded-md px-3 w-[80px] text-sm capitalize transition-colors cursor-pointer ${selected === role
                            ? "bg-[#8B85FF] text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>


            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data[selected].map((item: any, index: any) => (
                    <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-[#181C45] p-5 transition-colors hover:border-[#8B85FF]/50"
                    >
                        <h2 className="mb-2 font-semibold text-white">
                            {item.title}
                        </h2>

                        <p className="text-sm leading-6 text-[#9EAED4]">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
}