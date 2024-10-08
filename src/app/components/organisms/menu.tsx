import { useCallback, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from "@/app/hook/Context";

export const Menu = ({ logginType, setChange }: { logginType: string, setChange: React.Dispatch<React.SetStateAction<number>> }) => {
  const Datas = useContext(AppContext)
  const handleDelete = useCallback(async () => {
    // const formdata = new FormData()
    // formdata.append('logginType', logginType)
    const res = await fetch(`https://${Datas?.Domain}/user/DeleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ logginType })
    })
    const data = await res.json()
    if (data.status === 200) {
      setChange(prev => prev + 1)
      toast.success(data.message)
    } else {
      toast.error('Failed to delete user')
    }
  }, [setChange, logginType, Datas?.Domain])

  return (
    <>
      <Toaster />
      <div className={`flex flex-col absolute gap-2 rounded-lg shadow-md bg-white h-max p-5 top-1 -left-28`}>
        <button className="flex items-center"><MdAutorenew /> Update</button>
        <button onClick={handleDelete} className="flex items-center text-red-500"><MdDelete /> Delete</button>
      </div>
    </>
  )
}