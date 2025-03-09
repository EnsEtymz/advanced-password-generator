import { Copy, Check } from "lucide-react";  // Check ikonu ekleniyor

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
import useAuthStore from "@/app/authStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PasswordShowModal({
  showPassword,
  setShowPassword,
  selectedPassword,
}) {
  const token = useAuthStore((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";
  const [password, setPassword] = useState();
  const [copied, setCopied] = useState(false);  // Kopyalandı durumu için state

  useEffect(() => {
    if (!selectedPassword || !token) return; // Token veya seçili şifre yoksa durdur

    const getPasswords = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/password-generator/${selectedPassword.id}`,
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
          setPassword(res.data.pass);
          console.log("Password:", res.data);
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

    getPasswords();
  }, [selectedPassword, token]);

  const handleCopy = () => {
    // Kopyalama işlemi
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopied(true);  // Kopyalandı durumunu değiştir
        toast.success("Password copied successfully!", {
          style: {
            background: "#34c75a",
            color: "#fff",
          },
        });
        // 2 saniye sonra ikonu tekrar eski haline döndür
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        toast.error("Failed to copy password!", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      });
  };

  return (
    selectedPassword ? (  
      <Dialog open={showPassword} onOpenChange={()=>{setShowPassword(); setPassword(""); setCopied(false);}}>
        <DialogContent className="sm:max-w-md rounded-md">
          <DialogHeader>
            <DialogTitle>{selectedPassword.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" value={password} readOnly />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3 bg-[#34c75a] hover:bg-[#2aa24a] transition duration-200"
              onClick={handleCopy} // Kopyalama işlemini tetikle
            >
              <span className="sr-only">Copy</span>
              {copied ? <Check /> : <Copy />}  {/* Eğer kopyalandıysa Check ikonu, değilse Copy ikonu */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ) : null // Eğer seçili şifre yoksa modalı gösterme   
  );
  
}
