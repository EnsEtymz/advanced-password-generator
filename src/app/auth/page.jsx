"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../../redux/authSlice";
import AuthButtons from "@/components/AuthButtons";

export default function Auth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!user) return( <><p>Giriş yapmalısınız.</p>
  <AuthButtons />
  </>)

  return <div>Hoşgeldin, {user.name}!</div>;
}
