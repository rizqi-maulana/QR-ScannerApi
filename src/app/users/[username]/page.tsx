"use client"
import { useContext, useEffect, useState } from "react";
import { FetchUser } from "@/app/hook/FetchUser";
import { AppContext } from "@/app/hook/Context";
import { DetailsUserTemp } from "@/app/components/templates/detailsuser/detailsuser";
import { Loading } from "@/app/components/organisms/loading/loading";
import { AbsenKeterangan } from "@/app/components/organisms/detailsuser/AbsenKeterangan";

interface UserDetails {
  Keterangan: {
    Hadir: number;
    Izin: number;
    TanpaKeterangan: number;
  };
  nama_depan: string;
  nama_belakang: string;
  token: string;
  email: string;
  no_hp: string;
  alamat: string;
  ImagePath: string;
  SelectData: string;
}

// Define a union type for keys in UserDetails
type UserDetailsKeys = keyof UserDetails;

export default function DetailsUser({ params }: { params: { username: string } }) {
  const Context = useContext(AppContext);
  if (!Context) {
    throw new Error("context.Config is not available");
  }

  const { username } = params;
  const [Data, setData] = useState<UserDetails | null>(null);
  const [ShowLoading, setShowLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await FetchUser(username, Context?.Domain as string);
      console.log(data);
      setShowLoading(false);
      setData(data);
    };

    fetchUserData();
  }, [username, Context?.Domain]);

  return (
    <section className="md:mt-20 mt-10 flex flex-col items-center md:p-0 p-2 justify-center">
      <Loading Show={ShowLoading} />
      {Context?.ShowAbsen && <AbsenKeterangan logginType={username} />}
      {Data && (
        <DetailsUserTemp
          Nama={`${Data.nama_depan} ${Data.nama_belakang}`}
          Keterangan={Data.Keterangan}
          token={Data.token}
          TypeValue={Data[Context.Config?.userLoggin?.label as UserDetailsKeys].toString()}
          email={Data.email}
          no_hp={Data.no_hp}
          alamat={Data.alamat}
          image={Data.ImagePath}
          SelectData={Data.SelectData}
        />
      )}
    </section>
  );
}
