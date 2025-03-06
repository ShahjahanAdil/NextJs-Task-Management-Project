"use client"
import React, { useEffect, useState } from 'react'
import '../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { AiOutlineDashboard, AiOutlineInfoCircle } from 'react-icons/ai'
import { FiEdit3, FiTrash } from 'react-icons/fi'
import axios from 'axios'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import TableLoader from '@/components/TableLoader/page'
import { useAuthContext } from '@/app/contexts/AuthContext'
import { LuSearch } from 'react-icons/lu'

export default function TasksCreated() {

	const { user } = useAuthContext()
	const [allPublicTasks, setAllPublicTasks] = useState([])
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [searchTasks, setSearchTasks] = useState("")
	const [searchedTasks, setSearchedTasks] = useState([])
	const [openModel, setOpenModel] = useState(false)
	const [delTaskID, setDelTaskID] = useState("")
	const [loading, setLoading] = useState(true)
	const [delLoading, setDelLoading] = useState(false)

	useEffect(() => {
		if (user?.email) {
			setLoading(true)
			axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/admin/tasks-created?page=${page}`)
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
		}
	}, [user, page])

	const handleSearchTasks = e => {
		e.preventDefault()
		if (searchTasks === "") {
			return alert("Give some input to search task!")
		}

		setLoading(true)
		setSearchedTasks([])
		axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/admin/tasks-created/search-tasks?searchTasks=${searchTasks}`)
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

	const handleDelete = (taskID) => {
		setOpenModel(true)
		setDelTaskID(taskID)
	}

	const handleDeleteTask = () => {
		setDelLoading(true)
		axios.delete(`${process.env.NEXT_PUBLIC_HOST}/api/admin/tasks-created/delete?userID=${user.userID}&taskID=${delTaskID}`)
			.then(res => {
				const { status, data } = res
				if (status === 203) {
					alert(data.message)
					setAllPublicTasks(prevTasks => prevTasks.filter(task => task.taskID !== delTaskID))
					setSearchedTasks(prevTasks => prevTasks.filter(task => task.taskID !== delTaskID))
					setDelTaskID("")
					setOpenModel(false)
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
				alert(err.response?.data?.message || "An error occurred. Please try again.")
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
			<AdminHeader />
			<div className="admin-container">
				<div className="w-full min-h-[calc(100vh-85px)] px-5 pt-12 pb-16">
					<div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
						<h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
							<span className='text-[22px]'><AiOutlineDashboard /></span> Admin Panel
							<span className='text-[20px] text-[#666]'>/ Tasks Created</span>
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

					<div className="table-div flex flex-col mt-5 border px-5 rounded-[5px]">
						<div className="-m-1.5 overflow-x-auto">
							<div className="p-1.5 min-w-full inline-block align-middle">
								<div className="overflow-hidden">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">ID</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Title</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Description</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Mode</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Created At</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Created By</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Points</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Price</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Actions</th>
											</tr>
										</thead>
										<tbody>
											{
												loading ?
													<TableLoader />
													:
													(
														searchedTasks.length < 1 ?
															(
																allPublicTasks.length > 0 ?
																	allPublicTasks.map(task => {
																		const { taskID, taskTitle, taskDescription, taskMode, createdAt, adminEmail, taskPoints, taskPrice } = task
																		const date = createdAt.slice(0, 10)
																		const time = createdAt.slice(11, 16)
																		const datetime = date + " " + time
																		return (
																			<tr key={taskID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{taskID}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskTitle}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskDescription}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{taskMode}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px]  text-[#666]"><span>{datetime}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{adminEmail}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>{taskPoints}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>${taskPrice}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]">
																					<div className='flex justify-end gap-2'>
																						<FiEdit3 className='text-[#006de9] cursor-pointer' />
																						<FiTrash className='text-[#ef4444] cursor-pointer' onClick={() => handleDelete(taskID)} />
																					</div>
																				</td>
																			</tr>
																		)
																	})
																	:
																	<tr>
																		<td colSpan="9" className='px-3 py-5 text-center'>
																			<p>No public tasks created yet!</p>
																			<Link href="/admin/create-task" className='font-bold text-[#009de9] underline flex items-center justify-center gap-1'>Create task now <FaArrowRight /></Link>
																		</td>
																	</tr>
															)
															:
															(
																searchedTasks.length >= 1 ?
																	searchedTasks.map(task => {
																		const { taskID, taskTitle, taskDescription, taskMode, createdAt, adminEmail, taskPoints, taskPrice } = task
																		const date = createdAt.slice(0, 10)
																		const time = createdAt.slice(11, 16)
																		const datetime = date + " " + time
																		return (
																			<tr key={taskID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{taskID}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskTitle}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskDescription}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{taskMode}</span></td>
																				<td className="px-6 py-4 whitespace-normal text-[14px]  text-[#666]"><span>{datetime}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{adminEmail}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>{taskPoints}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>${taskPrice}</span></td>
																				<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]">
																					<div className='flex justify-end gap-2'>
																						<FiEdit3 className='text-[#006de9] cursor-pointer' />
																						<FiTrash className='text-[#ef4444] cursor-pointer' onClick={() => handleDelete(taskID)} />
																					</div>
																				</td>
																			</tr>
																		)
																	})
																	:
																	<div className='flex items-center justify-center'>
																		<p className='bg-yellow-100 border-2 border-yellow-200 px-3 py-2 rounded-[5px]'>There are no matching tasks present!</p>
																	</div>
															)
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