import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shortAddress } from "@/shared/utils/transactions";
import { getContentUrl } from "@/shared/constant";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useInscriptionManagerContext } from "@/ui/utils/inscriptions-ctx";

interface Props {
  inscription: {
    content: string;
    inscription_id: string;
  };
}

const applyPixelation = (img?: HTMLImageElement) => {
  if (!img) return;

  if (img.naturalWidth < 100 || img.naturalHeight < 100) {
    img.style.imageRendering = "pixelated";
  }
};

const decodeHexString = (hexString: string) => {
  const bytes = new Uint8Array(
    hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  return new TextDecoder().decode(bytes);
};

const InscriptionCard: FC<Props> = ({ inscription }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        applyPixelation(imageRef.current);
      } else {
        imageRef.current.onload = () => {
          applyPixelation(imageRef.current!);
        };
      }
    }
  });

  useEffect(() => {
    try {
      setIsLoading(true);
      // Handle hex-encoded content if needed
      const decodedContent = inscription.content.startsWith('7b') 
        ? decodeHexString(inscription.content)
        : inscription.content;
      setContent(decodedContent);
    } catch (error) {
      console.error('Content decode error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inscription.content]);

  const renderJunkContent = (content: string) => {
    try {
      const data = JSON.parse(content);
      if (data.p === 'junk-20') {
        return (
          <div className="flex flex-col items-center justify-between h-full py-2">
            <div className="text-xs text-gray-400">
              {data.p}
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <div className="text-2xl font-bold">
                {data.tick}
              </div>
              <div className="text-sm mt-1">
                {data.amt}
              </div>
            </div>
            <div className="h-4" />
          </div>
        );
      }
      // If valid JSON but not junk-20, display centered
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm">
            {content}
          </div>
        </div>
      );
    } catch (e) {
      // If not valid JSON, display centered
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm">
            {content}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div
        className="cursor-pointer flex flex-col justify-center align-center relative"
        onClick={() => {
          navigate("/pages/inscription-details", {
            state: { inscription_id: inscription.inscription_id },
          });
        }}
      >
        <div className="rounded-xl w-full bg-slate-950 bg-opacity-50">
          {isLoading ? (
            <div className="h-38 w-38 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <div className="h-38 w-38">
              {renderJunkContent(content)}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 px-1 bg-black/50 backdrop-blur-sm left-0 text-xs text-white">
          {shortAddress(inscription.inscription_id, 6)}
        </div>
      </div>
    </div>
  );
};

export default InscriptionCard;

