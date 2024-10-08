"use client"
import { useEffect, useState, useContext } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { CiMenuKebab } from "react-icons/ci";
import Link from "next/link";
import { AppContext } from "../hook/Context";

const PoppinsF = Poppins({ subsets: ["latin"], weight: "600" });

interface Color {
  BackGround: string;
  Text: string;
}

interface UserContent {
  ImagePath: string;
  Color: Color;
  SelectData: string;
  [key: string]: Color | string;
}

interface User {
  content: UserContent;
}

export default function Users() {
  const Datas = useContext(AppContext);
  const [Data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      const res = await fetch(`https://${Datas?.Domain}/user/FetchUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (data.filesData) {
        setData(data.filesData);
      }
      if (data.length === 0) {
        setData([]);
      }
    };
    fetchdata();
  }, [Datas?.Change, Datas?.Domain]);

  return (
    <section>
      <h1>Users ({Data.length})</h1>
      <div className="flex flex-col mt-5">
        {Data.map((data, index) => (
          <div className="w-[90%] mb-5 justify-between flex items-center" key={index}>
            <div className="flex items-center gap-5">
              <Image
                src={`https://qrapp.duckdns.org:3000/UserData/Profile/${data.content.ImagePath}`}
                alt="image"
                className="object-cover w-[50px] h-[50px] rounded-full"
                width={100}
                height={100}
                sizes="100vw"
              />
              <div>
                <h3 className={`text-xl font-semibold mb-1 ${PoppinsF.className}`}>
                  {typeof data.content[Datas?.Config?.userLoggin?.label || "TypeValue"] === "string"}
                </h3>
                <p
                  className="text-sm w-max px-2 rounded-md shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                  style={{
                    color: data.content.Color.Text,
                    backgroundColor: `${data.content.Color.BackGround}80`,
                  }}
                >
                  {data.content.SelectData}
                </p>
              </div>
            </div>
            <div className="relative">
              <Link href={`/users/${data.content[Datas?.Config?.userLoggin?.label || "TypeValue"]}`}>
                <CiMenuKebab className="rotate-90 text-2xl cursor-pointer" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
