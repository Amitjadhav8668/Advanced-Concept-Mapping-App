import { useState } from 'react';
import { 
  Share2, 
  Mail, 
  MessageSquare, 
  Copy, 
  QrCode,
  Download,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mapData: any;
}

export function ShareDialog({ isOpen, onClose, mapData }: ShareDialogProps) {
  const [shareUrl] = useState(`${window.location.origin}/share/${Math.random().toString(36).substr(2, 9)}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Check out my Concept Map');
    const body = encodeURIComponent(
      `I've created an interactive concept map that I'd like to share with you!\n\n` +
      `View it here: ${shareUrl}\n\n` +
      `This map contains ${mapData.nodes?.length || 0} concepts and ${mapData.edges?.length || 0} connections.\n\n` +
      `Created with ConceptMap Pro`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    toast.success('Opening Gmail...');
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Check out my interactive concept map! 🧠\n\n` +
      `${shareUrl}\n\n` +
      `It has ${mapData.nodes?.length || 0} concepts and ${mapData.edges?.length || 0} connections.\n\n` +
      `Created with ConceptMap Pro ✨`
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleDownloadQR = () => {
    // Generate QR code for the share URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'concept-map-qr.png';
    link.click();
    toast.success('QR code downloaded!');
  };

  const handleExportImage = () => {
    // This would capture the canvas as an image
    toast.success('Image export started... (Feature coming soon)');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Concept Map
          </DialogTitle>
          <DialogDescription>
            Share your concept map with others or export it for presentation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Link Section */}
          <div className="space-y-3">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view your concept map
            </p>
          </div>

          <Separator />

          {/* Quick Share Options */}
          <div className="space-y-3">
            <Label>Quick Share</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleShareEmail}
                className="justify-start gap-2"
              >
                <Mail className="w-4 h-4 text-red-500" />
                Gmail
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShareWhatsApp}
                className="justify-start gap-2"
              >
                <MessageSquare className="w-4 h-4 text-green-500" />
                WhatsApp
              </Button>
            </div>
          </div>

          <Separator />

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Export & Download</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleDownloadQR}
                className="justify-start gap-2"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportImage}
                className="justify-start gap-2"
              >
                <Download className="w-4 h-4" />
                Image
              </Button>
            </div>
          </div>

          {/* Map Statistics */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{mapData.nodes?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Concepts</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{mapData.edges?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Connections</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{mapData.viewMode || 'Free-flow'}</div>
                <div className="text-xs text-muted-foreground">Layout</div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}