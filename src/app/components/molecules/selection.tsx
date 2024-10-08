interface Props {
  label: string,
  options: Array<string>,
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  SelectData?: string
}

export const Selection = ({ label, options, onChange, SelectData }: Props) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="Select">{label}</label>
      <select id="Select" onChange={onChange} className="border border-[#8F8F8F] rounded-md py-2">
        {options.map((option, index) => (
          <option key={index} selected={option === SelectData} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}