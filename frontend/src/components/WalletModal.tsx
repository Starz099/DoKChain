// WalletModal was the project's custom wallet connect modal.
// We've migrated to use the official solana wallet-adapter UI components
// (WalletMultiButton / WalletConnectButton). Keep a no-op export so any
// leftover imports won't break the build during migration.

export default function WalletModal() {
  return null;
}
<<<<<<< HEAD

const wallets = [
  { name: "Phantom", logo: "P", color: "bg-purple-500" },
  { name: "Solflare", logo: "S", color: "bg-orange-500" },
  { name: "Backpack", logo: "B", color: "bg-blue-500" },
];

const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const handleConnect = (walletName: string) => {
    console.log(`Connecting to ${walletName}...`);
    // Mock wallet connection
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Dokchain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full h-16 justify-start text-left hover:bg-primary/5 hover:border-primary/50 transition-all"
              onClick={() => handleConnect(wallet.name)}
            >
              <div className={`${wallet.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-4`}>
                {wallet.logo}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{wallet.name}</span>
                <span className="text-xs text-muted-foreground">Connect to {wallet.name} Wallet</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            New to Solana wallets?{" "}
            <a href="#" className="text-primary hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
=======
>>>>>>> 91c0a2102490943785a60b843ea0564cd1820fa2
