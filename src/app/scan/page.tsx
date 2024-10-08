"use client"

import { useRef, useState } from "react";
import { ScanPopUp } from "../components/ScanPopUp";
import dynamic from 'next/dynamic';
import { ScanPopUpErr } from "../components/ScanPopErr";

const Html5QrcodePlugin = dynamic(() => import('@/app/tools/Html5QrcodePlugin'), {
  ssr: false
});
export default function Page() {
  const audio = useRef<HTMLAudioElement>(null);
  const [logginType, setlogginType] = useState<string>('')
  const [ShowPopUp, setShowPopUp] = useState<boolean>(false)
  const [ShowPopUpErr, setShowPopUpErr] = useState<{ status: boolean, message?: string }>({ status: false, message: '' })

  let lasttoken: string;
  const onNewScanResult = async (decodedText: string) => {
    if (decodedText === lasttoken) {
      return;
    }
    lasttoken = decodedText;
    const res = await fetch('/Scanner', {
      method: 'POST',
      body: JSON.stringify({ token: decodedText })
    });
    const data = await res.json();
    if (data.status === 'Log') {
      setlogginType(data.logginType)
      setShowPopUp(true)
      setTimeout(() => {
        setShowPopUp(false)
      }, 2000);
    } else {
      setShowPopUpErr({ status: true, message: decodedText })
      setTimeout(() => {
        setShowPopUpErr({ status: false })
      }, 5000);
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      {ShowPopUp && <ScanPopUp logginType={logginType} />}
      {
        ShowPopUpErr.status &&
        <ScanPopUpErr token={ShowPopUpErr.message as string} />
      }
      <div className="w-7/12 m-auto">
        <audio src="/assets/audio/dry-fart.mp3" controls hidden ref={audio}></audio>
        <Html5QrcodePlugin
          fps={10}
          qrbox={{ width: 1000, height: 1000 }}
          disableFlip={true}
          qrCodeSuccessCallback={onNewScanResult}
        />
      </div>
    </main>
  )

}