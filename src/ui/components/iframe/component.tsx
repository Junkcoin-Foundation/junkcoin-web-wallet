import { FC, useState, useEffect } from "react";
import cn from "classnames";
import { TailSpin } from "react-loading-icons";

export type IframeProps = {
  preview: string;
  size: keyof typeof SIZES;
  extractSelector?: string;
};

const SIZES = {
  default: "w-36 h-36",
  big: "w-[318px] h-[318px]",
};

const Iframe: FC<IframeProps> = ({ preview, size, extractSelector }) => {
  const [loaded, setLoaded] = useState(false);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (extractSelector) {
      console.log('Fetching from URL:', preview);
      fetch(preview)
        .then(res => {
          console.log('Fetch response status:', res.status);
          return res.text();
        })
        .then(html => {
          console.log('Received HTML:', html);
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          console.log('Parsed document:', doc);
          const element = doc.querySelector(extractSelector);
          console.log('Found element with selector:', extractSelector, element);
          if (element) {
            const textContent = element.textContent || '';
            console.log('Element text content:', textContent);
            setContent(textContent);
          }
        })
        .catch(error => {
          console.error('Error in iframe fetch:', error);
        });
    }
  }, [preview, extractSelector]);

  if (extractSelector && content) {
    console.log('Rendering pre with content:', content);
    return (
      <div className={cn("overflow-hidden rounded-xl bg-black relative", SIZES[size])}>
        <pre style={{ fontSize: 'min(3.094vw, 95vh)', opacity: 1 }}>{content}</pre>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black relative">
      {!loaded && (
        <div
          className={cn(
            "bg-input-bg flex justify-center items-center inset-0 absolute"
          )}
        >
          <TailSpin className="animate-spin" />
        </div>
      )}

      <iframe
        id="frame"
        onClick={(e) => e.preventDefault()}
        className={SIZES[size]}
        src={preview}
        sandbox="allow-scripts"
        scrolling="no"
        onLoad={() => {
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default Iframe;
