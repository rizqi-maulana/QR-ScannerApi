import { MdError } from "react-icons/md";


export const ScanPopUpErr = ({ token }: { token: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white z-50">
      <div className="w-[300px] h-[300px] py-5 px-2 bg-white shadow-2xl flex flex-col items-center justify-center relative">
        <MdError className="text-red-500 text-6xl" />
        <h1 className="text-center">
          Token yang anda masukan sudah kadaluarsa / tidak valid</h1>
        <p className="flex flex-col items-center text-center">Token:
          <code className="break-all text-sm">
            {token}
          </code>
        </p>
      </div>
    </div>
  )
}