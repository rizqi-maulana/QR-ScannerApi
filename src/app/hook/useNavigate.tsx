import { useRouter } from "next/navigation";

export const useNavigate = () => {
  const router = useRouter()
  return (url: string) => {
    setTimeout(() => {
      router.replace(url)
    }, 1500);
    setTimeout(() => {
      window.location.reload()
    }, 1900);
  }
}