import { Copy, Check, Plus } from "lucide-react";  // Check ikonu ekleniyor

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAuthStore, useExpireStore } from "@/app/authStore";

export function TagsListModal({}) {
  const token = useAuthStore((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";
  const [tag, setTag] = useState("");
  const setState = useExpireStore((state) => state.setState);
  const [open, setOpen] = useState(false);

  const saveTag = async () => {
    if (!token) {
      toast.error("Please enter your token!", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      return;
    }
    const requestData = {
      name: tag
    };

    try {
      const response = await fetch(`${baseUrl}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const res = await response.json();
      if (res.is_success && res.data) {
        toast.success("Tag saved successfully!", {
          style: {
            background: "#34c75a",
            color: "#fff",
          },
        });
        setTag("");
        setOpen(false);
      } else if (res.status_code == 401) {
        setState(true);
      }
      else {
        toast.error("Tag could not be saved!", {
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

  return (
  
      <Dialog  open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="bg-white hover:bg-gray-200 text-black shadow-none border-r border-t border-b border-gray-500 rounded-l-none"><Plus /></Button>
         </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-md">
          <DialogHeader>
            <DialogTitle>New Tag</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="tag" className="sr-only">
                Tag
              </Label>
              <div className="flex gap-3">
              <Input id="tag" className="border border-gray-500 text-black placeholder-gray-500 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 p-2 w-full transition-all duration-200 ease-in-out dark:bg-black dark:border-gray-500 dark:text-white" value={tag} onChange={(e)=>{setTag(e.target.value)}} />
              <Button
              type="submit"
              className="w-36 bg-[#34c75a] hover:bg-[#2aa24a] text-white dark:text-black dark:bg-[#34c75a] transition duration-200 dark:hover:bg-[#2aa24a] "
              onClick={saveTag}
            >Save
            </Button></div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter> </DialogFooter>
      </Dialog>
  ) 
}
