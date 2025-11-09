import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Share2, CheckCircle, XCircle } from "lucide-react";

interface DocumentCardProps {
  name: string;
  issuer: string;
  timestamp: string;
  status: "active" | "revoked";
  category?: string;
  url?: string;
  recipient?: string;
}

const DocumentCard = ({ name, issuer, timestamp, status, category, url, recipient }: DocumentCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg w-min transition-all border-border hover:border-primary/50 h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">Issued by {issuer}</p>
          </div>
        </div>
        <Badge
          variant={status === "active" ? "default" : "destructive"}
          className="flex items-center space-x-1"
        >
          {status === "active" ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <XCircle className="h-3 w-3 mr-1" />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        {category && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span className="text-foreground font-medium">{category}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Timestamp:</span>
          <span className="text-foreground">{timestamp}</span>
        </div>
      </div>

      {recipient && (
        <div className="text-xs text-muted-foreground mb-3">Recipient: <span className="font-mono">{recipient}</span></div>
      )}

      <div className="flex space-x-2 mt-4">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Open
            </Button>
          </a>
        ) : (
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}

        {/* 'More' action removed per request */}
      </div>
    </Card>
  );
};

export default DocumentCard;
