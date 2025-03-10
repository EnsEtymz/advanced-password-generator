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
import { useLoginModalStore } from "@/app/authStore";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const loginModalState = useLoginModalStore((state) => state.loginModalState);
  const [loginOpen, setLoginOpen] = useState(loginModalState);
  const setLoginModalState = useLoginModalStore(
    (state) => state.setLoginModalState
  );

  useEffect(() => {
    setLoginOpen(loginModalState);
  }, [loginModalState]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Fragment>
      <div className="py-3 px-6 border-t-4 border-[#34c75a] flex items-center justify-between gap-6 bg-white dark:bg-black">
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
                  <Button
                    onClick={() => {
                      setLoginModalState(true);
                    }}
                    className="bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-sm"
                  >
                    Login
                  </Button>
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
      <TokenExpiredModal />
      <LoginModal
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        user={user}
      />
    </Fragment>
  );
};

export default Navbar;
