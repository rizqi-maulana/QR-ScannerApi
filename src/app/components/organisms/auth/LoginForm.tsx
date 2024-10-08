"use client"

import { Input } from "../../molecules/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from 'react-hot-toast';
import { useContext } from "react"
import { AppContext } from "@/app/hook/Context"

export const FormLogin = () => {

  const context = useContext(AppContext)
  if (!context) {
    throw new Error("AppContext is not available");
  }
  const router = useRouter()
  const [logginType, setlogginType] = useState<string>("")
  const [Password, setPassword] = useState<string>("")


  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(context.Config?.userLoggin?.label)
    const res = await fetch(`https://${context.Domain}/user/validateUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [context.Config?.userLoggin?.label || "TypeValue"]: logginType, password: Password }),
    });
    const data = await res.json()
    if (data.auth === context.Config?.admin.Username) {
      if (typeof window !== "undefined") {
        localStorage.setItem('adm_ac', data.adm_ac);
        localStorage.setItem('user', data.user);
        toast.success('Login Berhasil', { duration: 1000 });
        localStorage.setItem('log', 'true')
        context.setAccess(true)
        router.push('/users')
        router.refresh()
      }
    }
    if (data.auth === "failed") {
      toast.error('Login Gagal', { duration: 1000 });
    }

    if (data.error)
      toast.error(data.error)
  }

  return (
    <>
      <Toaster />
      <form onSubmit={HandleSubmit} className="bg-white shadow-xl w-[370px] h-[350px] rounded-xl py-3 px-5 flex justify-center flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#000000]/70">Masuk</h1>
          <p className="text-sm text-[#131313]/70">Tetap terupdate dengan dunia profesional Anda</p>
        </div>
        <div className="grid gap-3">
          <Input type="text" Placeholder="Username" className="border border-[#8F8F8F]" onChange={({ target }) => setlogginType(target.value)} />
          <Input type="password" Placeholder="Password" className="border border-[#8F8F8F]" onChange={({ target }) => setPassword(target.value)} />
          <button type="submit" className="bg-[#613EEA] text-white w-full h-[40px] rounded-full">Masuk</button>
        </div>
      </form>
    </>
  )
}