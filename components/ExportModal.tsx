import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { getDocument, exportAsDOCX, exportAsHTML, exportAsPDF } from '@/lib/actions/room.actions';
import Image from 'next/image';

const ExportModal = ({ isOpen, onClose, roomId, userId  }: ExportModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: string) => {
    setLoading(true);
    try {
      const content = await getDocument({ roomId, userId });
      if (!content) {
        throw new Error('No content to export');
      }

      let fileData;
      switch (format) {
        case 'pdf':
          fileData = await exportAsPDF(roomId, userId); // Ensure these functions are properly implemented
          break;
        case 'docx':
          fileData = await exportAsDOCX(roomId, userId);
          break;
        case 'html':
          fileData = await exportAsHTML(roomId, userId);
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Trigger download or handle fileData as needed
    } catch (error) {
      console.error(`Failed to export document as ${format}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>
          <Button className="gradient-blue flex h-9 gap-1 px-4">   
          <Image 
            src='/assets/icons/export.svg'
            alt="Share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Export</p>
          </Button>
        </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogTitle className="text-lg font-semibold mb-4">
          Export Document
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => handleExport('PDF')}
            className="gradient-blue flex h-9 gap-1 px-4"
            disabled={loading}
          >
            Export as PDF
          </Button>
          <Button
            onClick={() => handleExport('DOCX')}
            className="gradient-blue flex h-9 gap-1 px-4"
            disabled={loading}
          >
            Export as DOCX
          </Button>
          <Button
            onClick={() => handleExport('HTML')}
            className="gradient-blue flex h-9 gap-1 px-4"
            disabled={loading}
          >
            Export as HTML
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
