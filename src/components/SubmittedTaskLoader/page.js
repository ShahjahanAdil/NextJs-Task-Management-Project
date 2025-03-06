import React from 'react'
import './submittedtaskloader.css'
import { FaUserCheck } from 'react-icons/fa6'
import { AiFillInfoCircle } from 'react-icons/ai'

export default function SubmittedTaskLoader() {
    return (
        <>
            <div className='flex-1'>
                <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                <p className='mt-3 text-[#333]'>Description:</p>
                <div className='load-anim w-full p-3 mt-3 bg-neutral-200 rounded-[5px]'></div>
            </div>
            <div className='w-[400px] min-h-[300px] p-[20px] border shadow-md rounded-[5px]'>
                <h2 className='text-[20px] border-b-2 pb-1 flex items-center gap-2'><FaUserCheck /> User provided data:</h2>
                <div className='flex flex-col gap-2 pt-5'>
                    <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                    <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                    <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                </div>
                <div className='bg-neutral-100 w-full py-2 px-3 mt-5 shadow-md border rounded-[5px]'>
                    <p className='flex items-center gap-1 mb-2 border-b-2'><AiFillInfoCircle /> Info</p>
                    <div className='flex flex-col gap-2'>
                        <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                        <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                        <div className='load-anim w-[75%] p-3 bg-neutral-200 rounded-[5px]'></div>
                    </div>
                </div>
                <div className='flex gap-2 mt-5'>
                    <button className='flex-1 text-[#fff] bg-[#6c5ce7] p-3 rounded-[50px] shadow-md transition-all duration-300 hover:bg-[#009de9]'>Accept</button>
                    <button className='flex-1 text-[#fff] bg-[#ef4444] p-3 rounded-[50px] shadow-md transition-all duration-300 hover:bg-[#d33939]'>Reject</button>
                </div>
            </div>
        </>
    )
}