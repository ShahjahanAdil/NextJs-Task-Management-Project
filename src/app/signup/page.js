"use client"
import React, { useState } from 'react'
import './auth.css'
import Link from 'next/link'
import axios from 'axios'
import Loader from '@/components/Loader/page'
import { useRouter } from 'next/navigation'

const initialState = { username: "", email: "", password: "" }
const generateRandomID = () => Math.random().toString(36).slice(3)

export default function SignUp() {

	const [state, setState] = useState(initialState)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

	const handleSignUp = async (e) => {
		e.preventDefault()

		const { username, email, password } = state
		if (!username || !email || !password) {
			alert("Please fill all fields!")
			return
		}

		if (username.trim().length < 3) return alert("Username must be at least 3 characters long!")
		if (password.trim().length < 6) return alert("Password must be at least 6 characters long!")

		const newUserData = {
			userID: generateRandomID(),
			username,
			email,
			password,
			roles: ["student"],
			withdrawalAccount: "",
			accountNumber: "",
			points: 0
		}

		setLoading(true)
		await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/signup`, newUserData)
			.then(res => {
				const { status, data } = res
				if (status === 201) {
					alert(data.message)
					router.push('/login')
				}
			})
			.catch(err => {
				const { status, data } = err.response
				console.error('Frontend POST error', err.message)
				if (status === 403) {
					return alert(data.message)
				}
				alert("Something went wrong while creating user!")
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
			<div className="auth-container w-full h-screen flex flex-col justify-center items-center">
				<div className="auth-box w-full max-w-[400px] min-h-[300px] bg-[#e8e8e8] rounded-[5px] p-8">
					<form onSubmit={handleSignUp}>
						<h2 className='text-[24px] font-bold'>Register Account</h2>
						<p className='mb-5'>Create user to continue</p>

						<div>
							<label htmlFor="username" className='font-bold mb-2'>Username:</label>
							<input type="text" name="username" id="username" placeholder='john_paul' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
								value={state.username} onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="email" className='font-bold mb-2'>Email:</label>
							<input type="text" name="email" id="email" placeholder='johnpaul@gmail.com' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
								value={state.email} onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="password" className='font-bold mb-2'>Password:</label>
							<input type="password" name="password" id="password" placeholder='Enter password' className='w-full p-[10px] rounded-[5px] bg-neutral-100 mb-4'
								value={state.password} onChange={handleChange}
							/>
						</div>

						<button className='bg-[#6c5ce7] text-white w-full p-[10px] rounded-[5px] mt-5' onClick={handleSignUp}>SIGNUP</button>

						<p className='text-[#333] text-[16px] mt-4'>Already have an account? <Link href="/login" className='underline text-[#6c5ce7] transition-all hover:text-[#0093E9]'>Login now</Link></p>
					</form>
				</div>
			</div>
		</>
	)
}