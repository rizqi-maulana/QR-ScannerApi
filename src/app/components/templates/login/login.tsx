import { FormLogin } from "../../organisms/auth/LoginForm"
// import Image from "next/image"
// import AuthImage from '@/assets/image/auth.png'
export const LoginTemp = () => {
  return (
    <div className="grid md:grid-cols-2 justify-center gap-10 w-[60%] ">
      <FormLogin />
      {/* <Image src={AuthImage} alt="Image" width={350} height={500} sizes="100vw" className="object-contain hidden md:block" /> */}
    </div>
  )
}