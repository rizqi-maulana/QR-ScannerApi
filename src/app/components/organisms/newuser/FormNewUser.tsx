"use client"

import { Input } from "../../molecules/input"
import { Selection } from "../../molecules/selection";
import { useState, useContext } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { IoCloudUpload } from "react-icons/io5";
import Image from "next/image";
import { AppContext } from "@/app/hook/Context";

export const FormNewUser = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("AppContext is not available");
  }
  const [logginType, setlogginType] = useState<string>("")
  const [NamaDepan, setNamaDepan] = useState<string>("")
  const [NamaBelakang, setNamaBelakang] = useState<string>("")
  const [Password, setPassword] = useState<string>("")
  const [Alamat, setAlamat] = useState<string>("")
  const [NoHp, setNoHp] = useState<string>("")
  const [Email, setEmail] = useState<string>("")
  const [SelectData, setSelectData] = useState<string>(context.Config?.RegisterOptions[0] as string)
  const [ImageFile, setImageFile] = useState<File | null>(null)

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mengonversi gambar ke Base64
    let base64Image = "";
    if (ImageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(ImageFile);
      reader.onloadend = async () => {
        base64Image = reader.result as string; // mendapatkan data Base64

        // Mengirim data ke server
        const res = await fetch(`https://${context.Domain}/user/CreateUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            [context.Config?.userLoggin?.label || "TypeValue"]: logginType,
            nama_depan: NamaDepan,
            nama_belakang: NamaBelakang,
            password: Password,
            no_hp: NoHp,
            alamat: Alamat,
            email: Email,
            SelectData: SelectData,
            image: base64Image // kirim gambar sebagai Base64
          })
        });

        const data = await res.json();
        if (data.status === 200) {
          toast.success(data.message);
          // Reset form fields
          setlogginType("");
          setNamaDepan("");
          setNamaBelakang("");
          setPassword("");
          setNoHp("");
          setAlamat("");
          setEmail("");
          setSelectData(context.Config?.RegisterOptions[0] as string);
          setImageFile(null);
        } else {
          toast.error(data.message);
        }
      };
    }
  }


  return (
    <>
      <Toaster />
      <form onSubmit={HandleSubmit} className="bg-white shadow-xl w-[370px] h-max rounded-xl py-3 px-5 flex justify-center flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#000000]/70">Daftar</h1>
          <p className="text-sm text-[#131313]/70">Tambahkan Anggota Baru</p>
        </div>
        <div className="grid gap-3">

          <label htmlFor="image" className="flex items-center justify-center border border-dashed py-2 border-black gap-2">
            {
              ImageFile ?
                <Image src={ImageFile && URL.createObjectURL(ImageFile)} width={30} height={30} alt="Profile" sizes="100vw" className="object-contain" /> :
                <IoCloudUpload className="text-3xl" />
            }
            {ImageFile ? ImageFile.name : "Upload Image"}</label>
          <input required id="image" type="file" accept="image/*" onChange={({ target }) => setImageFile(target.files?.[0] || null)} className="hidden" />
          <Input value={logginType} required={true} type="text" Placeholder={context.Config?.userLoggin?.label || "Username"} className="border border-[#8F8F8F]" onChange={({ target }) => setlogginType(target.value)} />
          <Input value={NamaDepan} required={true} type="text" Placeholder="Nama Depan" className="border border-[#8F8F8F]" onChange={({ target }) => setNamaDepan(target.value)} />
          <Input value={NamaBelakang} required={true} type="text" Placeholder="Nama Belakang" className="border border-[#8F8F8F]" onChange={({ target }) => setNamaBelakang(target.value)} />
          <Input value={Email} required={true} type="email" Placeholder="Email" className="border border-[#8F8F8F]" onChange={({ target }) => setEmail(target.value)} />
          <Input value={NoHp} required={true} type="number" Placeholder="No Handphone" className="border border-[#8F8F8F]" onChange={({ target }) => setNoHp(target.value)} />
          <Input value={Alamat} required={true} type="text" Placeholder="Alamat" className="border border-[#8F8F8F]" onChange={({ target }) => setAlamat(target.value)} />
          <Input value={Password} required={true} HiddenValue={true} type="password" Placeholder="Password" className="border border-[#8F8F8F]" onChange={({ target }) => setPassword(target.value)} />
          <Selection label="Jabatan" options={context.Config?.RegisterOptions || []} onChange={({ target }) => setSelectData(target.value)} />
          <button type="submit" className="bg-[#613EEA] text-white w-full h-[40px] rounded-full">Daftar</button>
        </div>
      </form>
    </>
  )
}