"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ui/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { LoginModal } from "./LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../redux/authSlice";
import { TokenExpiredModal } from "./TokenExpiredModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [loginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    console.log("loginOpen", loginOpen);
  }, [loginOpen]);
  return (
    <Fragment>
      <div className="py-3 px-6 border-t-4 border-[#34c75a] flex items-center justify-between gap-6 bg-white">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={25} />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!user ? (
            <>
              {loading ? (
                <></>
              ) : (
                <>
                  <LoginModal
                    loginOpen={loginOpen}
                    setLoginOpen={setLoginOpen}
                    user={user}
                  />
                  <Button className="text-sm p-0">
                    <Link href="/register" className="w-full px-4 py-2">
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="flex mr-2 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link className="w-full" href="/saved-password">
                      Saved Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="w-full" href="/profile">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0" onClick={handleLogout}>
                    <Button
                      size="sm"
                      className="w-full text-xs mt-2 rounded-md"
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <TokenExpiredModal setLoginOpen={setLoginOpen} />
    </Fragment>
  );
};

export default Navbar;
