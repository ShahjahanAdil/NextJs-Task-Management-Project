"use client"
import React, { useEffect, useState } from 'react'
import './admin.css'
import AdminHeader from '@/components/AdminHeader/page'
import { useAuthContext } from '../contexts/AuthContext'
import Loader from '@/components/Loader/page'
import { FaTrophy } from 'react-icons/fa6'
import axios from 'axios'

export default function Admin() {

	const { isAuthenticated, user } = useAuthContext()
	const [topUsers, setTopUsers] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isAuthenticated && user.userID) {
			fetchTopUsers()
		}
	}, [isAuthenticated, user])

	const fetchTopUsers = () => {
		setLoading(true)
		axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/admin/fetch-top-users`)
			.then(res => {
				const { status, data } = res
				if (status === 200) {
					setTopUsers(data?.users || [])
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
			<AdminHeader />
			<div className="admin-container">
				<div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
					<h1 className='text-[40px] text-[#6c5ce7] mb-5 flex items-center gap-2 border-b-2'><FaTrophy /> Top Performers</h1>
					<div className='flex gap-5 w-full h-[350px] mt-10'>
						<div className='top-box-1 box-shadow px-[30px] py-[20px] rounded-[5px] relative flex-1'>
							<p className='w-[60%] text-[#f3f3f3] text-[5rem] leading-none'>{topUsers[0]?.username}</p>
							<p className='grad absolute left-[30px] bottom-[20px] text-[#f3f3f3] bg-[#666] px-2 rounded-[10px]'>Points: {topUsers[0]?.points.toFixed(2)}</p>
							<p className='absolute right-[30px] bottom-[20px] leading-none text-[9rem] text-[#f3f3f3] font-bold'>1</p>
						</div>
						<div className='flex flex-col flex-1 gap-5'>
							<div className='top-box-2 box-shadow px-[30px] py-[20px] rounded-[5px] relative flex-1 h-full'>
								<p className='w-[80%] text-[#f3f3f3] text-[3rem] leading-none'>{topUsers[1]?.username}</p>
								<p className='grad absolute left-[30px] bottom-[20px] text-[#f3f3f3] text-[16px] bg-[#666] px-2 rounded-[10px]'>Points: {topUsers[1]?.points.toFixed(2)}</p>
								<p className='absolute right-[30px] bottom-[20px] leading-none text-[4.5rem] text-[#f3f3f3] font-bold'>2</p>
							</div>
							<div className='top-box-3 box-shadow px-[30px] py-[20px] rounded-[5px] relative flex-1 h-full'>
								<p className='w-[80%] text-[#f3f3f3] text-[3rem] leading-none'>{topUsers[2]?.username}</p>
								<p className='grad absolute left-[30px] bottom-[20px] text-[#f3f3f3] text-[16px] bg-[#666] px-2 rounded-[10px]'>Points: {topUsers[2]?.points.toFixed(2)}</p>
								<p className='absolute right-[30px] bottom-[20px] leading-none text-[4.5rem] text-[#f3f3f3] font-bold'>3</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}