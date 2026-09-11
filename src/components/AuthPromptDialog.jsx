import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AuthPromptDialog({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">Join the conversation</DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create a free account to like posts, leave comments, and connect with people.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full" onClick={() => { onClose(); navigate("/register"); }}>
            Create Account
          </Button>
          <Button variant="outline" className="w-full" onClick={() => { onClose(); navigate("/login"); }}>
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
