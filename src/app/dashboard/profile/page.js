"use client"
import React, { useEffect, useState } from 'react'
import './profile.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { FiEdit } from 'react-icons/fi'
import { PiStudent, PiUser } from "react-icons/pi";
import { useAuthContext } from '@/app/contexts/AuthContext';
import Loader from '@/components/Loader/page'
import axios from 'axios'
import { useRouter } from 'next/navigation'


export default function Profile() {

	const { user, dispatch, handleLogout } = useAuthContext()
	const [profileUser, setProfileUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const handleChange = e => setProfileUser(s => ({ ...s, [e.target.name]: e.target.value }))

	useEffect(() => {
		if (!user.email) {
			return
		}
		setProfileUser({
			...user, withdrawalAccount: user.withdrawalAccount || "jazzcash"
		});
		setLoading(false)
	}, [user])

	const handleUpdateAccount = (userID) => {
		setLoading(true)
		axios.patch(`${process.env.API_LINK}/api/dashboard/profile/update-account?userID=${userID}`, profileUser)
			.then(res => {
				const { status } = res
				if (status === 203) {
					dispatch({ type: "SET_PROFILE", payload: { user: profileUser } })
					alert("Account updated successfully.")
				}
			})
			.catch(err => {
				console.error("User updation error: ", err.message)
				alert("Failed to update account. Please try again later.")
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteAccount = (userID) => {
		setLoading(true)
		axios.delete(`${process.env.API_LINK}/api/dashboard/profile/delete-account?userID=${userID}`)
			.then(res => {
				const { status } = res
				if (status === 203) {
					alert("Account deleted successfully.")
					handleLogout()
					router.push('/')
					router.refresh()
				}
			})
			.catch(err => {
				console.error("User deletion error: ", err.message)
				alert("Failed to delete account. Please try again later.")
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
			<div className='flex justify-center items-center min-h-[calc(100vh-85px)] px-5 py-10'>
				<div className="profile-container w-full max-w-[800px] min-h-[450px] flex bg-[#f2f2f282] rounded-[5px]">
					<div className="profile-left bg-[#6c5ce7] flex flex-col items-center justify-center px-[60px] rounded-[5px]">
						<div className='bg-[#fff] p-5 rounded-full'>
							<span className='text-[80px] text-[#666]'><PiUser /></span>
						</div>
						<p className='text-white mt-5 mb-2'>{user?.username}</p>
						<p className='text-white text-[16px] flex items-center gap-1'><PiStudent /> Student</p>
					</div>
					<div className="profile-right px-[30px] py-[20px] flex flex-col flex-1 justify-between">
						<div>
							<h2 className='font-bold text-[20px] border-b-2 border-neutral-300 pb-2 flex items-center gap-2 mb-5'>Edit Profile <FiEdit /></h2>
							<div className='profile-input'>
								<label htmlFor="username" className='font-bold mb-2'>Username:</label>
								<input type="text" name="username" id="username" value={profileUser?.username} className='w-full p-[10px] rounded-[5px] bg-white mb-4' onChange={handleChange} />
							</div>
							<div className='profile-input'>
								<label htmlFor="email" className='font-bold mb-2'>Email:</label>
								<input type="text" name="email" id="email" value={profileUser?.email} className='w-full p-[10px] rounded-[5px] bg-white mb-4' onChange={handleChange} />
							</div>
							<div className='profile-input'>
								<label htmlFor="withdrawalAccount" className='font-bold mb-2'>Withdrawal Account:</label>
								<select name="withdrawalAccount" id="withdrawalAccount" value={profileUser?.withdrawalAccount} className='w-full p-[10px] font-normal text-[#666] rounded-[5px] bg-white mb-4' onChange={handleChange}>
									<option value="jazzcash" className='text-[#888]'>JazzCash</option>
									<option value="easypaisa" className='text-[#888]'>EasyPaisa</option>
									<option value="banktransfer" className='text-[#888]'>Bank Transfer</option>
								</select>
							</div>
							<div className='profile-input'>
								<label htmlFor="accountNumber" className='font-bold mb-2'>Account Number:</label>
								<input type="text" name="accountNumber" id="accountNumber" value={profileUser?.accountNumber} className='w-full p-[10px] rounded-[5px] bg-white mb-4' onChange={handleChange} />
							</div>
						</div>
						<div className='flex flex-col gap-3 mt-8'>
							<button className='update-btn bg-[#6c5ce7] w-full p-[10px] rounded-[5px] text-white' onClick={() => handleUpdateAccount(profileUser.userID)}>Update Account</button>
							<button className='delete-btn bg-[#ef4444] w-full p-[10px] rounded-[5px] text-white' onClick={() => handleDeleteAccount(profileUser.userID)}>Delete Account</button>
						</div>
					</div>
				</div>
			</div >
		</>
	)
}