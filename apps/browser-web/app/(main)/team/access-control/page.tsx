import { redirect } from "next/navigation"

export default function AccessControlIndex() {
  redirect("/team/access-control/login")
}
