"use client"
import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header/page'
import Image from 'next/image'
import heroImg from '../assets/images/heroImg.png'
import Footer from '@/components/Footer/page'
import { IoMdArrowForward } from "react-icons/io";
import Loader from '@/components/Loader/page'
import { useAuthContext } from './contexts/AuthContext'

export default function page() {

	const { loading } = useAuthContext()

	if (loading) {
		return <Loader />
	}

	return (
		<>
			<Header />
			<main>
				<div className="my-container">
					<div className="hero-section">
						<div className="hero-left">
							<h2 className='text-[30px] text-[#333] font-bold'>Parax Task Management Tool</h2>
							<p className='text-[20px] text-[#666]'>Manage, assign and complete your tasks. Work here together and build your projects in a systematic way.</p>
							<Link href="/" className='hero-btn flex items-center gap-2 w-fit text-[18px]'>Learn More <IoMdArrowForward /></Link>
						</div>
						<div className="hero-right">
							<Image src={heroImg} className='hero-img' alt='hero-img' />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}