'use client'; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../redux/authSlice";
import Loader from "@/components/Loader";
import { toast } from "sonner";

export function LoginModal({ loginOpen, user }) {
  const [isOpen, setIsOpen] = useState(loginOpen);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setIsOpen(false);
    }
  }, [user]);
  useEffect(() => {
    setIsOpen(loginOpen);
  }, [loginOpen]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember_me: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const response = await dispatch(login(values));
      setLoading(false);
      if (response.payload?.is_success) {
        toast.success("Login successful!", {
          style: {
            background: "#34c75a",
            color: "#fff",
          },
        });
        setIsOpen(false);
      } else {
        toast.error("Login failed. Please try again.", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200 text-sm">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-md">
        {loading && <Loader />} {/* Loader ekledik */}
        <DialogHeader className={"py-4"}>
          <DialogTitle className="font-bold text-xl">Login</DialogTitle>
          <DialogDescription>
            Enter your email below to login to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="m@example.com"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs">{formik.errors.username}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs">{formik.errors.password}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formik.values.remember_me}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("remember_me", checked)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Me
              </label>
            </div>
            <Button
              type="submit"
              className="w-full hover:bg-[#34c75a] text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
