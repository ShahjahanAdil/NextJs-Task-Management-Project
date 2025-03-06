"use client"
import React, { useEffect, useState } from 'react'
import '../dashboard.css'
import './payments.css'
import DashboardHeader from '@/components/DashboardHeader/page'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FaWallet } from 'react-icons/fa6'
import { PiClockFill, PiCurrencyDollarFill } from 'react-icons/pi'
import { LuInfo } from 'react-icons/lu'
import { useAuthContext } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import axios from 'axios'
import TableLoader from '@/components/TableLoader/page'

const generateRandomID = () => Math.random().toString(16).slice(9)

export default function Notifications() {

    const { user } = useAuthContext()
    const [userAccount, setUserAccount] = useState({})
    const [withdraws, setWithdraws] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [withdrawLoading, setWithdrawLoading] = useState(false)

    useEffect(() => {
        if (user.userID) {
            fetchUserAccount()
        }
    }, [user])

    useEffect(() => {
        if (user.userID) {
            fetchWithdraws(page)
        }
    }, [user, page])

    const fetchUserAccount = () => {
        setLoading(true)
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/payments?userID=${user?.userID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setUserAccount(data?.userAccountDets)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchWithdraws = (page) => {
        setLoading(true)
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/payments/withdraws?userID=${user?.userID}&page${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setWithdraws(data?.userWithdraws)
                    setTotalPages(Math.ceil(data?.totalWithdraws / 10))
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleWithdraw = () => {
        if (!user?.withdrawalAccount || !user?.accountNumber) {
            return alert("Please select a withdrawal method first!")
        }

        const withdrawAmount = parseFloat(userAccount.availableBalance);
        if (withdrawAmount <= 0) {
            return alert("Insufficient available balance!");
        }

        const newWithdraw = {
            withdrawID: generateRandomID(),
            userID: user.userID,
            userEmail: user.email,
            withdrawStatus: "pending",
            withdrawAmount,
            withdrawalAccount: user.withdrawalAccount,
            withdrawalAccountNumber: user.accountNumber
        }

        setWithdrawLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/dashboard/payments`, newWithdraw)
            .then(res => {
                const { status, data } = res
                if (status === 201) {
                    setUserAccount(prev => ({
                        ...prev,
                        availableBalance: "0",
                        pendingAmount: (withdrawAmount + parseFloat(prev?.pendingAmount || "0")).toString()
                    }))
                    setWithdraws(prev => ([
                        ...prev,
                        newWithdraw
                    ]))
                    alert(data.message)
                }
            })
            .catch(err => {
                console.error('Frontend POST error', err.message)
                alert(err.response.data.message)
            })
            .finally(() => {
                setWithdrawLoading(false)
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
            <DashboardHeader />
            <div className="dashboard-container">
                <div className="w-full min-h-[calc(100vh-85px)] px-5 py-12">
                    <div className='nav-banner bg-[#f3f6ff] p-3 rounded-[5px]'>
                        <h2 className='font-bold text-[20px] text-[#333] flex items-center gap-2'>
                            <span className='text-[22px]'><AiOutlineDashboard /></span> Dashboard
                            <span className='text-[20px] text-[#666]'>/ Payments</span>
                        </h2>
                    </div>

                    <div className='flex justify-between gap-5 mt-10'>
                        <div className='amount-div flex flex-col items-center justify-center gap-2 border rounded-[5px]'>
                            <p className='flex items-center gap-2'><FaWallet className='text-[#6c5ce7]' /> Avaiable Balance</p>
                            {
                                loading ?
                                    <div className='p-2 bg-neutral-200 w-20 rounded-[5px] animate-pulse'></div>
                                    :
                                    <p className='font-medium'>${parseFloat(userAccount?.availableBalance).toFixed(2)}</p>
                            }
                        </div>
                        <div className='amount-div flex flex-col items-center justify-center gap-2 border rounded-[5px]'>
                            <p className='flex items-center gap-2'><PiClockFill className='text-[#f7c348]' /> Pending Withdraw</p>
                            {
                                loading ?
                                    <div className='p-2 bg-neutral-200 w-20 rounded-[5px] animate-pulse'></div>
                                    :
                                    <p className='font-medium'>${parseFloat(userAccount?.pendingAmount).toFixed(2)}</p>
                            }
                        </div>
                        <div className='amount-div flex flex-col items-center justify-center gap-2 border rounded-[5px]'>
                            <p className='flex items-center gap-2'><PiCurrencyDollarFill className='text-[#32e149]' /> Total Withdrawal</p>
                            {
                                loading ?
                                    <div className='p-2 bg-neutral-200 w-20 rounded-[5px] animate-pulse'></div>
                                    :
                                    <p className='font-medium'>${parseFloat(userAccount?.totalWithdrawal).toFixed(2)}</p>
                            }
                        </div>
                    </div>

                    <div className='mt-10'>
                        {
                            user.withdrawalAccount ?
                                <>
                                    <p className='mb-2 flex gap-2 items-center'><LuInfo className='text-[#0093e9]' /> Your withdrawal account information:</p>
                                    <p className='text-[16px]'>Withdrawal Account: <span className=' text-[#666] capitalize'>{user?.withdrawalAccount}</span></p>
                                    <p className='text-[16px]'>Account Number: <span className='text-[16px] text-[#666]'>{user?.accountNumber}</span></p>
                                </> :
                                <>
                                    <p className='flex gap-2 items-center'><LuInfo className='text-[#ef4444]' /> You didn't set your withdrawal account yet. Choose <Link href="/dashboard/profile" className='text-[#6c5ce7]'>withdrawal method</Link> before requesting a withdraw.</p>
                                </>
                        }
                    </div>

                    <div className='border-b mt-8 pb-8'>
                        <button className='bg-[#2cd75f] text-[#fff] w-full p-3 rounded-[5px] shadow-lg transition-all duration-300 ease-out hover:bg-[#333]' onClick={handleWithdraw}>
                            {
                                !withdrawLoading ?
                                    "Withdraw" :
                                    "Withdrawing..."
                            }
                        </button>
                    </div>

                    <div className="table-div flex flex-col mt-12 border px-5 rounded-[5px]">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">TID</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Date</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Status</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase">Amount</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Withdrawal Method</th>
                                                <th scope="col" className="px-6 py-3 text-start text-[13px] font-bold text-[#6c5ce7] uppercase whitespace-nowrap">Withdrawal Account</th>
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
                                                                const { withdrawID, createdAt, withdrawStatus, withdrawAmount, withdrawalAccount, withdrawalAccountNumber } = withdraw
                                                                const date = createdAt?.slice(0, 10)
                                                                const time = createdAt?.slice(11, 16)
                                                                const datetime = date + " " + time
                                                                return (
                                                                    <tr key={withdrawID} className="odd:bg-white even:bg-[#f3f6ff] hover:bg-[#f3f6ff]">
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawID}</span></td>
                                                                        <td className="px-6 py-4 whitespace-normal text-[14px]  text-[#666]"><span>{datetime}</span></td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawStatus}</span></td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>${withdrawAmount}</span></td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawalAccount}</span></td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]  text-[#666]"><span>{withdrawalAccountNumber}</span></td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="9" className='px-3 py-5 text-center'>
                                                                    <p>No withdraw request created yet!</p>
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

                    <div className='mt-8'>
                        <p className='mb-2 flex gap-2 items-center'><LuInfo className='text-[#0093e9]' /> Status Info:</p>
                        <ul>
                            <li className='flex gap-2 items-center'>
                                <p className='text-[16px]'>Pending:</p>
                                <p className='text-[16px] text-[#666] font-normal'>Your request is being reviewed by the admin</p>
                            </li>
                            <li className='flex gap-2 items-center'>
                                <p className='text-[16px]'>Completed:</p>
                                <p className='text-[16px] text-[#666] font-normal'>Your withdrawal has been sent to your account</p>
                            </li>
                            <li className='flex gap-2 items-center'>
                                <p className='text-[16px]'>Cancelled:</p>
                                <p className='text-[16px] text-[#666] font-normal'>Your request has been cancelled by the admin</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}