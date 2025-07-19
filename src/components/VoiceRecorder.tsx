import { FC, useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder: FC<VoiceRecorderProps> = ({ onTranscriptionComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setIsTranscribing(false);
          setIsRecording(false);
          onTranscriptionComplete(finalTranscript.trim());
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsTranscribing(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an issue with voice recognition. Please try again.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
        setIsTranscribing(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onTranscriptionComplete, toast]);

  const startRecording = async () => {
    if (!recognition) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      recognition.start();
      
      // Auto-stop after 10 seconds of recording
      timeoutRef.current = setTimeout(() => {
        if (recognition && isRecording) {
          recognition.stop();
        }
      }, 10000);
      
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsTranscribing(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (!isSupported) {
    return (
      <Button disabled variant="outline" size="sm">
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      className={isRecording ? "animate-pulse" : ""}
    >
      {isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isTranscribing && <span className="ml-2 text-xs">Processing...</span>}
    </Button>
  );
};