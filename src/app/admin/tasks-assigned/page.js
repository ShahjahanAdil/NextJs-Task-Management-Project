"use client"
import React, { useEffect, useState } from 'react'
import '../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import Link from 'next/link'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FiEdit3, FiTrash } from 'react-icons/fi'
import { FaArrowRight } from 'react-icons/fa6'
import TableLoader from '@/components/TableLoader/page'
import axios from 'axios'

export default function TasksAssigned() {

	const [allAssignedTasks, setAllAssignedTasks] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		axios.get(`${process.env.API_LINK}/api/admin/tasks-assigned`)
			.then(res => {
				const { status, data } = res
				if (status === 200) {
					setAllAssignedTasks(data?.assignedTs)
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return (
		<>
			<AdminHeader />
			<div className="admin-container">
				<div className="w-full min-h-[calc(100vh-85px)] px-5 pt-12 pb-16">
					<div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
						<h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
							<span className='text-[22px]'><AiOutlineDashboard /></span> Admin Panel
							<span className='text-[20px] text-[#666]'>/ Tasks Assigned</span>
						</h2>
					</div>

					<div className="table-div flex flex-col mt-10 border px-5 rounded-[5px]">
						<div className="-m-1.5 overflow-x-auto">
							<div className="p-1.5 min-w-full inline-block align-middle">
								<div className="overflow-hidden">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">ID</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Assigned To</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Title</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Description</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Mode</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Created At</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Created By</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Points</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Price</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Actions</th>
											</tr>
										</thead>
										<tbody>
											{
												loading ?
													<TableLoader value={"10"} />
													:
													(
														allAssignedTasks.length > 0 ?
															(
																allAssignedTasks.map((task, i) => {
																	const { taskID, taskTitle, taskDescription, taskMode, createdAt, userEmail, adminEmail, taskPoints, taskPrice } = task
																	const date = createdAt?.slice(0, 10)
																	const time = createdAt?.slice(11, 16)
																	const datetime = date + " " + time
																	return (
																		<tr key={taskID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
																			<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{i + 1}</span></td>
																			<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span>{userEmail}</span></td>
																			<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskTitle}</span></td>
																			<td className="px-6 py-4 whitespace-normal text-[14px] font-bold  text-[#666]"><span className='text-ellipsis line-clamp-2'>{taskDescription}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{taskMode}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{datetime}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-end text-[14px]  text-[#666]"><span>{adminEmail}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>{taskPoints}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]"><span>${taskPrice}</span></td>
																			<td className="px-6 py-4 whitespace-nowrap text-end text-[14px] text-[#666]">
																				<div className='flex justify-end gap-2'>
																					<FiEdit3 className='text-[#006de9] cursor-pointer' />
																					<FiTrash className='text-[#ef4444] cursor-pointer' />
																				</div>
																			</td>
																		</tr>
																	)
																})
															)
															:
															<tr>
																<td colSpan="10" className='px-3 py-5 text-center'>
																	<p>No tasks assigned yet!</p>
																	<Link href="/admin/assign-task" className='font-bold text-[#009de9] underline flex items-center justify-center gap-1'>Assign task now <FaArrowRight /></Link>
																</td>
															</tr>
													)
											}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}