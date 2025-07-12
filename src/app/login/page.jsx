import React from 'react'
import Login from '../components/login'
import { auth } from "@/auth"
import { redirect } from "next/navigation";
const page = async () => {

  const session = await auth()
    if (session) {
      redirect("/");
    }
 
  return (
      <Login/>
  )
}

export default page
