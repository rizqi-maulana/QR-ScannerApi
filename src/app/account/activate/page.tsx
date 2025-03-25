import "globals";
import Image from "next/image";
const Acvivate = () => {
  return (
    <section>
      <div className="bg-[#00a2ea] w-5/6 h-28">
        <Image
          src="https://res.cloudinary.com/dju3jontk/image/upload/q_100/v1742793610/LOGO_SCANHADIR_WEB_DESKTOP_v08s4t.png"
          height={100}
          width={100}
          alt="ScanHadir"
        />
      </div>
    </section>
  );
};

export default Acvivate;
