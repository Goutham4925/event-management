import { X } from "lucide-react";

interface LegalModalProps {
  open: boolean;
  title: string;
  content?: string;
  onClose: () => void;
}

const LegalModal = ({ open, title, content, onClose }: LegalModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-card border rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <h2 className="font-serif text-2xl font-bold mb-4">{title}</h2>

        <div
          className="prose prose-sm max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: content || "<p>No content available</p>",
          }}
        />
      </div>
    </div>
  );
};

export default LegalModal;
