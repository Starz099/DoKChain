import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/role";

interface RoleSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleSelectModal = ({ open, onOpenChange }: RoleSelectModalProps) => {
  const navigate = useNavigate();

  const { setRole } = useRole();

  const handleSelect = (role: "user" | "institution") => {
    setRole(role);
    onOpenChange(false);
    if (role === "user") navigate("/dashboard");
    else navigate("/issuer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Select your role</DialogTitle>
          <DialogDescription>
            Choose how you'd like to use Dokchain
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Button
            variant="outline"
            className="h-28 flex flex-col items-center justify-center gap-2 hover:border-primary/50 "
            onClick={() => handleSelect("user")}
          >
            <User className="h-6 w-6" />
            <span className="font-medium">User</span>
            <span className="text-xs text-muted-foreground">
              Access your dashboard
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-28 flex flex-col items-center justify-center gap-2 hover:border-primary/50 "
            onClick={() => handleSelect("institution")}
          >
            <Building2 className="h-6 w-6" />
            <span className="font-medium">Institution</span>
            <span className="text-xs text-muted-foreground">
              Issue and manage credentials
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectModal;
