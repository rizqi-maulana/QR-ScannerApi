"use client"
import { grid } from 'ldrs'
import { useEffect, useState } from 'react'

interface Props {
  duration?: number,
  Show?: boolean
}

export const Loading = ({ duration = 0, Show }: Props) => {
  const [ShowLoading, setShowLoading] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Jalankan hanya di browser
      grid.register()
    }
  }, [])

  useEffect(() => {
    if (duration !== 0) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  return (
    <div className={`w-full h-full fixed flex items-center justify-center bg-white z-50 ${duration !== 0 ? ShowLoading ? '' : 'hidden' : Show ? '' : 'hidden'}`}>
      <l-grid
        size="60"
        speed="1.5"
        color="black"
      ></l-grid>
    </div>
  )
}
