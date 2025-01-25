import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import InscriptionCard from "@/ui/components/inscription-card";
import Pagination from "@/ui/components/pagination";
import { t } from "i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useInscriptionManagerContext } from "@/ui/utils/inscriptions-ctx";
import { TailSpin } from "react-loading-icons";
import { ContentInscription } from "@/shared/interfaces/inscriptions";

const Inscriptions = () => {
  const {
    inscriptions,
    currentPage,
    setCurrentPage,
    loading: managerLoading,
    searchInscriptions,
    updateInscriptions,
  } = useInscriptionManagerContext();
  const currentAccount = useGetCurrentAccount();
  const [combinedInscriptions, setCombinedInscriptions] = useState(inscriptions);

  const fetchJunk20Inscriptions = async () => {
    if (!currentAccount?.address) return;
    
    try {
      const response = await fetch(`https://ord.junkiewally.xyz/junk20/balance/${currentAccount.address}`);
      const data = await response.json();
      
      // Extract all inscription IDs from junk20 data and ensure uniqueness
      const junk20Inscriptions = [...new Map(
        data.junk20?.flatMap((token: any) => 
          token.utxos.map((utxo: any) => [
            utxo.inscription_id,
            {
              inscription_id: utxo.inscription_id,
              inscription_number: utxo.inscription_number,
              junk20Data: {
                tick: token.tick,
                balance: utxo.junk20.balance,
                operation: utxo.junk20.operation,
              }
            }
          ])
        ) || []
      ).values()];

      // For page 1: if we have 3 regular inscriptions, we show 7 junk20s (indices 0-6)
      // For page 2: if we have 1 regular inscription, we show 9 junk20s (indices 7-15)
      const junk20StartIndex = currentPage === 1 ? 0 : 7;
      const availableSlots = 10 - (inscriptions?.length || 0);
      
      const pageJunk20Inscriptions = junk20Inscriptions.slice(
        junk20StartIndex,
        junk20StartIndex + availableSlots
      ) as ContentInscription[];

      // Combine with existing inscriptions
      const combined = [...(inscriptions || []), ...pageJunk20Inscriptions];
      setCombinedInscriptions(combined);
    } catch (error) {
      console.error('Error fetching junk20 inscriptions:', error);
    }
  };

  useEffect(() => {
    fetchJunk20Inscriptions();
  }, [currentAccount?.address, inscriptions]);

  const changePage = async (page: number) => {
    if (!managerLoading) setCurrentPage(page);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateInscriptions(currentPage);
  }, [currentPage, updateInscriptions]);

  if (
    (currentAccount?.inscriptionCounter === undefined && managerLoading) ||
    !inscriptions
  ) return <TailSpin className="animate-spin" />;

  return (
    <div className={s.inscriptionDiv}>
      <div className="flex flex-col h-full w-full overflow-hidden pb-8 standard:pb-16">
        <div className={s.gridContainer}>
          {(typeof searchInscriptions === "undefined"
            ? combinedInscriptions ?? []
            : searchInscriptions
          ).map((f, i) => (
            <InscriptionCard key={i} inscription={f}/>
          ))}
        </div>
      </div>

      {(typeof searchInscriptions !== "undefined" && searchInscriptions.length) ||
      (typeof searchInscriptions === "undefined" && (inscriptions.length || combinedInscriptions?.length)) ? (
        <div className="w-full absolute bottom-0 p-3">
          <Pagination
            currentPage={currentPage}
            onPageChange={changePage}
            pageCount={Math.ceil(
              ((typeof searchInscriptions === "undefined"
                ? currentAccount?.inscriptionCounter
                : searchInscriptions?.length) ?? 0) / 10
            )}
            visiblePageButtonsCount={5}
            leftBtnPlaceholder={<ChevronLeftIcon className="w-4 h-4" />}
            rightBtnPlaceholder={<ChevronRightIcon className="w-4 h-4" />}
            className={s.pagination}
          />
        </div>
      ) : (
        <div className="flex w-full h-4/5 bottom-0 items-center justify-center absolute">
          <p>{t("inscriptions.inscription_not_found")}</p>
        </div>
      )}
    </div>
  );
};

export default Inscriptions;
