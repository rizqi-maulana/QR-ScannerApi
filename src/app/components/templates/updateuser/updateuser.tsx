"use client"

import { Input } from "../../molecules/input"
import { Selection } from "../../molecules/selection";
import { useEffect, useState, useContext, useCallback } from "react"
import toast, { Toaster } from 'react-hot-toast';
// import { context.Configuration } from "@/app/context.Config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppContext } from "@/app/hook/Context";


export const UpdateUserTemp = ({ TypeValue }: { TypeValue: string }) => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("context.Config is not available");
  }
  const [OldValueType, setOldValueType] = useState<string>("");
  const [ValueType, setValueType] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Alamat, setAlamat] = useState<string>("");
  const [NoHp, setNoHp] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [UImage, setUImage] = useState<string>("");
  const [SelectData, setSelectData] = useState<string>(context.Config?.RegisterOptions[0] as string);
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`https://${context.Domain}/user/DetailsUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ TypeValue })
      });
      const data = await res.json();
      setValueType(data.user[context.Config?.userLoggin?.label || "TypeValue"]);
      setOldValueType(data.user[context.Config?.userLoggin?.label || "TypeValue"]);
      setPassword(data.user.password);
      setAlamat(data.user.alamat);
      setNoHp(data.user.no_hp);
      setEmail(data.user.email);
      setUImage(data.user.ImagePath);
      setSelectData(data.user.SelectData || context.Config?.RegisterOptions[0][0]);
    }
    fetchUser();
  }, [TypeValue, context.Domain, context.Config?.userLoggin?.label, context.Config?.RegisterOptions]);

  const HandleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageBase64 = null;

    // Fungsi untuk konversi file gambar ke Base64
    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    // Jika ada file gambar, konversi ke Base64
    if (ImageFile) {
      try {
        imageBase64 = await convertToBase64(ImageFile);
      } catch (error) {
        console.error("Error converting image:", error);
        return;
      }
    }

    const res = await fetch(`https://${context.Domain}/user/UpdateUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        OldValueType: OldValueType,
        newValueType: ValueType,
        password: Password,
        no_hp: NoHp,
        alamat: Alamat,
        email: Email,
        SelectData: SelectData,
        image: imageBase64 ? imageBase64.split(',')[1] : null,
      }),
    });

    const data = await res.json();
    if (data.status === 200) {
      toast.success(data.message, {
        duration: 1000,
      });
      setTimeout(() => {
        router.replace("/users");
      }, 1500);
    } else {
      toast.error(data.message);
    }
  }, [OldValueType, ValueType, Password, NoHp, Alamat, Email, SelectData, ImageFile, router, context.Domain]);

  useEffect(() => {
    if (SelectData)
      console.log(SelectData)
  }, [SelectData])


  return (
    <>
      <Toaster />
      <form onSubmit={HandleSubmit} className="w-[900px]">
        <div className="grid gap-3">
          <Image src={ImageFile ? URL.createObjectURL(ImageFile) : `https://${context.Domain}/UserData/Profile/${UImage}`} width={200} height={300} alt="Profile" sizes="100vw" quality={100} className="object-contain mx-auto rounded-lg" />
          <label htmlFor="image" className="mx-auto text-[#0094FF] cursor-pointer">Upload Image</label>
          <input id="image" type="file" accept="image/*" onChange={({ target }) => setImageFile(target.files?.[0] || null)} className="hidden" />
          <Input value={ValueType} required={true} type="text" Placeholder="ValueType" className="border border-[#8F8F8F]" onChange={({ target }) => setValueType(target.value)} />
          <Input value={Email} required={true} type="email" Placeholder="Email" className="border border-[#8F8F8F]" onChange={({ target }) => setEmail(target.value)} />
          <Input value={NoHp} required={true} type="number" Placeholder="No Handphone" className="border border-[#8F8F8F]" onChange={({ target }) => setNoHp(target.value)} />
          <Input value={Alamat} required={true} type="text" Placeholder="Alamat" className="border border-[#8F8F8F]" onChange={({ target }) => setAlamat(target.value)} />
          <Input value={Password} required={true} HiddenValue={true} type="password" Placeholder="Password" className="border border-[#8F8F8F]" onChange={({ target }) => setPassword(target.value)} />
          <Selection SelectData={SelectData} label="Jabatan" options={context.Config?.RegisterOptions || []} onChange={({ target }) => setSelectData(target.value)} />
          <div className="flex justify-end">
            <button type="submit" className="bg-[#778DFF] text-white w-max px-8 h-[40px] rounded-[10px]">Simpan</button>
          </div>
        </div>
      </form>
    </>
  )
}
