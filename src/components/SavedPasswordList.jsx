"use client";
import { CardContent } from "./ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAuthStore from "@/app/authStore";
import { Eye, EyeOff } from "lucide-react";
import { PasswordShowModal } from "./PasswordShowModal";

export function SavedPasswordList() {
  const token = useAuthStore((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";
  const [passwords, setPasswords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);

  const getPasswords = async (page = 1) => {
    try {
      const response = await fetch(
        `${baseUrl}/password-generator/query?page=${page}&size=3`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Passwords method is not defined!", {
          style: { background: "#000", color: "#fff" },
        });
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
        setPasswords(res.data.items);
        setCurrentPage(res.data.current_page);
        setTotalPages(res.data.total_pages);
      } else {
        toast.error("Passwords is not defined!", {
          style: { background: "#000", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!", {
        style: { background: "#000", color: "#fff" },
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (!token) return; // Token yoksa işlemi durdur
    getPasswords(currentPage);
  }, [currentPage, token]); // currentPage veya token değiştiğinde çalıştır

  return (
    <CardContent className="flex flex-col gap-6 w-full lg:w-3/5 bg-white rounded-md">
      <div className="relative bg-white flex flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="Image"
          className="py-2"
          width={120}
          height={70}
        />
      </div>

      <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">My Passwords</h3>
          <p className="text-slate-500">A list of your saved passwords.</p>
        </div>
      </div>

      {passwords.length > 0 ? (
        <>
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-normal text-slate-500">
                  Name
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-normal text-slate-500">
                  Hint
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-normal text-slate-500">
                  Password
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-normal text-slate-500">
                  CreatedOn
                </th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((password) => (
                <tr key={password.id}>
                  <td className="p-4 text-sm border-b border-slate-200 font-semibold">
                    {password.name}
                  </td>
                  <td className="p-4 text-sm border-b border-slate-200">
                    {password.hint}
                  </td>
                  <td className="p-4 text-sm border-b border-slate-200 flex gap-1">
                    ********
                    <Eye
                      className="cursor-pointer"
                      size={14}
                      onClick={() => {
                        setSelectedPassword(password);
                        setShowPassword(true);
                      }}
                    />
                  </td>
                  <td className="p-4 text-sm border-b border-slate-200">
                    {formatDate(password.created_on)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sayfalama Butonları */}

          <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-slate-500">
              Page{" "}
              <b>
                {currentPage} of {totalPages}
              </b>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 min-w-9 text-sm font-normal text-slate-500  border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease ${
                  currentPage === 1 ? "bg-slate-50" : "bg-white"
                }`}
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 min-w-9  text-sm font-normal text-slate-500  border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease ${
                  currentPage === totalPages ? "bg-slate-50" : "bg-white "
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-slate-500">No passwords found.</p>
      )}
      <PasswordShowModal
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        selectedPassword={selectedPassword}
      />
    </CardContent>
  );
}
