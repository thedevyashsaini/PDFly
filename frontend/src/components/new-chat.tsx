import { SelectPdf } from "@/db/schema";
import { Subjects } from "@/subjects";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { redirect } from "next/navigation";

const NewChat = ({
  subject,
  pdfs,
}: {
  subject: Subjects;
  pdfs: SelectPdf[];
}) => {
  const [selectedPDFs, setSelectedPDFs] = useState<SelectPdf[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing Chat...");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (Object.keys(selectedPDFs).length <= 0) {
      return alert("You need atleast 1 PDF to initiate a chat.");
    }

    const data = {
      user_id: subject.properties.id,
      name: formData.get("name") as string,
      pdfs: selectedPDFs.map((pdf) => pdf.id),
    };

    console.log(data);

    setLoading(true);

    const chatResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/new`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!chatResponse.ok) {
      setLoading(false);
      throw new Error("Failed to initialise chat, please try again.");
    }

    const chatData = await chatResponse.json();

    if (!chatData.success) {
      setLoading(false);
      throw new Error("Failed to initialise chat, please try again.");
    }

    setLoadingText("Redirecting...");
    redirect(`/app/chat/${chatData.chat.id}`);
  };

  const handleSelectChange = (value: string) => {
    const selectedId = value;
    const selectedPDF = pdfs.find((pdf) => pdf.id === selectedId);
    if (selectedPDF && selectedPDFs.length < 3) {
      setSelectedPDFs([...selectedPDFs, selectedPDF]);
    }
  };

  const handleDeselect = (id: string) => {
    setSelectedPDFs(selectedPDFs.filter((pdf) => pdf.id !== id));
  };

  const availablePDFs = pdfs.filter(
    (pdf) => !selectedPDFs.some((selected) => selected.id === pdf.id)
  );
  return (
    <div className="w-full justify-center items-center flex flex-col items-center">
      {loading ? (
        <div className="w-full flex flex-col justify-start">{loadingText}</div>
      ) : (
        <form className="my-8 w-full mx-auto" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="name">Chat name</Label>
            <Input
              id="name"
              placeholder="Resume Updates"
              type="text"
              name="name"
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mt-4">
            <Label htmlFor="pdfs">PDFs:</Label>
            {selectedPDFs.length < 3 && (
              <Select onValueChange={handleSelectChange} value="">
                <SelectTrigger className="">
                  <SelectValue
                    placeholder="Add a PDF"
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
            type="submit"
          >
            Create &rarr;
            <BottomGradient />
          </button>
        </form>
      )}
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

export default NewChat;
