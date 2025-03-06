"use client"
import React, { useEffect, useState } from 'react'
import '../dashboard.css'
import './public-tasks.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import { LuClock, LuSearch, LuTrophy, LuUserRound } from 'react-icons/lu'
import axios from 'axios'
import PublicTasksLoader from '@/components/PublicTasksLoader/page'

export default function PublicTasks() {

    const [allPublicTasks, setAllPublicTasks] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTasks, setSearchTasks] = useState("")
    const [searchedTasks, setSearchedTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/public-tasks?page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setAllPublicTasks(data?.publicTasks)
                    setTotalPages(Math.ceil(data?.totalPublicTasks / 15))
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [page])

    const handleSearchTasks = e => {
        e.preventDefault()
        if (searchTasks === "") {
            return alert("Give some input to search task!")
        }

        setLoading(true)
        setSearchTasks([])
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/public-tasks/search-tasks?searchTasks=${searchTasks}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setSearchedTasks(data?.tasks || [])
                }
            })
            .catch(err => {
                const { status, data } = err.response
                if (status === 404) {
                    alert(data.message || "Not matching task found")
                } else {
                    console.error("Error fetching user:", err.message)
                    alert("An unexpected error occurred. Please try again.")
                }
            })
            .finally(() => {
                setLoading(false)
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
                            <span className='text-[20px] text-[#666]'>/ Public Tasks</span>
                        </h2>
                    </div>

                    <div className='flex justify-end items-center relative gap-5 mt-10'>
                        <div className='absolute right-3 bg-[#fff] h-[90%] flex items-center px-1'>
                            <LuSearch className='text-[#666]' />
                        </div>
                        <form onSubmit={handleSearchTasks}>
                            <input type="text" name="searchEmail" id="searchEmail" value={searchTasks} placeholder='Search any task' className='border shadow-md px-3 py-2 rounded-[5px] w-[300px]' onChange={(e) => setSearchTasks(e.target.value)} />
                        </form>
                    </div>

                    <div className='flex flex-col gap-5 mt-5 mb-10'>
                        {
                            loading ?
                                <PublicTasksLoader />
                                :
                                (
                                    searchedTasks.length < 1 ?
                                        (
                                            allPublicTasks.length > 0 ?
                                                allPublicTasks.map(task => {
                                                    const { taskID, taskTitle, taskDescription, taskPoints, taskPrice, adminName, createdAt } = task
                                                    const date = createdAt.slice(0, 10)
                                                    const time = createdAt.slice(11, 16)
                                                    const datetime = date + " " + time
                                                    return (
                                                        <div key={taskID} className='public-task-box w-full min-h-[120px] px-5 py-3 border rounded-[5px]'>
                                                            <div className='pr-[50px]'>
                                                                <Link href={`/dashboard/public-tasks/${taskID}`} className='font-bold text-[#6c5ce7] text-[20px] underline transition-all duration-200 ease-out hover:text-[#0093E9]'>{taskTitle}</Link>
                                                                <p className='ellipsis text-[15px] text-[#888] mt-2'>{taskDescription}</p>
                                                                <div className='flex gap-4 py-2'>
                                                                    <p className='text-[13px] border-r-2 pr-4 flex items-center gap-2'><LuUserRound className='text-[#0093E9]' /> Author: <span className='text-[#888]'>{adminName}</span></p>
                                                                    <p className='text-[13px] border-r-2 pr-4 flex items-center gap-2'><LuClock className='text-[#d4d42f]' /> Created at: <span className='text-[#888]'>{datetime}</span></p>
                                                                    <p className='text-[13px] flex items-center gap-2'><LuTrophy className='text-[#49d633]' /> Points: <span className='text-[#888]'>{taskPoints}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col items-center justify-between py-2 border-l-2 pl-5'>
                                                                <p>Price: <span className='text-[#888]'>${taskPrice}</span></p>
                                                                <Link href={`/dashboard/public-tasks/${taskID}`} className='see-dets font-bold text-[#fff] text-[14px] bg-[#6c5ce7] whitespace-nowrap px-[10px] py-[8px] rounded-[5px] flex items-center gap-2 transition-all duration-200 ease-out hover:bg-[#0093E9]'>See Details <FaArrowRight /></Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className='flex items-center justify-center'>
                                                    <p className='bg-yellow-100 border-2 border-yellow-200 px-3 py-2 rounded-[5px]'>There are no public tasks avaiable!</p>
                                                </div>
                                        )
                                        :
                                        (
                                            searchedTasks.length > 0 ?
                                                searchedTasks.map(task => {
                                                    const { taskID, taskTitle, taskDescription, taskPoints, taskPrice, adminName, createdAt } = task
                                                    const date = createdAt.slice(0, 10)
                                                    const time = createdAt.slice(11, 16)
                                                    const datetime = date + " " + time
                                                    return (
                                                        <div key={taskID} className='public-task-box w-full min-h-[120px] px-5 py-3 border rounded-[5px]'>
                                                            <div className='pr-[50px]'>
                                                                <Link href={`/dashboard/public-tasks/${taskID}`} className='font-bold text-[#6c5ce7] text-[20px] underline transition-all duration-200 ease-out hover:text-[#0093E9]'>{taskTitle}</Link>
                                                                <p className='ellipsis text-[15px] text-[#888] mt-2'>{taskDescription}</p>
                                                                <div className='flex gap-4 py-2'>
                                                                    <p className='text-[13px] border-r-2 pr-4 flex items-center gap-2'><LuUserRound className='text-[#0093E9]' /> Author: <span className='text-[#888]'>{adminName}</span></p>
                                                                    <p className='text-[13px] border-r-2 pr-4 flex items-center gap-2'><LuClock className='text-[#d4d42f]' /> Created at: <span className='text-[#888]'>{datetime}</span></p>
                                                                    <p className='text-[13px] flex items-center gap-2'><LuTrophy className='text-[#49d633]' /> Points: <span className='text-[#888]'>{taskPoints}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col items-center justify-between py-2 border-l-2 pl-5'>
                                                                <p>Price: <span className='text-[#888]'>${taskPrice}</span></p>
                                                                <Link href={`/dashboard/public-tasks/${taskID}`} className='see-dets font-bold text-[#fff] text-[14px] bg-[#6c5ce7] whitespace-nowrap px-[10px] py-[8px] rounded-[5px] flex items-center gap-2 transition-all duration-200 ease-out hover:bg-[#0093E9]'>See Details <FaArrowRight /></Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className='flex items-center justify-center'>
                                                    <p className='bg-yellow-100 border-2 border-yellow-200 px-3 py-2 rounded-[5px]'>There are no matching tasks present!</p>
                                                </div>
                                        )
                                )
                        }
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