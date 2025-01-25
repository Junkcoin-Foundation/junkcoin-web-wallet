import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shortAddress } from "@/shared/utils/transactions";

interface Props {
  inscription: {
    inscription_id: string;
    junk20Data?: {
      tick: string;
      balance: string;
      operation: string;
    };
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
  const [inscriptionType, setInscriptionType] = useState<'junkinals' | 'junk20' | 'junkmap' | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://ord.junkiewally.xyz/content/${inscription.inscription_id}`);
        const data = await response.text();
        
        // Determine inscription type
        if (data.includes('junk-20')) {
          setInscriptionType('junk20');
        } else if (data.endsWith('.junkmap')) {
          setInscriptionType('junkmap');
        } else {
          setInscriptionType('junkinals');
        }
        
        setContent(data);
      } catch (error) {
        console.error('Content fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [inscription.inscription_id]);

  const renderContent = () => {
    if (inscriptionType === 'junkmap') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm">
            {content}
          </div>
        </div>
      );
    }

    if (inscriptionType === 'junk20') {
      try {
        const data = inscription.junk20Data || JSON.parse(content);
        return (
          <div className="flex flex-col items-center justify-between h-full py-2">
            <div className="text-xs text-gray-400">
              {data.operation || data.p}
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <div className="text-2xl font-bold">
                {data.tick}
              </div>
              <div className="text-sm mt-1">
                {data.operation === 'deploy' ? 'deploy' : (data.balance || data.amt)}
              </div>
            </div>
            <div className="h-4" />
          </div>
        );
      } catch (e) {
        console.error('JSON parse error:', e);
        return null;
      }
    }

    // For junkinals (images)
    return (
      <div 
        className="h-full w-full [image-rendering:pixelated]"
        style={{
          backgroundImage: `url(https://ord.junkiewally.xyz/content/${inscription.inscription_id})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      >
        <img 
          src={`https://ord.junkiewally.xyz/content/${inscription.inscription_id}`}
          alt="Inscription"
          className="h-full w-full opacity-0"
        />
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div
        className="flex flex-col justify-center align-center relative"
        // onClick={() => {
        //   navigate("/pages/inscription-details", {
        //     state: { inscription_id: inscription.inscription_id },
        //   });
        // }}
      >
        <div className="rounded-xl w-full bg-slate-950 bg-opacity-50">
          {isLoading ? (
            <div className="h-38 w-38 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <div className="h-38 w-38">
              {renderContent()}
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

