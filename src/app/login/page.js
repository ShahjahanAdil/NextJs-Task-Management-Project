"use client"
import React, { useState } from 'react'
import './auth.css'
import Link from 'next/link'
import Loader from '@/components/Loader/page'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useAuthContext } from '../contexts/AuthContext'

const initialState = { email: "", password: "" }

export default function Login() {

	const { dispatch } = useAuthContext()
	const [state, setState] = useState(initialState)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

	const handleLogin = e => {
		e.preventDefault()

		const { email, password } = state
		if (!email || !password) {
			return alert("Please fill all fields!")
		}

		setLoading(true)
		axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, { email, password })
			.then(res => {
				const { status, data } = res
				if (status === 200) {
					Cookies.set("jwtTask", data.token, { expires: 7, secure: true })
					dispatch({ type: "SET_LOGGED_IN", payload: { user: data.user } })
					router.push('/')
				}
			})
			.catch(err => {
				console.error('Frontend POST error', err.message)
				Cookies.remove("jwtTask")
				alert("Something went wrong while logging in!")
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
					<form onSubmit={handleLogin}>
						<h2 className='text-[22px] font-bold'>Login Account</h2>
						<p className='mb-5'>Login to continue session</p>

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

						<button className='bg-[#6c5ce7] text-white w-full p-[10px] rounded-[5px] mt-5' onClick={handleLogin}>LOGIN</button>

						<p className='text-[#333] text-[16px] mt-4'>Don't have an account? <Link href="/signup" className='underline text-[#6c5ce7] transition-all hover:text-[#0093E9]'>Register now</Link></p>
					</form>
				</div>
			</div>
		</>
	)
}