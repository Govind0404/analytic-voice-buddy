import { FC, useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import Papa from 'papaparse';

interface FileUploaderProps {
  onDataProcessed: (data: any[], filename: string) => void;
  disabled?: boolean;
}

export const FileUploader: FC<FileUploaderProps> = ({ onDataProcessed, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const filename = file.name;
    const fileExtension = filename.toLowerCase().split('.').pop();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "CSV Parse Error",
              description: "There was an error parsing the CSV file.",
              variant: "destructive"
            });
            return;
          }

          const data = results.data as any[];
          if (data.length === 0) {
            toast({
              title: "Empty File",
              description: "The CSV file appears to be empty.",
              variant: "destructive"
            });
            return;
          }

          onDataProcessed(data, filename);
          toast({
            title: "File Uploaded Successfully",
            description: `Processed ${data.length} rows from ${filename}`,
          });
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Papa Parse error:', error);
          toast({
            title: "File Processing Error",
            description: "Failed to process the CSV file.",
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={handleFileSelect}
        disabled={disabled}
        variant="outline"
        size="sm"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
};