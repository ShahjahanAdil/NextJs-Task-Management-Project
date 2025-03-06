"use client"
import React, { useEffect, useState } from 'react'
import '../../dashboard.css'
import './taskid.css'
import { useParams } from 'next/navigation'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiFillInfoCircle, AiOutlineDashboard } from 'react-icons/ai'
import axios from 'axios'
import { useAuthContext } from '@/app/contexts/AuthContext'
import YourTaskDetsLoader from '@/components/YourTaskDetsLoader/page'

export default function YourTasks() {

    const { user } = useAuthContext()
    const { taskID } = useParams()
    const [task, setTask] = useState({})
    const [state, setState] = useState({ domainLink: "", githubLink: "", extraLink: "" })
    const [loading, setLoading] = useState(true)
    const [submissionLoading, setSubmissionLoading] = useState(false)

    useEffect(() => {
        if (taskID) {
            setLoading(true)
            axios.get(`${process.env.API_LINK}/api/dashboard/submit-task/?taskID=${taskID}`)
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
        }
    }, [taskID])

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmitTask = async () => {
        const { domainLink, githubLink, extraLink } = state
        if (!domainLink || !githubLink || !extraLink) {
            return alert("Please fill all fields!")
        }

        const taskToSubmit = {
            ...task,
            domainLink,
            githubLink,
            extraLink
        }

        const notification = {
            recipient: task?.adminID,
            content: user.email + " submitted task to you",
            status: "unread"
        }

        setSubmissionLoading(true)
        await axios.post(`${process.env.API_LINK}/api/dashboard/submit-task`, { taskToSubmit, notification })
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    alert(data.message)
                    setState({ domainLink: "", githubLink: "", extraLink: "" })
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert("Something went wrong while submitting task. Please try again!")
            })
            .finally(() => {
                setSubmissionLoading(false)
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
                            <span className='text-[20px] text-[#666]'>/ Your Tasks</span>
                        </h2>
                    </div>

                    {
                        loading ?
                            <YourTaskDetsLoader />
                            :
                            <>
                                <div className='flex gap-10 mt-10'>
                                    <div className='flex-1'>
                                        <h1 className='text-[30px] mb-5 border-b-2 pb-1'>{task?.taskTitle}</h1>
                                        <h3 className='text-[18px] mb-2'>Description:</h3>
                                        <p>{task?.taskDescription}</p>
                                    </div>
                                    <div>
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

                                <div className='shad my-10 px-[30px] py-[20px] rounded-[5px]'>
                                    <h2 className='text-[22px] text-[#6c5ce7] border-b-2 pb-1'>Task Submission Form</h2>
                                    <p className='mt-3 mb-5'>The task will be submitted to the admin. Admin will accept or reject your task.</p>
                                    <div className='flex gap-5'>
                                        <div className='flex-1'>
                                            <label htmlFor="domainLink" className='mb-2 text-[#666]'>Domain Link:</label>
                                            <input type="text" name="domainLink" id="domainLink" value={state.domainLink} placeholder='Enter website live link (e.g., www.my-website.firebase.app)' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <label htmlFor="githubLink" className='mb-2 text-[#666]'>GitHub Repo Link:</label>
                                            <input type="text" name="githubLink" id="githubLink" value={state.githubLink} placeholder='Enter github repo link' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="extraLink" className='mb-2 text-[#666]'>Extra Link:</label>
                                        <input type="text" name="extraLink" id="extraLink" value={state.extraLink} placeholder='Enter extra content link about your project (e.g., google drive)' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button className='px-3 py-2 mt-5 bg-[#6c5ce7] text-[#fff] rounded-[5px] shadow-md transition-all duration-300 ease-out hover:bg-[#009de9]' onClick={handleSubmitTask}>
                                        {
                                            !submissionLoading ?
                                                "Submit Task" :
                                                "Submitting..."
                                        }
                                    </button>
                                </div>
                            </>
                    }
                </div>
            </div>
        </>
    )
}