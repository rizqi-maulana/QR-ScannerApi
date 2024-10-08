import { DetailsData } from "../../organisms/detailsuser/DetailsData"
import { DetailsInfo } from "../../organisms/detailsuser/DetailsInfo"

interface DetailsUserProps {
  token: string
  TypeValue: string
  Nama: string
  email: string
  no_hp: string
  alamat: string
  image: string
  SelectData: string,
  Keterangan: {
    Hadir: number
    Izin: number
    TanpaKeterangan: number
  }
}

export const DetailsUserTemp = ({ token, TypeValue, email, no_hp, alamat, image, SelectData, Keterangan, Nama }: DetailsUserProps) => {
  return (
    <div className="w-max">
      <DetailsData token={token} image={image} Nama={Nama} SelectData={SelectData} TypeValue={TypeValue} email={email} no_hp={no_hp} alamat={alamat} />
      <div className="h-[1px] w-full mb-10 bg-black" />
      <DetailsInfo hadir={Keterangan?.Hadir} izin={Keterangan?.Izin} tanpaKet={Keterangan?.TanpaKeterangan} />
    </div>
  )
}