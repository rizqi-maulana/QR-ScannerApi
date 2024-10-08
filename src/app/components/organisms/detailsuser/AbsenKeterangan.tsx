"use client"

import { FetchUser } from "@/app/hook/FetchUser";
import { IoCloseCircle } from "react-icons/io5";
import { useEffect, useState, useContext } from "react"
import { AppContext } from "@/app/hook/Context";

interface Absensi {
  date: string;
  time: string;
  status: string;
}
export const AbsenKeterangan = ({ logginType }: { logginType: string }) => {
  const [Data, setData] = useState<Absensi[]>([])
  const [SearchFilter, setSearchFilter] = useState<string>('')
  const Context = useContext(AppContext)
  useEffect(() => {
    FetchUser(logginType, Context?.Domain as string).then((data) => {
      const filteredData = data.absensi.filter((item: Absensi) => {
        return item.date.includes(SearchFilter)
      })
      setData(filteredData)
    })
  }, [SearchFilter, logginType, Context?.Domain])
  return (
    <div className="h-screen w-full flex items-center bg-black/40 fixed top-0 left-0">
      <div className="w-[700px] h-max grid gap-5  rounded-xl shadow-xl mx-auto bg-white p-5">

        <div className="flex justify-between">
          <h1>Data Absensi Dari <span className="font-bold">{logginType}</span></h1>
          <IoCloseCircle className="text-2xl cursor-pointer text-red-500" onClick={() => Context?.setShowAbsen(false)} />
        </div>
        <div className="flex gap-5 button-hari">
          <button onClick={() => setSearchFilter('')}>All</button>
          <button onClick={() => setSearchFilter('Senin')}>Senin</button>
          <button onClick={() => setSearchFilter('Selasa')}>Selasa</button>
          <button onClick={() => setSearchFilter('Rabu')}>Rabu</button>
          <button onClick={() => setSearchFilter('Kamis')}>Kamis</button>
          <button onClick={() => setSearchFilter('Jumat')}>Jumat</button>
          <button onClick={() => setSearchFilter('Sabtu')}>Sabtu</button>
        </div>

        {
          Data.length === 0 ? <p>Tidak ada data</p> :
            Data.map((data: Absensi, index: number) => (
              <div key={index}>
                <p>{data.date}</p>
                <p>{data.time}</p>
                <p>{data.status}</p>
                <hr />
              </div>
            ))
        }
      </div>
    </div>
  )
}