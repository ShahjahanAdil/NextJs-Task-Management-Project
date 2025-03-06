"use client"
import React, { useState } from 'react'
import '../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FiInfo } from 'react-icons/fi'
import { useAuthContext } from '@/app/contexts/AuthContext'
import axios from 'axios'

const initialState = { taskTitle: "", taskDescription: "", taskPrice: "", taskPoints: "" }
const generateRandomID = () => Math.random().toString(36).slice(5)

export default function CreateTask() {

	const { user } = useAuthContext()
	const [state, setState] = useState(initialState)
	const [loading, setLoading] = useState(false)

	const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

	const handleCreateTask = async () => {
		const { taskTitle, taskDescription, taskPrice, taskPoints } = state
		if (!taskTitle || !taskDescription || !taskPrice || !taskPoints) {
			alert("Please fill all fields!")
			return
		}

		const newTask = {
			adminID: user?.userID,
			adminName: user?.username,
			adminEmail: user?.email,
			taskID: generateRandomID(),
			taskTitle,
			taskDescription,
			taskPrice,
			taskPoints,
			taskStatus: "pending",
			taskMode: "public"
		}

		setLoading(true)
		await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/admin/create-task`, newTask)
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
				setLoading(false)
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
							<span className='text-[20px] text-[#666]'>/ Create Task</span>
						</h2>
					</div>

					<div className='flex flex-col justify-center items-center mt-10'>
						<div className='w-full max-w-[650px] min-h-[350px] bg-neutral-100 rounded-[5px] p-[30px] shadow-lg'>
							<h2 className='text-[#6c5ce7] text-[20px]'>Create Public Task</h2>
							<p className='mb-5 font-bold text-[16px] text-[#666] flex items-center gap-1'><FiInfo /> The created task will be available for public</p>
							<div>
								<label htmlFor="taskTitle">Title:</label>
								<input type="text" name="taskTitle" id="taskTitle" value={state.taskTitle} placeholder='Enter title' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' onChange={handleChange} />
							</div>
							<div>
								<label htmlFor="taskDescription">Description:</label>
								<textarea name="taskDescription" id="taskDescription" value={state.taskDescription} placeholder='Enter description (max 1500 alphabets)' rows={10} maxLength={1500} className='w-full text-[#666] p-[10px] rounded-[5px] mt-2 mb-4 resize-none' onChange={handleChange}></textarea>
								{/* <input type="text" name="taskDescription" id="taskDescription" value={state.taskDescription} placeholder='Enter description' className='w-full p-[10px] rounded-[5px] mt-2 mb-4' onChange={handleChange} /> */}
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
							<button className='w-full mt-8 p-3 bg-[#6c5ce7] text-white rounded-[5px] shadow-md transition-all duration-300 ease-out hover:bg-[#009de9]' disabled={loading} onClick={handleCreateTask}>
								{
									!loading ?
										"Create"
										:
										"Creating Task..."
								}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}