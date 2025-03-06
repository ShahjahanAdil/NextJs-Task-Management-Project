"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import './header.css'
import { FaArrowRight, FaX } from 'react-icons/fa6';
import { FiLogOut, FiMenu, FiPlusCircle } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/contexts/AuthContext';
import { GrNotification } from 'react-icons/gr';
import { LuDollarSign } from 'react-icons/lu';
import { PiPaperPlaneTilt, PiStack, PiStackDuotone, PiStackOverflowLogo } from 'react-icons/pi';
import axios from 'axios';

export default function AdminHeader() {

    const { user, handleLogout } = useAuthContext()
    const [notifications, setNotifications] = useState([])
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [bellOpen, setBellOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (user.userID) {
            fetchNotifications()
        }
    }, [user])

    const fetchNotifications = () => {
        axios.get(`${process.env.API_LINK}/api/admin/notifications/header-notifications?userID=${user.userID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setNotifications(data?.userLimitedNotifications)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
    }

    useEffect(() => {
        const hasUnread = notifications?.some(notification => notification.status === "unread")
        setHasUnreadNotifications(hasUnread)
    }, [notifications])

    const handleUnread = () => {
        setBellOpen(!bellOpen)

        if (hasUnreadNotifications) {
            const updatedNotifications = notifications.map(notification => {
                if (notification.status === "unread") {
                    return { ...notification, status: "read" }
                }
                return notification
            })

            axios.patch(`${process.env.API_LINK}/api/admin/notifications/mark-as-read`, { userID: user.userID })
                .then(res => {
                    const { status } = res
                    if (status === 202) {
                        setNotifications(updatedNotifications)
                    }
                })
                .catch(err => {
                    console.error('Frontend POST error', err.message)
                })
        }
    }

    return (
        <>
            <header>
                <div className="header bg-white">
                    <div className="h-left flex items-center gap-5">
                        <span className='text-[20px] text-[#666] p-2 rounded-[5px] cursor-pointer hover:text-[#6c5ce7] transition-all ease-out' onClick={() => setIsOpen(!isOpen)}><FiMenu /></span>
                        <h2 className='flex items-center gap-2' onClick={() => router.push('/admin')}><AiOutlineDashboard /> Admin Panel</h2>
                    </div>
                    <div className="h-right">
                        <nav>
                            <ul>
                                <li>
                                    <span className='text-[18px] text-[#666] mt-1 relative inline-block cursor-pointer'><GrNotification onClick={handleUnread} />
                                        {
                                            hasUnreadNotifications &&
                                            <div className='absolute top-[-6px] right-[-2px] bg-red-500 w-[12px] h-[12px] rounded-full border-2 border-white' onClick={handleUnread}></div>
                                        }
                                        <div className={`bell-box absolute top-[150%] right-0 bg-white min-w-[280px] min-h-[50px] cursor-default rounded-[5px] shadow-lg px-3 py-5 z-[100] ${bellOpen ? 'bell-open' : 'bell-close'}`}>
                                            <h3 className='flex items-center gap-2 font-bold text-[18px] text-[#6c5ce7] mb-3'>Notfications:</h3>
                                            <div className='flex flex-col gap-3'>
                                                {
                                                    notifications.length > 0 ?
                                                        notifications?.map((notification, i) => {
                                                            const { content, createdAt } = notification
                                                            const date = createdAt?.slice(0, 10)
                                                            const time = createdAt?.slice(11, 16)
                                                            const datetime = date + " " + time
                                                            return (
                                                                <div key={i} className='bg-[#f3f6ff] p-2 rounded-[5px] shadow-sm'>
                                                                    <p className='whitespace-normal text-[16px] mb-1'>{content}</p>
                                                                    <p className='font-semibold text-[12px] text-[#888] text-end'>{datetime}</p>
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        <p className='text-center text-[#888]'>Empty!</p>
                                                }
                                            </div>
                                            <Link href="/admin/notifications" className='mt-3 h-link flex items-center justify-center gap-2' style={{ fontSize: '16px' }}>See all <FaArrowRight /></Link>
                                        </div>
                                    </span>
                                </li>
                                {/* <li><Link href="/dashboard/profile" className='h-link flex items-center gap-1'><FaUser /> Profile</Link></li> */}
                                <li><button className='bg-red-500 rounded-[50px] text-[18px] text-[#fff] py-[8px] px-[22px] flex items-center gap-1 transition-all duration-200 ease-out hover:bg-red-600' onClick={handleLogout}><FiLogOut /> Logout</button></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            <div className={`side-header ${isOpen ? 'sidebar-open' : 'sidebar-close'}`}>
                <div className="h-top flex justify-between items-center gap-5 px-[25px] py-[20px]">
                    <h2 className='text-[26px] font-bold text-[#6c5ce7] cursor-pointer flex items-center gap-2' onClick={() => router.push('/')}>Parax</h2>
                    <span className='text-[16px] text-[#666] p-2 rounded-[5px] cursor-pointer hover:text-[#ef4444] transition-all ease-out' onClick={() => setIsOpen(!isOpen)}><FaX /></span>
                </div>
                <div>
                    <ul className='flex flex-col justify-center items-center gap-5 mt-8'>
                        <li>
                            <Link href="/admin" className='h-link flex items-center gap-2'><AiOutlineDashboard /> Admin Panel</Link>
                        </li>
                        <li>
                            <Link href="/admin/create-task" className='h-link flex items-center gap-2'><FiPlusCircle /> Create Task</Link>
                        </li>
                        <li>
                            <Link href="/admin/tasks-created" className='h-link flex items-center gap-2'><PiStackDuotone /> Tasks Created</Link>
                        </li>
                        <li>
                            <Link href="/admin/assign-task" className='h-link flex items-center gap-2'><PiPaperPlaneTilt /> Assign Task</Link>
                        </li>
                        <li>
                            <Link href="/admin/tasks-assigned" className='h-link flex items-center gap-2'><PiStack /> Tasks Assigned</Link>
                        </li>
                        <li>
                            <Link href="/admin/submitted-tasks" className='h-link flex items-center gap-2'><PiStackOverflowLogo /> Submitted Tasks</Link>
                        </li>
                        <li>
                            <Link href="/admin/notifications" className='h-link flex items-center gap-2'><GrNotification /> Notifications</Link>
                        </li>
                        <li>
                            <Link href="/admin/payments" className='h-link flex items-center gap-2'><LuDollarSign /> Withdraw Requests</Link>
                        </li>
                    </ul>
                </div>
            </div >
        </>
    )
}