"use client"
import HeaderSection from '@/components/home/public/header'
import { useGetMe } from '@/hooks/auth.hook'
import React from 'react'

function home() {
  const {data, isLoading} = useGetMe()
  console.log(data?.data)
  return (
    <div>
      <HeaderSection/>
    </div>
  )
}

export default home