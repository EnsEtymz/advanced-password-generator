"use client";
import { CardContent } from "./ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { PasswordShowModal } from "./PasswordShowModal";
import { useAuthStore, useExpireStore } from "@/app/authStore";

export function SavedPasswordList() {
  const token = useAuthStore((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";
  const [passwords, setPasswords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const setState  = useExpireStore((state) => state.setState);
  const [searchText, setSearchText] = useState("");

  const getPasswords = async (page = 1, search_text = "") => {
    try {
      const response = await fetch(
        `${baseUrl}/password-generator/query?page=${page}&size=5&search_text=${search_text}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await response.json();
      if (res.is_success && res.data) {
        setPasswords(res.data.items);
        setCurrentPage(res.data.current_page);
        setTotalPages(res.data.total_pages);
        setHasPrevious(res.data.has_previous_page);
        setHasNext(res.data.has_next_page);
      } else if (res.status_code == 401) {
        setState(true);
      } else {
        toast.error("Passwords are not defined!", {
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value); // input değerini state'e ata
    getPasswords(currentPage, e.target.value); // Arama yaparken getPasswords'ı çağır
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
    if (!token) { return;
    }
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
        <div className="ml-3">
            <div className="w-full max-w-sm min-w-[200px] relative">
            <div className="relative">
        <input
          className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="Search for passwords..."
          value={searchText} // input değeri state ile kontrol edilir
          onChange={handleSearchChange} // input değeri değiştikçe state güncellenir
        />
        <button
          className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-8 h-8 text-slate-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
            </div>
        </div>
      </div>
      {passwords.length > 0 ? (
      
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
                      className="cursor-pointer text-black"
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
        ) : (
        <p className="text-center text-slate-500">No passwords found.</p>
      )}
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
                disabled={!hasNext}
                className={`px-3 py-1.5 min-w-9  text-sm font-normal text-slate-500  border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease ${
                  !hasNext ? "bg-slate-50" : "bg-white "
                }`}
              >
                Next
              </button>
            </div>
          </div>

     
      <PasswordShowModal
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        selectedPassword={selectedPassword}
      />
    </CardContent>
  );
}
