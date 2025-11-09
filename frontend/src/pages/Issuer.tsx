import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Send, CheckCircle, X, ExternalLink } from "lucide-react";
import DocumentCard from '@/components/DocumentCard';
import { useWallet } from '@solana/wallet-adapter-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import axios from 'axios';
const Issuer = () => {
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipientAddress: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const wallet = useWallet();

  const [recipientFiles, setRecipientFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState('');

  // File handling functions
  const handleFile = (file) => {
    if (!file) return;

    // Validate file type (PDF, images, common document formats)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, image, or document.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate wallet address
    if (!formData.recipientAddress.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      setError("Please enter a valid Solana wallet address");
      return;
    }

    // Validate file
    if (!selectedFile) {
      setError("Please upload a document");
      return;
    }

    setError("");
    setSuccessMessage("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const body = new FormData();
      body.append('file', selectedFile);
      body.append('recipient', formData.recipientAddress);
      body.append('description', formData.description || '');

      const resp = await axios.post('http://localhost:3000/upload', body, {
        headers: {
          // Let the browser set Content-Type with boundary
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      // Handle success
      setSuccessMessage(resp?.data?.message || 'File uploaded successfully');
      // reset form
      setSelectedFile(null)
      setFormData({ recipientAddress: '', description: '' });

      // optionally close modal after short delay
      setTimeout(() => {
        setIssueModalOpen(false);
        setSuccessMessage('');
      }, 1200);
    } catch (err) {
      console.error('Upload error', err);
      const msg = err?.response?.data?.error || err.message || 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };


  // Fetch recipient files helper
  const fetchRecipientFiles = async (id: string) => {
    setFilesError('');
    setRecipientFiles([]);
    if (!id) {
      setFilesError('No recipient id provided');
      return;
    }
    setLoadingFiles(true);
    try {
      const resp = await axios.get(`http://localhost:3000/name/recipients/${id}/files`);
      setRecipientFiles(Array.isArray(resp.data) ? resp.data : [resp.data]);
    } catch (err) {
      console.error('Fetch files error', err);
      setFilesError(err?.response?.data?.error || err.message || 'Failed to load files');
    } finally {
      setLoadingFiles(false);
    }
  };

  // Auto-fill recipient from connected wallet and auto-fetch files
  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const id = wallet.publicKey.toBase58();
      setFormData((prev) => ({ ...prev, recipientAddress: id }));
      fetchRecipientFiles(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.publicKey?.toBase58(), wallet?.connected]);

  const issuedDocuments = [
    {
      name: "Academic Transcript",
      recipient: "5FHne...8xqD",
      timestamp: "2024-03-15",
      hash: "Qm...a1b2c3",
    },
    {
      name: "Graduation Certificate",
      recipient: "8KLpo...3mwX",
      timestamp: "2024-03-10",
      hash: "Qm...d4e5f6",
    },
    {
      name: "Professional License",
      recipient: "2BMxy...7gkL",
      timestamp: "2024-03-05",
      hash: "Qm...g7h8i9",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Issuer Dashboard</h1>
          <p className="text-muted-foreground">
            Issue and manage verified credentials to your recipients
          </p>
        </div>

        <div className="mb-6">
          <Button
            size="lg"
            className="gradient-primary glow-primary"
            onClick={() => setIssueModalOpen(true)}
          >
            <Send className="mr-2 h-5 w-5" />
            Issue New Document
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Issued Documents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issuedDocuments.map((doc, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-success/10">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Recipient: {doc.recipient}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issued:</span>
                    <span className="text-foreground">{doc.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hash:</span>
                    <span className="text-foreground font-mono">
                      {doc.hash}
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View on Explorer
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {recipientFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Files for recipient</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {recipientFiles.map((f, i) => {
                const recipientKey = f.recipient || f.owner || f.recipientId || f.ownerWallet || formData.recipientAddress;
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
      </main>

      {/* Issue Document Modal */}
      <Dialog open={issueModalOpen} onOpenChange={setIssueModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue New Document</DialogTitle>
            <DialogDescription>
              Issue a verified credential to a recipient's wallet address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Wallet Address</Label>
              <Input
                id="recipientAddress"
                name="recipientAddress"
                placeholder="e.g., 5FHneW7giQFo3vGMA..."
                className="font-mono text-sm"
                value={formData.recipientAddress}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Document File</Label>
              <div
                className={cn(
                  "relative border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
                  dragActive ? "border-primary bg-primary/5" : "hover:border-primary/50",
                  selectedFile ? "bg-muted/50" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload certificate
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter document details..."
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-muted/20 h-2 rounded overflow-hidden">
                  <div
                    className="h-2 bg-primary"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</div>
              </div>
            )}

            {successMessage && (
              <div className="text-sm text-success">{successMessage}</div>
            )}

            <Button
              className="w-full gradient-primary"
              onClick={handleSubmit}
              disabled={uploading || !selectedFile || !formData.recipientAddress}
            >
              <Send className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Issue Document'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      {/* custom wallet modal removed in favor of wallet-adapter UI */}
    </div>
  );
};

export default Issuer;
