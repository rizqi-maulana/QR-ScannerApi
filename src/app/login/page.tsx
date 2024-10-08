import { LoginTemp } from "../components/templates/login/login"
import { Loading } from "../components/organisms/loading/loading"
export default function Login() {
  return (
    <>
      <Loading duration={1000} />
      <section className="flex items-center justify-center h-screen w-full">
        <LoginTemp />
      </section>
    </>
  )
}