import { useRef, useState } from "react"
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";


interface Props {
  type: 'text' | 'password' | 'email' | 'number'
  Placeholder: string,
  className?: string,
  HiddenValue?: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  required?: boolean,
  value?: string
}

export const Input = ({ type, value, Placeholder, className, HiddenValue, onChange, required }: Props) => {
  const [Show, setShow] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <input value={value} required={required} type={type === 'password' ? (Show ? 'text' : 'password') : type} placeholder={Placeholder} onChange={onChange} className={`w-full p-2 border border-gray-300 rounded ${className}`} ref={inputRef} />
      {HiddenValue && <button type="button" onClick={() => setShow(!Show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl bg-white pl-5 pr-2">{Show ? <FaEyeSlash /> : <IoEyeSharp />}</button>}
    </div>
  )
}