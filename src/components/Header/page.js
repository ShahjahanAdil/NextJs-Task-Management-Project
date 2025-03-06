"use client"
import React from 'react'
import Link from 'next/link'
import './header.css'
import { LuLogIn } from "react-icons/lu";
import { LuUserRoundPlus } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaHeadphones } from "react-icons/fa6";
import { AiOutlineDashboard } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import { useAuthContext } from '@/app/contexts/AuthContext';

export default function Header() {

    const { isAuthenticated, user } = useAuthContext()

    return (
        <header>
            <div className="header">
                <div className="h-left">
                    <h2>Parax</h2>
                </div>
                <div className="h-right">
                    <nav>
                        <ul>
                            <li><Link href="/" className='h-link flex items-center gap-1'><FiHome /> Home</Link></li>
                            <li><Link href="/about" className='h-link flex items-center gap-1'><IoIosInformationCircleOutline /> About</Link></li>
                            <li><Link href="/contact" className='h-link flex items-center gap-1'><FaHeadphones /> Contact</Link></li>
                            {
                                isAuthenticated && user.roles.find(role => role.toLowerCase().includes("admin")) &&
                                <li><Link href="/admin" className='h-link flex items-center gap-1'><GrUserAdmin /> Admin</Link></li>
                            }
                            {
                                !isAuthenticated ?
                                    <>
                                        <li><Link href="/signup" className='h-link auth-btn flex items-center gap-1'>SignUp <LuUserRoundPlus /></Link></li>
                                        <li><Link href="/login" className='h-link auth-btn flex items-center gap-1' id='login-btn'>Login <LuLogIn /></Link></li>
                                    </>
                                    :
                                    <li><Link href="/dashboard" className='h-link auth-btn flex items-center gap-1'><AiOutlineDashboard /> Dashboard</Link></li>
                            }
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}