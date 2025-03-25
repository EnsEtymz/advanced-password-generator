"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuthStore } from "@/app/authStore";
import { cn } from "@/lib/utils";

export function TagsListCombobox({selectedTags, setSelectedTags,tags, setTags}) {
  const token = useAuthStore((state) => state.token);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";

  const getTags = async () => {
    try {
      const response = await fetch(`${baseUrl}/tags/query`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      if (res.is_success && res.data) {
        setTags(res.data.items);
      } else {
        toast.error("Tags not found!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!");
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag.id)
        ? prev.filter((id) => id !== tag.id)
        : [...prev, tag.id]
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button  className={cn(
                        "w-full justify-between text-muted-foreground shadow-none bg-white hover:bg-gray-200 border-l border-t border-b border-gray-500 rounded-r-none"
                      )} onClick={getTags}>
            Select tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <div className="p-2">
            {tags.length === 0 ? (
              <p className="text-gray-500 text-sm">No tags found.</p>
            ) : (
              <ul className="space-y-0">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="relative flex gap-2 select-none items-center rounded-sm px-2 py-1 max-h-40 overflow-y-auto text-sm outline-none hover:bg-gray-100 cursor-pointer "  
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                    <Check
                      className={`ml-auto ${
                        selectedTags.includes(tag.id)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>

     
    </div>
  );
}
