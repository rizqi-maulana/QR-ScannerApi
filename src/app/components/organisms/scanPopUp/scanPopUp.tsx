import { FaCheckCircle } from "react-icons/fa";

export const ScanPopUp = ({ logginType }: { logginType: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white z-50">
      <div className="w-[300px] h-[300px] py-5 bg-white shadow-2xl flex flex-col items-center justify-center">
        <FaCheckCircle className="text-green-500 text-6xl" />
        <h1 className="text-center">
          Auth {logginType}</h1>
      </div>
    </div>
  )
}