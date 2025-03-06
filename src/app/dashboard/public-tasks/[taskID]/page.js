"use client"
import React, { useEffect, useState } from 'react'
import '../../dashboard.css'
import './taskid.css'
import { useParams } from 'next/navigation'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiFillInfoCircle, AiOutlineDashboard, AiOutlineInsertRowAbove } from 'react-icons/ai'
import PublicTaskDetsLoader from '@/components/PublicTaskDetsLoader/page'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'

export default function PublicTasks() {

    const { user } = useAuthContext()
    const { taskID } = useParams()
    const [task, setTask] = useState({})
    const [loading, setLoading] = useState(true)
    const [acceptLoading, setAcceptLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/public-tasks/taskID/?taskID=${taskID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setTask(data?.taskDetails)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleAcceptTask = () => {
        setAcceptLoading(true)
        const { adminID, adminEmail, adminName, taskID, taskTitle, taskDescription, taskPoints, taskPrice, taskStatus, taskMode } = task

        const acceptedTask = {
            userID: user?.userID,
            userEmail: user?.email,
            adminID,
            adminEmail,
            adminName,
            taskID,
            taskTitle,
            taskDescription,
            taskPoints,
            taskPrice,
            taskStatus,
            taskMode
        }

        setAcceptLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/accept-task`, acceptedTask)
            .then(res => {
                const { data } = res
                alert(data.message)
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert(err.response.data.message)
            })
            .finally(() => {
                setAcceptLoading(false)
            })
    }

    const date = task?.createdAt?.slice(0, 10)
    const time = task?.createdAt?.slice(11, 16)
    const datetime = date + " " + time

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

                    {
                        loading ?
                            <PublicTaskDetsLoader />
                            :
                            <div className='flex gap-10 mt-10'>
                                <div className='flex-1'>
                                    <h1 className='text-[30px] mb-5 border-b-2 pb-2'>{task?.taskTitle}</h1>
                                    <h3 className='text-[18px] mb-2'>Description:</h3>
                                    <p>{task?.taskDescription}</p>
                                </div>
                                <div>
                                    <div className='flex justify-end'>
                                        <button className='flex items-center gap-2 px-3 py-2 mb-5 text-white bg-[#6c5ce7] shadow-md rounded-[5px] transition-all duration-200 hover:bg-[#009de9]' disabled={acceptLoading} onClick={handleAcceptTask}>
                                            {
                                                !acceptLoading ?
                                                    <>
                                                        Accept Task <AiOutlineInsertRowAbove />
                                                    </>
                                                    :
                                                    "Accepting..."
                                            }
                                        </button>
                                    </div>
                                    <div className='shad w-[300px] p-5 rounded-[5px] border'>
                                        <p className='mb-3 border-b-2 flex items-center gap-1'><AiFillInfoCircle className='text-[#009de9]' /> Details:</p>
                                        <p>Author Name: <span>{task?.adminName}</span></p>
                                        <p>Author Email: <span>{task?.adminEmail}</span></p>
                                        <p>Created At: <span>{datetime}</span></p>
                                        <p>Task Points: <span>{task?.taskPoints}</span></p>
                                        <p>Task Price: <span>${task?.taskPrice}</span></p>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}