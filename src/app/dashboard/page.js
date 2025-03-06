"use client"
import React, { useEffect, useState } from 'react'
import './dashboard.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import Loader from '@/components/Loader/page'
import { useAuthContext } from '../contexts/AuthContext'
import { GrTask, GrTasks } from 'react-icons/gr'
import { FiCheck } from 'react-icons/fi'
import { LuClock10 } from 'react-icons/lu'
import { IoMdClose } from 'react-icons/io'
import axios from 'axios'

export default function Dashboard() {

	const { isAuthenticated, user } = useAuthContext()
	const [userTasksCount, setUserTasksCount] = useState(0)
	const [completedTasksCount, setCompletedTasksCount] = useState(0)
	const [pendingTasksCount, setPendingTasksCount] = useState(0)
	const [failedTasksCount, setFailedTasksCount] = useState(0)
	const [publicTasksCount, setPublicTasksCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isAuthenticated && user) {
			handleFetchData()
		}
	}, [isAuthenticated, user])

	const handleFetchData = () => {
		setLoading(true)
		axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/?userID=${user?.userID}`)
			.then(res => {
				const { status, data } = res
				const { userTCount, completedTCount, pendingTCount, failedTCount, publicTCount } = data
				if (status === 200) {
					setUserTasksCount(userTCount)
					setCompletedTasksCount(completedTCount)
					setPendingTasksCount(pendingTCount)
					setFailedTasksCount(failedTCount)
					setPublicTasksCount(publicTCount)
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	if (loading) {
		return <Loader />
	}

	return (
		<>
			<DashboardHeader />
			<div className="dashboard-container">
				<div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
					<div className='flex flex-col gap-6'>
						<div className="flex gap-6">
							<div className="task-box flex-1 h-[200px] rounded-[5px] bg-[#8ca4f3]">
								<div className="flex flex-col justify-between h-full">
									<h2 className='text-white font-bold drop-shadow-md text-[28px]'>Your Tasks</h2>
									<p className='task-num text-white font-bold text-[5rem] drop-shadow-md relative z-10 leading-none'>{userTasksCount}</p>
									<span className='task-box-icon text-white text-[75px] drop-shadow-md'><GrTask /></span>
								</div>
							</div>
							<div className="task-box flex-1 h-[200px] rounded-[5px] bg-[#94e18b]">
								<div className="flex flex-col justify-between h-full">
									<h2 className='text-white font-bold drop-shadow-md text-[28px]'>Completed Tasks</h2>
									<p className='task-num text-white font-bold text-[5rem] drop-shadow-md relative z-10 leading-none'>{completedTasksCount}</p>
									<span className='task-box-icon text-white text-[75px] drop-shadow-md'><FiCheck /></span>
								</div>
							</div>
							<div className="task-box flex-1 h-[200px] rounded-[5px] bg-[#ecf56d]">
								<div className="flex flex-col justify-between h-full">
									<h2 className='text-white font-bold drop-shadow-md text-[28px]'>Pending Tasks</h2>
									<p className='task-num text-white font-bold text-[5rem] drop-shadow-md relative z-10 leading-none'>{pendingTasksCount}</p>
									<span className='task-box-icon text-white text-[75px] drop-shadow-md'><LuClock10 /></span>
								</div>
							</div>
						</div>
						<div className='flex gap-6'>
							<div className="task-box flex-1 h-[200px] rounded-[5px] bg-[#f77a7a]">
								<div className="flex flex-col justify-between h-full">
									<h2 className='text-white font-bold drop-shadow-md text-[28px]'>Failed Tasks</h2>
									<p className='task-num text-white font-bold text-[5rem] drop-shadow-md relative z-10 leading-none'>{failedTasksCount}</p>
									<span className='task-box-icon task-box-icon-4 text-white text-[75px] drop-shadow-md'><IoMdClose /></span>
								</div>
							</div>
							<div className="task-box flex-1 h-[200px] rounded-[5px] bg-[#fbbf5e]">
								<div className="flex flex-col justify-between h-full">
									<h2 className='text-white font-bold drop-shadow-md text-[28px]'>Public Tasks</h2>
									<p className='task-num text-white font-bold text-[5rem] drop-shadow-md relative z-10 leading-none'>{publicTasksCount}</p>
									<span className='task-box-icon task-box-icon-4 text-white text-[75px] drop-shadow-md'><GrTasks /></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}