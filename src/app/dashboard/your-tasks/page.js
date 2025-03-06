"use client"
import React, { useEffect, useState, Suspense } from 'react'
import '../dashboard.css'
import './your-tasks.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiOutlineDashboard, AiOutlineInfoCircle } from 'react-icons/ai'
import Link from 'next/link'
import { LuClock, LuInfo, LuTrash, LuTrophy } from 'react-icons/lu'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'
import YourTasksLoader from '@/components/YourTasksLoader/page'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { GrFilter } from 'react-icons/gr'

export default function YourTasks() {

    const { user } = useAuthContext()
    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = searchParams.get("filter") || "all"

    const [yourTasks, setYourTasks] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [openModel, setOpenModel] = useState(false)
    const [delTaskID, setDelTaskID] = useState("")
    const [activeButton, setActiveButton] = useState("all")
    const [loading, setLoading] = useState(true)
    const [delLoading, setDelLoading] = useState(false)

    useEffect(() => {
        if (user.email) {
            debounce(() => {
                fetchTasks(filter)
            }, 300)()
        }
    }, [user, filter, activeButton, page])

    const fetchTasks = (filter) => {
        setLoading(true)
        const url = filter === "all"
            ?
            `${process.env.NEXT_PUBLIC_HOST}/api/dashboard/your-tasks?userID=${user?.userID}&page=${page}`
            :
            `${process.env.NEXT_PUBLIC_HOST}/api/dashboard/your-tasks/filter?userID=${user?.userID}&page=${page}&filter=${filter}`
        axios.get(url)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setYourTasks(data?.yourTasks)
                    setTotalPages(Math.ceil(data?.totalTasks / 20))
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleFilter = (item) => {
        setActiveButton(item)
        router.push(`/dashboard/your-tasks?filter=${item}`)
    }

    const handleDelete = (taskID) => {
        setOpenModel(true)
        setDelTaskID(taskID)
    }

    const handleDeleteTask = () => {
        setDelLoading(true)
        axios.delete(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/your-tasks/delete?userID=${user?.userID}&taskID=${delTaskID}`)
            .then(res => {
                const { status, data } = res
                if (status === 203) {
                    alert(data.message)
                    const updatedYourTasks = yourTasks.filter(task => task.taskID !== delTaskID)
                    setYourTasks(updatedYourTasks)
                    setDelTaskID("")
                    setOpenModel(false)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert(err.response.data.message)
            })
            .finally(() => {
                setDelLoading(false)
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
                            <span className='text-[20px] text-[#666]'>/ Your Tasks</span>
                        </h2>
                    </div>

                    <div className='flex gap-2 mt-10'>
                        <div className='flex items-center gap-1 mr-2 text-[#333] font-bold'><GrFilter /> Filter:</div>
                        {['all', 'completed', 'pending'].map((item, i) =>
                            <button key={i}
                                className={`px-2 py-1 capitalize rounded-[5px] ${activeButton === item ? 'bg-[#6c5ce7] text-white' : 'bg-[#e8e8e8] text-gray-700'} hover:bg-[#009de9] hover:text-white transition-all duration-200`}
                                onClick={() => handleFilter(item)}
                            >
                                {item}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-5 mt-5 mb-10">
                        <Suspense fallback={<YourTasksLoader />}>
                            {
                                loading ?
                                    <YourTasksLoader />
                                    :
                                    yourTasks.length > 0 ?
                                        (
                                            yourTasks.map(task => {
                                                const { taskID, taskStatus, taskTitle, createdAt, taskPoints, taskPrice } = task
                                                const date = createdAt.slice(0, 10)
                                                const time = createdAt.slice(11, 16)
                                                const datetime = date + " " + time
                                                return (
                                                    <div key={`${taskID}-${page}`} className="my-task-box border rounded-[5px]">
                                                        <div className='flex flex-col h-full justify-between p-[15px]'>
                                                            <div className='flex justify-between px-2 pb-2 border-b-2'>
                                                                <p className='text-[13px] flex items-center gap-2'><LuInfo /> Status: <span className='text-[#888] font-bold capitalize' style={{ fontFamily: 'cocomat' }}>{taskStatus}</span></p>
                                                                <p className='text-[15px] text-[#ef4444]' onClick={() => handleDelete(taskID)}><LuTrash className='cursor-pointer' /></p>
                                                            </div>
                                                            <div className='flex-1 pb-4'>
                                                                <Link href={`/dashboard/your-tasks/${taskID}`} className='block word wrap font-bold px-2 text-[#6c5ce7] text-[20px] mt-2 transition-all duration-200 ease-out hover:text-[#0093E9]'>{taskTitle}</Link>
                                                            </div>
                                                            <div className='flex flex-col gap-1 px-2 bg-neutral-100 p-2 rounded-[5px]'>
                                                                <p className='text-[13px] flex items-center gap-2'><LuClock /> Joined at: <span className='text-[#888]'>{datetime}</span></p>
                                                                <div className='flex justify-between'>
                                                                    <p className='text-[13px] flex items-center gap-2'><LuTrophy /> Points: <span className='text-[#888]'>{taskPoints}</span></p>
                                                                    <p className='text-[15px]'>Price: <span className='text-[#888]'>${taskPrice}</span></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                        :
                                        <div className='flex justify-center items-center w-full'>
                                            <p className='px-3 py-1 bg-red-200 border border-red-400 text-red-600 rounded-[5px]'>You have no task yet!</p>
                                        </div>
                            }
                        </Suspense>
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

            {
                openModel &&
                <div className='fixed w-full h-full top-0 left-0 flex justify-center items-center bg-[#1919192d]'>
                    <div className='bg-[#fff] p-[15px] rounded-[5px] shadow-lg'>
                        <p className='flex items-center gap-1 mb-3'><AiOutlineInfoCircle /> Are you sure you want to delete this task?</p>
                        <div className='flex justify-end gap-2'>
                            <button className='bg-[#333] text-[#fff] px-2 py-1 rounded-[5px] hover:bg-[#666]' onClick={() => setOpenModel(false)}>Cancel</button>
                            <button className='bg-red-500 text-[#fff] px-2 py-1 rounded-[5px] hover:bg-red-600' onClick={handleDeleteTask}>
                                {
                                    !delLoading ?
                                        "Yes" :
                                        "Deleting..."
                                }
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}