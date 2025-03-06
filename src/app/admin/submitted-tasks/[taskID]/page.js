"use client"
import React, { useEffect, useState } from 'react'
import '../../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { AiFillInfoCircle, AiOutlineDashboard } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import { FaUserCheck } from 'react-icons/fa6'
import { FiCloud } from 'react-icons/fi'
import { GrGithub } from 'react-icons/gr'
import { LuLink } from 'react-icons/lu'
import { useAuthContext } from '@/app/contexts/AuthContext'
import SubmittedTaskLoader from '@/components/SubmittedTaskLoader/page'
import axios from 'axios'

export default function SubmittedTask() {

	const { taskID } = useParams()
	const { user } = useAuthContext()
	const [task, setTask] = useState({})
	const [loading, setLoading] = useState(true)
	const [acceptLoading, setAcceptLoading] = useState(false)
	const [rejectLoading, setRejectLoading] = useState(false)

	useEffect(() => {
		if (user.userID) {
			fetchTask()
		}
	}, [user])

	const fetchTask = () => {
		setLoading(true)
		axios.get(`${process.env.API_LINK}/api/admin/submitted-tasks/${taskID}`)
			.then(res => {
				const { status, data } = res
				if (status === 200) {
					setTask(data.submittedTask || {})
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const { createdAt } = task
	const date = createdAt?.slice(0, 10)
	const time = createdAt?.slice(11, 16)
	const datetime = date + " " + time

	const handleAcceptTask = () => {
		const updatedTask = { ...task, taskStatus: "completed" }

		setAcceptLoading(true)
		axios.patch(`${process.env.API_LINK}/api/admin/submitted-tasks/accept?taskID=${taskID}&userID=${updatedTask.userID}`, updatedTask)
			.then(res => {
				console.log("Response received", res)
				const { status, data } = res
				alert(data?.message)
				if (status === 202) {
					setTask(updatedTask)
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.response?.data?.message || err.message)
				alert("An error occurred. Please try again.")
			})
			.finally(() => {
				setAcceptLoading(false)
			})
	}

	const handleRejectTask = () => {
		const updatedTask = { ...task, taskStatus: "rejected" }

		setRejectLoading(true)
		axios.patch(`${process.env.API_LINK}/api/admin/submitted-tasks/reject?taskID=${taskID}`)
			.then(res => {
				const { status, data } = res
				if (status === 202) {
					setTask(updatedTask || {})
					alert(data?.message)
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
			})
			.finally(() => {
				setRejectLoading(false)
			})
	}

	return (
		<>
			<AdminHeader />
			<div className="admin-container">
				<div className="w-full min-h-[calc(100vh-85px)] px-5 pt-12 pb-16">
					<div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
						<h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
							<span className='text-[22px]'><AiOutlineDashboard /></span> Admin Panel
							<span className='text-[20px] text-[#666]'>/ Submitted Tasks</span>
						</h2>
					</div>

					<div className='mt-8 flex gap-5'>
						{
							loading ?
								<SubmittedTaskLoader />
								:
								<>
									<div className='flex-1'>
										<h1 className='text-[30px] border-b-2 inline-block pb-1'>{task.taskTitle}</h1>
										<p className='mt-3 text-[#333]'>Description:</p>
										<p>{task.taskDescription}</p>
									</div>
									<div className='w-[400px] min-h-[300px] p-[20px] border shadow-md rounded-[5px]'>
										<h2 className='text-[20px] border-b-2 pb-1 flex items-center gap-2'><FaUserCheck /> User provided data:</h2>
										<p className='mt-3 flex items-center gap-1'><FiCloud /> Website Link:</p>
										<a href={task.domainLink} target='_blank' className='text-[#009de9] indent-6 inline-block'>
											{
												task.domainLink ? task.domainLink : "No link submitted"
											}
										</a>
										<p className='mt-3 flex items-center gap-1'><GrGithub /> GitHub Repo Link:</p>
										<a href={task.githubLink} target='_blank' className='text-[#009de9] indent-6 inline-block'>
											{
												task.githubLink ? task.githubLink : "No link submitted"
											}
										</a>
										<p className='mt-3 flex items-center gap-1'><LuLink /> Extra Link:</p>
										<a href={task.extraLink} target='_blank' className='text-[#009de9] indent-6 inline-block'>
											{
												task.extraLink ? task.extraLink : "No link submitted"
											}
										</a>

										<div className='bg-neutral-100 w-full py-2 px-3 mt-5 shadow-md border rounded-[5px]'>
											<p className='flex items-center gap-1 mb-2 border-b-2'><AiFillInfoCircle /> Info</p>
											<p>Submitted by: <span>{task.userEmail}</span></p>
											<p>Submitted on: <span>{datetime}</span></p>
											<p>Points: <span>{task.taskPoints}</span></p>
											<p>Price: <span>${task.taskPrice}</span></p>
										</div>
										<div className='flex gap-2 mt-5'>
											<button className='flex-1 text-[#fff] bg-[#6c5ce7] p-3 rounded-[50px] shadow-md transition-all duration-300 hover:bg-[#009de9]' onClick={handleAcceptTask}>
												{
													!acceptLoading ?
														"Accept" :
														"Accepting..."
												}
											</button>
											<button className='flex-1 text-[#fff] bg-[#ef4444] p-3 rounded-[50px] shadow-md transition-all duration-300 hover:bg-[#d33939]' onClick={handleRejectTask}>
												{
													!rejectLoading ?
														"Reject" :
														"Rejecting..."
												}
											</button>
										</div>
									</div>
								</>
						}
					</div>
				</div>
			</div>
		</>
	)
}