import { SelectPdf } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Subjects } from "@/subjects";
import { PDFUpload } from "./pdf-upload";

const ChatPDFUpload = ({
  allPdfs,
  currentPDFs,
  subject,
  chat_id,
  onUpload,
}: {
  allPdfs: SelectPdf[];
  currentPDFs: SelectPdf[];
  onUpload: (pdfs: SelectPdf[]) => void;
  subject: Subjects;
  chat_id: string;
}) => {
  const [selectedPDFs, setSelectedPDFs] = useState<SelectPdf[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const availablePDFs = allPdfs.filter(
    (pdf) =>
      !selectedPDFs.some((selected) => selected.id === pdf.id) &&
      !currentPDFs.some((current) => current.id === pdf.id)
  );

  const addExistingPDF = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/new/pdf`,
      {
        method: "POST",
        body: JSON.stringify({
            user_id: subject.properties.id,
            chat_id,
            pdf_id: selectedPDFs[0].id,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add PDF to chat");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to add PDF to chat");
    }

    setLoading(false);
    onUpload([selectedPDFs[0]]);
  };

  const handleSelectChange = (value: string) => {
    const selectedId = value;
    const selectedPDF = allPdfs.find((pdf) => pdf.id === selectedId);
    if (selectedPDF && selectedPDFs.length < Math.min(1, 3 - currentPDFs.length)) {
      setSelectedPDFs([...selectedPDFs, selectedPDF]);
    }
  };

  const handleDeselect = (id: string) => {
    setSelectedPDFs(selectedPDFs.filter((pdf) => pdf.id !== id));
  };

  return (
    <div className="w-full py-4 px-4 mx-auto border bg-black border-neutral-800 rounded-lg">
      {!showUpload ? (
        <div className="mb-8 w-full">
          <LabelInputContainer>
            {selectedPDFs.length < Math.min(1, 3 - currentPDFs.length) && (
              <Select onValueChange={handleSelectChange} value="">
                <SelectTrigger className="border-[#303030]">
                  <SelectValue
                    placeholder="Select a PDF"
                    className="placeholder:text-muted-foreground"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your PDFs</SelectLabel>
                    {availablePDFs.map((pdf) => (
                      <SelectItem value={pdf.id} key={pdf.id}>
                        {pdf.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </LabelInputContainer>
          <div className="mb-4 space-y-2">
            {selectedPDFs.map((pdf) => (
              <div key={pdf.id} className="flex items-center mt-4">
                <button
                  onClick={() => handleDeselect(pdf.id)}
                  className="mr-2 -mt-1 font-mono text-sm text-white border rounded-full w-4 h-4 flex items-center justify-center"
                >
                  x
                </button>
                <span className="text-sm">{pdf.name}</span>
              </div>
            ))}
          </div>
          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            onClick={addExistingPDF}
            disabled={loading}
          >
            Add to Context &rarr;
            <BottomGradient />
          </button>
        </div>
      ) : (
        <PDFUpload subject={subject} chat_id={chat_id} onUpload={onUpload} />
      )}

      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <button
        className="px-4 mb-4 bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        onClick={() => setShowUpload(!showUpload)}
        disabled={loading}
      >
        {!showUpload ? `Upload New` : "Add Existing"} &#43;
        <BottomGradient />
      </button>
    </div>
  );
};

export default ChatPDFUpload;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
