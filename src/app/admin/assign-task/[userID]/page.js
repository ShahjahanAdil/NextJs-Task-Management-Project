"use client"
import React, { useEffect, useState } from 'react'
import '../../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import { FiInfo } from 'react-icons/fi'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'
import Loader from '@/components/Loader/page'

const initialState = { taskTitle: "", taskDescription: "", taskPrice: "", taskPoints: "" }
const generateRandomID = () => Math.random().toString(36).slice(5)

export default function AssignTask() {

    const { userID } = useParams()
    const { user } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [fetchedUser, setFetchedUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [assignLoading, setAssignLoading] = useState(false)

    useEffect(() => {
        if (user.userID) {
            fetchUser()
        }
    }, [user])

    const fetchUser = async () => {
        setLoading(true)
        axios.get(`${process.env.API_LINK}/api/admin/assign-task/${userID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setFetchedUser(data?.user || {})
                }
            })
            .catch(err => {
                const { status, data } = err.response
                if (status === 404) {
                    alert(data.message || "User not found")
                } else {
                    console.error("Error fetching user:", err.message);
                    alert("An unexpected error occurred. Please try again.")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleAssignTask = async () => {
        const { taskTitle, taskDescription, taskPrice, taskPoints } = state
        if (!taskTitle || !taskDescription || !taskPrice || !taskPoints) {
            alert("Please fill all fields!")
            return
        }

        const privateTask = {
            userID: fetchedUser?.userID,
            userEmail: fetchedUser?.email,
            adminID: user?.userID,
            adminName: user?.username,
            adminEmail: user?.email,
            taskID: generateRandomID(),
            taskTitle,
            taskDescription,
            taskPrice,
            taskPoints,
            taskStatus: "pending",
            taskMode: "private"
        }

        const notification = {
            recipient: fetchedUser?.userID,
            content: "You got a new task from admin",
            status: "unread"
        }

        setAssignLoading(true)
        await axios.post(`${process.env.API_LINK}/api/admin/assign-task`, { privateTask, notification })
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    alert(data.message)
                    setState(initialState)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert("Something went wrong while creating task. Please try again!")
            })
            .finally(() => {
                setAssignLoading(false)
            })
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <AdminHeader />
            <div className="admin-container">
                <div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
                    <div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
                        <h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
                            <span className='text-[22px]'><AiOutlineDashboard /></span> Admin Panel
                            <span className='text-[20px] text-[#666]'>/ Assign Task</span>
                        </h2>
                    </div>

                    <div className='flex flex-col justify-center items-center mt-10'>
                        <div className='w-full max-w-[650px] min-h-[350px] bg-neutral-100 rounded-[5px] p-[30px] shadow-lg'>
                            <h2 className='text-[#6c5ce7] text-[20px]'>Assign Private Task</h2>
                            <p className='mb-5 font-bold text-[16px] text-[#666] flex items-center gap-1'><FiInfo /> The task will be assigned to selected user</p>
                            <p className='mb-5 text-[16px] text-center bg-[#faff96bd] p-[10px] rounded-[5px] border-2 border-[#e9f339bd]'>Assigning to: {userID}</p>
                            <div>
                                <label htmlFor="taskTitle">Title:</label>
                                <input type="text" name="taskTitle" id="taskTitle" value={state.taskTitle} placeholder='Enter title' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="taskDescription">Description:</label>
                                <textarea name="taskDescription" id="taskDescription" value={state.taskDescription} placeholder='Enter description (max 1500 alphabets)' maxLength={1500} rows={10} className='w-full text-[#666] p-[10px] rounded-[5px] mt-2 mb-4 resize-none' onChange={handleChange}></textarea>
                                {/* <input type="text" name="description" id="description" placeholder='Enter description' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' /> */}
                            </div>
                            <div className='flex gap-5'>
                                <div className='flex-1'>
                                    <label htmlFor="taskPoints">Points:</label>
                                    <input type="text" name="taskPoints" id="taskPoints" value={state.taskPoints} placeholder='Enter points' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' onChange={handleChange} />
                                </div>
                                <div className='flex-1'>
                                    <label htmlFor="taskPrice">Price:</label>
                                    <input type="text" name="taskPrice" id="taskPrice" value={state.taskPrice} placeholder='Enter price' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' onChange={handleChange} />
                                </div>
                            </div>
                            <button className='w-full mt-8 p-3 bg-[#6c5ce7] text-white rounded-[5px] shadow-md transition-all duration-300 ease-out hover:bg-[#009de9]' disabled={assignLoading} onClick={handleAssignTask} >
                                {
                                    !assignLoading ?
                                        "Assign"
                                        :
                                        "Assigning Task..."
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}