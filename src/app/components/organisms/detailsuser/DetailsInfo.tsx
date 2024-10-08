interface Props {
  hadir: number
  izin: number
  tanpaKet: number
}

export const DetailsInfo = ({ hadir, izin, tanpaKet }: Props) => {
  return (
    <div>
      <div className="grid gap-2">
        <p className="bg-[#FFE380]/50 text-[#2E2600] px-2 rounded-full w-max pr-10">• Hadir: {hadir}</p>
        <p className="bg-[#FF9E7F]/50 text-[#720000] px-2 rounded-full w-max pr-10">• Izin: {izin}</p>
        <p className="bg-[#778DFF]/50 text-[#06004A] px-2 rounded-full w-max pr-10">• Tanpa Keterangan: {tanpaKet}</p>
      </div>
    </div>
  )
}