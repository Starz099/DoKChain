import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Search, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// WalletModal removed; using wallet-adapter UI

const Verify = () => {
  // removed custom wallet modal state; use wallet-adapter UI
  const [verificationResult, setVerificationResult] = useState<
    "verified" | "invalid" | null
  >(null);
  const [documentHash, setDocumentHash] = useState("");

  const handleVerify = () => {
    // Mock verification
    if (documentHash.length > 0) {
      setVerificationResult("verified");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Verify Document</h1>
            <p className="text-muted-foreground">
              Check the authenticity of any credential on the blockchain
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hash">Document Hash or CID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="hash"
                    placeholder="Enter document hash (e.g., QmX...)"
                    className="font-mono"
                    value={documentHash}
                    onChange={(e) => setDocumentHash(e.target.value)}
                  />
                  <Button onClick={handleVerify} className="gradient-primary">
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the document's IPFS hash or blockchain transaction ID
                </p>
              </div>
            </div>
          </Card>

          {verificationResult && (
            <Card
              className={`p-8 ${
                verificationResult === "verified"
                  ? "border-success bg-success/5"
                  : "border-destructive bg-destructive/5"
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  {verificationResult === "verified" ? (
                    <>
                      <div className="p-4 rounded-full bg-success/10">
                        <CheckCircle className="h-12 w-12 text-success" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-success">
                          Document Verified
                        </h2>
                        <p className="text-muted-foreground">
                          This credential is authentic and has not been tampered
                          with
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-destructive/10">
                        <XCircle className="h-12 w-12 text-destructive" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-destructive">
                          Verification Failed
                        </h2>
                        <p className="text-muted-foreground">
                          This document could not be verified or has been
                          tampered with
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {verificationResult === "verified" && (
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Issuer
                        </p>
                        <p className="font-semibold">MIT University</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Owner Wallet
                        </p>
                        <p className="font-mono text-sm">5FHne...8xqD</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Issue Date
                        </p>
                        <p className="font-semibold">2024-01-15</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Status
                        </p>
                        <p className="font-semibold text-success">Active</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Solana Explorer
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {!verificationResult && (
            <Card className="p-8 bg-muted/30">
              <div className="text-center space-y-4">
                <div className="inline-block p-4 rounded-full bg-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  How Verification Works
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Every document issued through Dokchain has a unique
                  cryptographic hash stored on the Solana blockchain. This hash
                  acts as a digital fingerprint that proves authenticity and
                  prevents tampering.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      {/* custom wallet modal removed in favor of wallet-adapter UI */}
    </div>
  );
};

export default Verify;
