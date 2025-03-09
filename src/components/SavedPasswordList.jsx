"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "./ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function SavedPasswordList() {
  const token = localStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [passwords, setPasswords] = useState([]);

  const getPasswords = async () => {
    try {
      const response = await fetch(`${baseUrl}/password-generator/query`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Passwords method is not defined!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
        setPasswords(res.data?.items);
      } else {
        toast.error("Passwords is not defined!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    }
  };

  const getOnePassword = async () => {
    try {
      const id = "Oy6vESInUCptJjh9mn7zvA==";
      const response = await fetch(`${baseUrl}/password-generator/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Passwords method is not defined!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
        return;
      }

      const res = await response.json();
      if (res.is_success && res.data) {
      } else {
        toast.error("Passwords is not defined!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    getPasswords();
   // getOnePassword();
  }, []);
  return (
    <CardContent className="flex flex-col gap-6 w-full lg:w-3/5 bg-white rounded-md">
      <div className="relative  bg-white flex flex-col items-center justify-center md:flex">
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
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400  focus:shadow-md"
                placeholder="Search for passwords..."
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
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">
                  Name
                </p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">
                  Hint
                </p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">
                  Password
                </p>
              </th>
              <th className="p-4 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-normal leading-none text-slate-500">
                  CreatedOn
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((item, key) => (
              <tr key={key} className="hover:bg-slate-50 border-b border-slate-200">
                <td className="p-4 py-5">
                  <p className="block font-semibold text-sm text-slate-800">
                    {item.name}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-500">{item.hint}</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-500">********</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-sm text-slate-500">{item.created_on}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing <b>1-5</b> of 45
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Prev
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
              1
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              2
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              3
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Next
            </button>
          </div>
        </div>
      </div> ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-slate-500">No passwords found!</p>
        </div>
      )}
    </CardContent>
  );
}
