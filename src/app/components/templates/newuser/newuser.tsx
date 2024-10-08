import { FormNewUser } from "../../organisms/newuser/FormNewUser"
import PhoneImage from '@/assets/image/phone.png'
import Image from "next/image"

export const NewuserTemp = () => {
  return (
    <div className="grid grid-cols-2 w-[900px]">
      <FormNewUser />
      <Image src={PhoneImage} alt="Image" width={350} height={500} sizes="100vw" className="object-contain" />
    </div>
  )
}