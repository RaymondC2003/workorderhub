import { useRef } from "react";

type CsvUploadProps = {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  accept?: string;
};

export default function CsvUpload({
  onFileSelect,
  uploading,
  accept = ".csv",
}: CsvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <div className="border border-dashed border-slate-300 rounded-lg p-6 bg-slate-50/50">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Choose CSV file"}
      </button>
      <p className="text-sm text-slate-600 mt-2">
        Only .csv files, max 2MB. Required columns: title, description,
        department, priority, requesterName. Optional: assignee.
      </p>
    </div>
  );
}
