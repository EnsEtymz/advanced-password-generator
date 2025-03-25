'use client';
import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout, changePassword } from "../../../redux/authSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            current_password: "",
            new_password: "",
            confirm_new_password: "",
        },
        validationSchema: Yup.object({
            current_password: Yup.string().required("Current password is required"),
            new_password: Yup.string().required("New password is required"),
            confirm_new_password: Yup.string()
                .oneOf([Yup.ref("new_password"), null], "Passwords must match")
                .required("Confirm new password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const response = await dispatch(changePassword(values));
            setLoading(false);
            if (response.payload?.is_success) {
                toast.success("Password changed successfully!", {
                    style: { background: "#34c75a", color: "#fff" },
                });
                setTimeout(() => router.push("/"), 2000);
            } else {
                toast.error(response.payload?.message, {
                    style: { background: "#000", color: "#fff" },
                });
            }
        },
    });

    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center md:justify-center">
            <CardContent className="flex flex-col gap-6 w-full lg:w-3/5 bg-white rounded-md dark:bg-black dark:border-2">
                <div className="relative bg-white flex flex-col items-center justify-center dark:bg-black">
                    <Image src="/logo.png" alt="Image" className="py-2" width={120} height={70} />
                </div>
                <div className="md:flex min-h-96">
                    <ul className="flex flex-col md:w-1/3 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                        {[
                            { id: "profile", label: "Profile" },
                            { id: "password", label: "Change Password" },
                            { id: "logout", label: "Logout" },
                        ].map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => {
                                        if (tab.id !== "logout") {
                                            setActiveTab(tab.id);
                                        } else {
                                            handleLogout();
                                        }
                                    }}
                                    className={`inline-flex items-center px-4 py-3 rounded-lg w-full transition-colors ${
                                        activeTab === tab.id
                                            ? "text-white bg-[#34c75a] hover:bg-[#2aa24a] "
                                            : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-6 bg-white text-medium text-gray-500 dark:text-gray-400 w-full">
                        {activeTab === "profile" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Profile</h3>
                                <div className="flex flex-col gap-6 w-full">
                                    <Image className="h-16 w-16 rounded-lg" src="https://github.com/shadcn.png" alt="Avatar" width={64} height={64} />
                                    <div>
                                        <dt className="font-semibold text-gray-900 dark:text-white">Name</dt>
                                        <dd className="text-gray-500 dark:text-gray-400">{user?.data?.full_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-gray-900 dark:text-white">Email Address</dt>
                                        <dd className="text-gray-500 dark:text-gray-400">{user?.data?.email}</dd>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "password" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Change Password</h3>
                                <form onSubmit={formik.handleSubmit} className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input id="current_password" type="password" {...formik.getFieldProps("current_password")} />
                                    </div>
                                    <div className="clearFix"></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input id="new_password" type="password" {...formik.getFieldProps("new_password")} />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm_new_password">Confirm New Password</Label>
                                        <Input id="confirm_new_password" type="password" {...formik.getFieldProps("confirm_new_password")} />
                                    </div></div>
                                    <Button type="submit" className="w-full hover:bg-[#34c75a] text-white dark:text-black dark:bg-[#34c75a] transition duration-300 dark:hover:bg-[#2aa24a] mt-2" disabled={loading}>
                                        {loading ? "Saving..." : "Save"}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </div>
    );
};

export default Page;
