import { parse } from 'papaparse';
import { Iguana } from '@lib/interfaces';

type FileUploadHandlerProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  setMarkersIguanas: (data: Iguana[]) => void;
};

export default function FileUploadHandler({ fileInputRef, setMarkersIguanas }: FileUploadHandlerProps) {
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      parse(file, {
        complete: (results) => {
          const data = results.data as Iguana[];
          setMarkersIguanas(data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleCSVUpload}
        accept=".csv"
      />
    </>
  )
}