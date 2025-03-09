'use client';
import { RegisterForm } from "@/components/RegisterForm";
import { useSelector } from "react-redux";


export default function LoginPage() {
  const user = useSelector((state) => state.auth.user);
if(user){
  window.location.href = '/';
}
  return (
    <div className="flex flex-col items-center md:justify-center">
        <RegisterForm /></div>
  );
}
