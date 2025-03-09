import { useExpireStore, useLoginModalStore } from "@/app/authStore";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function TokenExpiredModal() {
    const isState = useExpireStore((state) => state.isState);
    const setState = useExpireStore((state) => state.setState);
    const setLoginModalState = useLoginModalStore((state) => state.setLoginModalState);
  return (
    <Dialog open={isState} onOpenChange={() => setState(false)}>
      <DialogContent className="sm:max-w-[425px] rounded-md">
      <DialogHeader>
  <DialogTitle>Session Expired</DialogTitle>
  <DialogDescription>
    Your session has expired due to inactivity. Please log in again to continue.
  </DialogDescription>
</DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={()=>{setState(false); setLoginModalState(true)  }}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
