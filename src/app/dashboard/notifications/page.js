"use client"
import React, { useEffect, useState } from 'react'
import '../dashboard.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'
import TableLoader from '@/components/TableLoader/page'

export default function Notifications() {

    const { user } = useAuthContext()
    const [notifications, setNotifications] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [clearLoading, setClearLoading] = useState(false)

    useEffect(() => {
        if (user.userID) {
            fetchNotifications(page)
        }
    }, [user, page])

    const fetchNotifications = (page) => {
        setLoading(true)
        axios.get(`${process.env.API_LINK}/api/dashboard/notifications?userID=${user?.userID}&page${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setNotifications(data?.userNotifications || [])
                    setTotalPages(Math.ceil(data?.totalNotifications / 15))
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleClearNotifications = () => {
        setClearLoading(true)
        axios.delete(`${process.env.API_LINK}/api/dashboard/notifications/clear-all?userID=${user?.userID}`)
            .then(res => {
                const { status, data } = res
                if (status === 203) {
                    setNotifications([])
                    alert(data.message)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert("Something went wrong. Please try again!")
            })
            .finally(() => {
                setClearLoading(false)
            })
    }

    const renderPageNumbers = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`px-3 py-1 rounded-[5px] ${page === i ? 'bg-[#6c5ce7] text-white' : 'bg-[#e8e8e8] text-[#666]'}`}
                    onClick={() => setPage(i)}
                >
                    {i}
                </button>
            )
        }
        return pages
    }

    return (
        <>
            <DashboardHeader />
            <div className="dashboard-container">
                <div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
                    <div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
                        <h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
                            <span className='text-[22px]'><AiOutlineDashboard /></span> Dashboard
                            <span className='text-[20px] text-[#666]'>/ Notifications</span>
                        </h2>
                    </div>

                    <div className='flex justify-end mt-10'>
                        <button className='text-[#ef4444] flex gap-2 items-center hover:bg-transparent hover:text-red-400' onClick={handleClearNotifications}>
                            {
                                !clearLoading ?
                                    <>
                                        Clear All <FiTrash2 />
                                    </>
                                    :
                                    "Clearing..."
                            }
                        </button>
                    </div>
                    <div className="table-div flex flex-col mt-5 border px-5 rounded-[5px]">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">#</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Notification</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Received at</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading ?
                                                    <TableLoader />
                                                    :
                                                    (
                                                        notifications.length > 0 ?
                                                            notifications.map((notification, i) => {
                                                                const { content, createdAt } = notification
                                                                const date = createdAt?.slice(0, 10)
                                                                const time = createdAt?.slice(11, 16)
                                                                const datetime = date + " " + time
                                                                return (
                                                                    <tr key={i} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{i + 1}</span></td>
                                                                        <td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span>{content}</span></td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{datetime}</span></td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="9" className='px-3 py-5 text-center'>
                                                                    <p>No notifcations received yet!</p>
                                                                </td>
                                                            </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        !loading &&
                        (
                            totalPages > 1 &&
                            <div className='flex flex-wrap my-5 items-center justify-center gap-1'>
                                {renderPageNumbers()}
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}