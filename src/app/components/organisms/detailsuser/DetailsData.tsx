import Image from 'next/image';
import { QRCode } from 'react-qrcode-logo';
import { useCallback, useContext } from "react";
import { AppContext } from '@/app/hook/Context';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface DetailsInfoProps {
  TypeValue: string
  email: string
  no_hp: string
  alamat: string
  image: string
  SelectData: string,
  token: string,
  Nama: string
}

export const DetailsData = ({ TypeValue, email, no_hp, alamat, image, SelectData, token, Nama }: DetailsInfoProps) => {
  const code = token;
  const router = useRouter()
  const Datas = useContext(AppContext)
  const handleDelete = useCallback(async () => {
    const res = await fetch(`https://${Datas?.Domain}/user/DeleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TypeValue }),
    });
    const data = await res.json();
    if (data.status === 200) {
      Datas?.setChange(prev => prev + 1);
      toast.success(data.message, {
        duration: 1000,
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      toast.error('Failed to delete user');
    }
  }, [TypeValue, Datas, router]);

  const HandleEdit = useCallback(async (eq: string) => {
    router.push({
      hostname: "/updateuser",
      query: { eq },
    })
  }, [router])

  return (
    <div className="flex flex-col items-center mb-10">
      <Toaster />
      <div className="flex flex-col md:flex-row items-center justify-evenly text-[#5F5F5F] gap-10 md:gap-56">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <Image src={`https://${Datas?.Domain}/UserData/Profile/${image}`} className="md:rounded-lg rounded-full h-[200px] md:h-auto object-cover md:object-contain" alt="Profile" width={200} height={200} sizes="100vw" />
          <div className="flex flex-col gap-3">
            <p><b>{Datas?.Config?.userLoggin?.label}:</b> {TypeValue}</p>
            <p><b>Nama:</b> {Nama}</p>
            <p><b>Jabatan:</b> {SelectData}</p>
            <p><b>No:</b> {no_hp}</p>
            <p><b>Alamat:</b> {alamat}</p>
            <p><b>Email:</b> {email}</p>
            <div className="flex items-center gap-2 mt-5">
              <button onClick={() => HandleEdit(TypeValue)} className='text-sm text-center w-max py-[2px] font-bold px-2 rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-[#624D00] bg-[#FFE380]'>Edit</button>
              <button onClick={handleDelete} className="text-sm w-max py-[2px] font-bold px-2 rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-[#720000] bg-[#FF9E7F]">Hapus</button>
              <button onClick={() => Datas?.setShowAbsen(true)} className="text-sm w-max py-[2px] font-bold px-2 rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-black bg-[#7fd6ff]">Check Keterangan</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center font-bold">
          <h3>QR Terdaftar</h3>
          <QRCode bgColor='#fff' logoWidth={50} value={code} />
        </div>
      </div>
    </div>
  )
}