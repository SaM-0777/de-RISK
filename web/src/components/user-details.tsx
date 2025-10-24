"use client";

import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import React from 'react'
import { Skeleton } from './ui/skeleton';

export default function UserDetails() {
  const { user } = usePrivy();

  return (
    <div className='w-full flex items-center gap-8 p-8 rounded-2xl border border-[#B09EFC] bg-gradient-to-tr from-white to-[#E9E4FF] mt-8' >
      <Image src={"/pfp.png"} alt='pfp' className='' width={163} height={154} />
      <div className='' >
        <h2 className='text-2xl font-semibold' >Wallet Address</h2>
        {user?.wallet?.address ? (
          <p className='text-lg text-gray-600 mt-0.5 truncate' >{user?.wallet?.address}</p>
        ) : (
            <Skeleton className='w-md h-6 mt-1 bg-purple-300' />
        )}
      </div>
    </div>
  )
}
