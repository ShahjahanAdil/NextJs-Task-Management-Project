"use client"
import React, { useCallback, useEffect, useState } from 'react'
import '../admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { useAuthContext } from '@/app/contexts/AuthContext'
import { AiOutlineDashboard } from 'react-icons/ai'
import TableLoader from '@/components/TableLoader/page'
import axios from 'axios'

export default function Payments() {

	const { user } = useAuthContext()
	const [withdraws, setWithdraws] = useState([])
	const [acceptID, setAcceptID] = useState("")
	const [rejectID, setRejectID] = useState("")
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [acceptLoading, setAcceptLoading] = useState(false)
	const [rejectLoading, setRejectLoading] = useState(false)

	useEffect(() => {
		if (user.userID) {
			fetchWithdraws(page)
		}
	}, [user, page])

	const fetchWithdraws = useCallback((page) => {
		setLoading(true)
		axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/admin/payments?page=${page}`)
			.then(res => {
				const { status, data } = res
				if (status === 200) {
					setWithdraws(data?.totalUserWithdraws)
					setTotalPages(Math.ceil(data?.totalWithdraws / 15))
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
				alert(err.response?.data?.message || 'An error occurred')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const handleAcceptWithdraw = (withdrawID, userID, withdrawAmount) => {
		setAcceptLoading(true)
		setAcceptID(withdrawID)
		axios.patch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/payments/accept?withdrawID=${withdrawID}&userID=${userID}&withdrawAmount=${withdrawAmount}`)
			.then(res => {
				const { status, data } = res
				if (status === 202) {
					const updatedWithdraws = withdraws.map(withdraw =>
						withdraw.withdrawID === withdrawID ? { ...withdraw, withdrawStatus: "completed" } : withdraw
					)
					setWithdraws(updatedWithdraws)
				}
				alert(data.message)
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
				alert(err.response.data.message)
			})
			.finally(() => {
				setAcceptLoading(false)
				setAcceptID("")
			})
	}

	const handleRejectWithdraw = (withdrawID, userID, withdrawAmount) => {
		setRejectLoading(true)
		setRejectID(withdrawID)
		axios.patch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/payments/reject?withdrawID=${withdrawID}&userID=${userID}&withdrawAmount=${withdrawAmount}`)
			.then(res => {
				const { status, data } = res
				if (status === 202) {
					const updatedWithdraws = withdraws.map(withdraw =>
						withdraw.withdrawID === withdrawID ? { ...withdraw, withdrawStatus: "cancelled" } : withdraw
					)
					setWithdraws(updatedWithdraws)
				}
				alert(data.message)
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
				alert(err.response.data.message)
			})
			.finally(() => {
				setRejectLoading(false)
				setRejectID("")
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
				<div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
					<div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
						<h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
							<span className='text-[22px]'><AiOutlineDashboard /></span> Dashboard
							<span className='text-[20px] text-[#666]'>/ Payments</span>
						</h2>
					</div>

					<div className="table-div flex flex-col mt-12 border px-5 rounded-[5px]">
						<div className="-m-1.5 overflow-x-auto">
							<div className="p-1.5 min-w-full inline-block align-middle">
								<div className="overflow-hidden">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">TID</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Requested From</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Requested On</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Status</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Withdrawal Method</th>
												<th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Withdrawal Account</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Amount</th>
												<th scope="col" className="px-6 py-3 text-end text-[13px] font-bold text-[#6c5ce7] uppercase">Actions</th>
											</tr>
										</thead>
										<tbody>
											{
												loading ?
													<TableLoader />
													:
													(
														withdraws.length > 0 ?
															withdraws.map(withdraw => {
																const { withdrawID, userID, userEmail, createdAt, withdrawStatus, withdrawAmount, withdrawalAccount, withdrawalAccountNumber } = withdraw
																const date = createdAt?.slice(0, 10)
																const time = createdAt?.slice(11, 16)
																const datetime = date + " " + time
																return (
																	<tr key={withdrawID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawID}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{userEmail}</span></td>
																		<td className="px-6 py-4 whitespace-normal text-[14px]  text-[#666]"><span>{datetime}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawStatus}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawalAccount}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawalAccountNumber}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>${withdrawAmount}</span></td>
																		<td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666] flex gap-2">
																			<button className='bg-[#ef4444] text-white font-bold p-2 rounded-[5px] shadow-md transition-all duration-300 ease-out hover:bg-[#333]' disabled={rejectLoading} onClick={() => handleRejectWithdraw(withdrawID, userID, withdrawAmount)}>
																				{
																					!rejectLoading ?
																						"Reject" :
																						(
																							rejectID === withdrawID &&
																							"Rejecting..."
																						)

																				}
																			</button>
																			<button className='bg-[#32d445] text-white font-bold p-2 rounded-[5px] shadow-md transition-all duration-300 ease-out hover:bg-[#333]' disabled={acceptLoading} onClick={() => handleAcceptWithdraw(withdrawID, userID, withdrawAmount)}>
																				{
																					!acceptLoading ?
																						"Accept" :
																						"Accepting..."
																				}
																			</button>
																		</td>
																	</tr>
																)
															})
															:
															<tr>
																<td colSpan="9" className='px-3 py-5 text-center'>
																	<p>No withdraw request has been created yet!</p>
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