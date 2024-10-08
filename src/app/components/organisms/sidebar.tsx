"use client"
import { Links } from "../molecules/link"
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { Fragment, useCallback, useEffect, useState } from "react";
import Logo from '@/app/assets/image/logo.png'
import toast, { Toaster } from "react-hot-toast";
// import { useContext } from "react";
// import { AppContext } from "@/app/hook/Context";
import { useRouter } from "next/navigation";
import { IoMdLogIn } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
// import { BiSolidExit } from "react-icons/bi";
import Image from "next/image";

export const SideBar = () => {
  // const User = useContext(AppContext)
  const [check, setCheck] = useState<boolean>(false)
  const router = useRouter()
  const HandleLogout = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('log')
      localStorage.setItem('Domain', localStorage.getItem('Domain') as string)
      setCheck(false)
      toast.success('User Logout', { duration: 1000 });
      router.push('/login')
    }
  }, [router])

  const HandleSetup = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.clear()
      setCheck(false)
      router.push('/domain')
    }
  }, [router])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('log')) {
        setCheck(true)
      }
    }
  }, [])


  return (
    <Fragment>
      <Toaster />
      <aside className="w-[300px] h-screen md:flex flex-col items-start justify-between shadow-xl relative hidden">
        <div className="w-full">
          <div className="flex items-center mb-5 gap-2 bg-[#613EEA] justify-center text-white font-semibold shadow-md py-3">
            <Image src={Logo} alt="ScanHadir" width={30} height={30} />
            <h1>Administrator ScanHadir</h1>
          </div>
          <div className="px-10">
            {
              check ?
                <div className="flex flex-col gap-5">
                  <Links href="/users" className="flex items-center"><LuUsers2 className="text-2xl mr-1 text-[#613EEA]" />Users</Links>
                  <Links href="/newuser" className="flex items-center"><AiOutlineUserAdd className="text-2xl mr-1 text-[#613EEA]" />New Member</Links>
                </div>
                :
                <p>Masuk Sebagi Admin untuk melanjutkan</p>
            }
          </div>
        </div>
        <div className="mx-auto">
          {
            check &&
            <div className="flex flex-col gap-5">
              <Links href="/domain" className="flex  w-max py-2 px-5 rounded-lg items-center"><MdOutlineWifiProtectedSetup className="text-2xl mr-1 text-[#9a9c9a]" />Atur ulang Domain</Links>
              <button onClick={HandleSetup} className=" w-max py-2 px-5 rounded-lg flex items-center"><BiReset className="text-2xl mr-1 text-[#9a9c9a]" />Atur Ulang Configurasi</button>
            </div>
          }
          {
            check ?
              <button onClick={HandleLogout} className=" w-max py-2 px-5 rounded-lg my-5 flex items-center"><MdLogout className="text-2xl mr-1 text-[#9a9c9a]" />Keluar Sebagai Admin</button>
              :
              <Links href="/login" className="my-5 flex items-center"><IoMdLogIn className="text-2xl mr-1 text-[#9a9c9a]" />Masuk</Links>
          }
        </div>

      </aside>
    </Fragment>
  )
}