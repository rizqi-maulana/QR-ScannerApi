"use client"
// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: { width: number, height: number };
  rememberLastUsedCamera?: boolean;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback?: (decodedText: string) => void;
  qrCodeErrorCallback?: (error: string) => void;
}

const createConfig = (props: Html5QrcodePluginProps) => {
  const config = {
    fps: 10,
    qrbox: { width: 100, height: 100 },
    rememberLastUsedCamera: true,
    disableFlip: true,
    // Only support camera scan type.
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
  };
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  // if (props.aspectRatio) {
  //   config.aspectRatio = props.aspectRatio;
  // }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {

  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!(props.qrCodeSuccessCallback)) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [props]);

  return (
    <div id={qrcodeRegionId} />
  );
};

export default Html5QrcodePlugin;