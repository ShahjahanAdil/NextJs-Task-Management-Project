"use client"
import React, { useEffect, useState } from 'react'
import '../dashboard.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'
import TableLoader from '@/components/TableLoader/page'

export default function PendingTasks() {

    const { user } = useAuthContext()
    const [pendingTasks, setPendingTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFetchData = () => {
        setLoading(true)
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/pending-tasks/?userID=${user?.userID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setPendingTasks(data?.pendingTs)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (user.userID) {
            handleFetchData()
        }
    }, [user])

    return (
        <>
            <DashboardHeader />
            <div className="dashboard-container">
                <div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
                    <div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
                        <h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
                            <span className='text-[22px]'><AiOutlineDashboard /></span> Dashboard
                            <span className='text-[20px] text-[#666]'>/ Pending Tasks</span>
                        </h2>
                    </div>

                    <div className="table-div flex flex-col mt-10 border px-5 rounded-[5px]">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">#</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Title</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Joined ON</th>
                                                <th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Points</th>
                                                <th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Price</th>
                                                <th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading ?
                                                    <TableLoader />
                                                    :
                                                    (
                                                        pendingTasks?.length > 0 ?
                                                            (
                                                                pendingTasks.map((task, i) => {
                                                                    const { taskID, taskTitle, createdAt, taskPoints, taskPrice } = task
                                                                    const date = createdAt.slice(0, 10)
                                                                    const time = createdAt.slice(11, 16)
                                                                    const datetime = date + " " + time
                                                                    return (
                                                                        <tr key={taskID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
                                                                            <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{i + 1}</span></td>
                                                                            <td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span>{taskTitle}</span></td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{datetime}</span></td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>{taskPoints}</span></td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>${taskPrice}</span></td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]">
                                                                                <Link href={`/dashboard/your-tasks/${taskID}`} className='font-bold text-[#0093E9] flex gap-1 justify-end items-center transition-all duration-200 hover:text-[#6c5ce7]'>See details <FaArrowRight /></Link>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            )
                                                            :
                                                            <tr>
                                                                <td colSpan="9" className='px-3 py-5 text-center'>
                                                                    <p className='text-[#ef4444]'>There are no pending tasks!</p>
                                                                </td>
                                                            </tr>
                                                    )
                                            }
                                            {/* <tr className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
                                                <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>1</span></td>
                                                <td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span>Web Development</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>10/01/2025</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>30</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>$100</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]">
                                                    <Link href={`/dashboard/your-tasks/123`} className='font-bold text-[#0093E9] flex gap-1 justify-end items-center transition-all duration-200 hover:text-[#6c5ce7]'>See details <FaArrowRight /></Link>
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}