import { FC, useState, useEffect } from "react";

import { IField } from "@/shared/interfaces/provider";
import { t } from "i18next";
import cn from "classnames";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useAppState } from "@/ui/states/appState";
import { ss } from "@/ui/utils";
import { getContentUrl } from "@/shared/constant";

interface SignPsbtFiledsProps {
  fields: IField[];
  setModalInputIndexHandler: (value: number) => void;
}

const SignPsbtFileds: FC<SignPsbtFiledsProps> = ({
  fields,
  setModalInputIndexHandler,
}) => {
  const { network } = useAppState(ss(["network"]));
  const [inscriptionContents, setInscriptionContents] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fields.forEach(f => {
      console.log('Processing field:', f);
      if (f.value.inscriptions) {
        console.log('Found inscriptions:', f.value.inscriptions);
        f.value.inscriptions.forEach(k => {
          const url = `${getContentUrl()}/inscription/${k}`;
          console.log('Fetching from URL:', url);
          
          fetch(url)
            .then(res => {
              console.log('Fetch response status:', res.status);
              return res.text();
            })
            .then(html => {
              console.log('Received HTML:', html);
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const element = doc.querySelector('pre');
              console.log('Found pre element:', element);
              if (element) {
                const content = element.textContent || '';
                console.log('Pre element content:', content);
                setInscriptionContents(prev => {
                  const newState = {
                    ...prev,
                    [k]: content
                  };
                  console.log('Updated inscription contents:', newState);
                  return newState;
                });
              }
            })
            .catch(error => {
              console.error('Error fetching inscription:', error);
            });
        });
      }
    });
  }, [fields, network]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {fields.map((f, i) => (
        <div key={i}>
          <label className="mb-2 flex text-gray-300 pl-2 justify-between">
            <span>
              {f.label}{" "}
              {f.important && f.input ? (
                <span className="text-light-orange border-2 rounded-lg border-light-orange p-1 ml-2">
                  To sign
                </span>
              ) : undefined}
            </span>
            {f.value.anyonecanpay && f.important && (
              <span>
                <ExclamationTriangleIcon
                  className="w-6 h-6 text-light-orange cursor-pointer"
                  onClick={() => {
                    setModalInputIndexHandler(i);
                  }}
                />
              </span>
            )}
          </label>
          <div
            className={cn(
              "rounded-xl px-5 py-2 break-all w-full flex justify-center border-2 bg-input-bg",
              {
                "border-input-bg": true,
              }
            )}
          >
            {f.value.inscriptions !== undefined ? (
              <div className="flex justify-center rounded-xl w-33 h-33 overflow-hidden">
                {f.value.inscriptions.map((k, j) => (
                  <div
                    key={j}
                    className="flex flex-col items-center justify-center p-2"
                  >
                    {<pre 
                        className="object-cover w-full rounded-xl"
                        style={{
                          fontSize: 'min(3.094vw, 95vh)',
                          opacity: 1,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {inscriptionContents[k]}
                      </pre>
                      }
                    <p className="text-xs">
                      {t("inscription_details.value") + ": "}
                      {f.value.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>
                  {f.input ? "Utxo txid: " : t("provider.to_address") + ": "}
                  {f.value.text}
                </p>
                <p>
                  {t("inscription_details.value") + ": "}
                  {f.value.value}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignPsbtFileds;
