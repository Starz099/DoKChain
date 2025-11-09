import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Shield } from "lucide-react";
import { useRole } from "@/context/role";

const Navbar = () => {
  const { role } = useRole();
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-gradient">Dokchain</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            {role === "user" && (
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            {role === "institution" && (
              <Link
                to="/issuer"
                className="text-foreground hover:text-primary transition-colors"
              >
                Issuer
              </Link>
            )}
            <Link
              to="/verify"
              className="text-foreground hover:text-primary transition-colors"
            >
              Verify
            </Link>
          </div>

          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
