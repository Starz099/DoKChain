import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import UploadModal from "@/components/UploadModal";
import axios from 'axios';
import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
// WalletModal removed; using wallet-adapter UI

const Dashboard = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [recipientFiles, setRecipientFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState('');
  const wallet = useWallet();

  const sharedDocuments = [
    {
      name: "Employment Verification",
      issuer: "Tech Corp Inc",
      timestamp: "2024-03-01",
      status: "active" as const,
      category: "Employment",
    },
  ];

  // Map API recipientFiles to the shape expected by DocumentCard. Do NOT show fallback files.
  const documentsForMyTab = (recipientFiles && recipientFiles.length > 0)
    ? recipientFiles.map((f) => ({
      name: f.name || f.filename || 'Untitled Document',
      issuer: f.issuer || f.owner || 'Unknown Issuer',
      timestamp: f.timestamp || f.uploadedAt || '',
      status: 'active' as const,
      category: f.category || 'Uploaded',
    }))
    : [];

  // fetch helper
  const fetchRecipientFiles = async (id: string) => {
    setFilesError('');
    setRecipientFiles([]);
    if (!id) {
      setFilesError('Please provide a recipient id');
      return;
    }
    setLoadingFiles(true);
    try {
      const resp = await axios.get(`http://localhost:3000/recipients/${id}/files`);
      setRecipientFiles(Array.isArray(resp.data) ? resp.data : [resp.data]);
    } catch (err) {
      console.error('Fetch files error', err);
      setFilesError(err?.response?.data?.error || err.message || 'Failed to load files');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const id = wallet.publicKey.toBase58();
      setRecipientId(id);
      // auto fetch
      fetchRecipientFiles(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.publicKey?.toBase58(), wallet?.connected]);
  // removed custom wallet modal state; use wallet-adapter UI




  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and verify your decentralized credentials
          </p>
        </div>

        {/* Recipient files fetcher */}
        <div className="mb-6 p-4 border border-border rounded-md">
          <h3 className="font-semibold mb-2">Load recipient files</h3>
          <div className="flex gap-2 items-center">
            {!wallet?.connected ? (
              <>
                <input
                  type="text"
                  placeholder="Recipient id"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="input w-full"
                />
                <Button
                  onClick={async () => {
                    await fetchRecipientFiles(recipientId);
                  }}
                  className="whitespace-nowrap"
                >
                  {loadingFiles ? 'Loading...' : 'Load'}
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Connected wallet</div>
                  <div className="font-mono truncate">{wallet.publicKey?.toBase58() || ''}</div>
                </div>
                <Button
                  onClick={async () => {
                    const id = wallet.publicKey?.toBase58();
                    if (id) {
                      setRecipientId(id);
                      await fetchRecipientFiles(id);
                    }
                  }}
                >
                  {loadingFiles ? 'Loading...' : 'Refresh'}
                </Button>
              </>
            )}
          </div>
          {filesError && <div className="text-sm text-destructive mt-2">{filesError}</div>}
        </div>

        {/* Auto-load when wallet connects */}
        {/** When a wallet connects, use its publicKey as recipient id and fetch files automatically */}

        {recipientFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Recipient Files</h3>
            <div className="flex flex-wrap flex-col">
              {recipientFiles.map((f, i) => {
                const recipientKey = f.recipient || f.owner || f.recipientId || f.ownerWallet || recipientId;
                return (
                  <DocumentCard
                    key={i}
                    name={f.name || f.filename || `File ${i + 1}`}
                    issuer={f.issuer || f.owner || 'Unknown Issuer'}
                    timestamp={f.timestamp || f.uploadedAt || ''}
                    status={'active'}
                    category={f.category}
                    url={f.url}
                    recipient={recipientKey}

                  />
                );
              })}
            </div>
          </div>
        )}

        <Tabs defaultValue="my-documents" className="space-y-6">
          <TabsContent value="my-documents" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {loadingFiles ? (
                <div className="col-span-3 text-center py-8 text-sm text-muted-foreground">Loading recipient files...</div>
              ) : documentsForMyTab.length > 0 ? (
                documentsForMyTab.map((doc, index) => (
                  <DocumentCard key={index} {...doc} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-sm text-muted-foreground">No documents loaded for the current recipient.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shared" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {sharedDocuments.map((doc, index) => (
                <DocumentCard key={index} {...doc} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issued" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingFiles ? (
                <div className="col-span-3 text-center py-8 text-sm text-muted-foreground">Loading recipient files...</div>
              ) : documentsForMyTab.length > 0 ? (
                documentsForMyTab.slice(0, 2).map((doc, index) => (
                  <DocumentCard key={index} {...doc} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-sm text-muted-foreground">No documents to show.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Button
        size="lg"
        className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl gradient-primary glow-primary"
        onClick={() => setUploadModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Footer />
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
      {/* custom wallet modal removed in favor of wallet-adapter UI */}
    </div>
  );
};

export default Dashboard;
