import { usePushJKCTxCallback } from "@/ui/hooks/transactions";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateAddressBook } from "@/ui/hooks/app";
import { t } from "i18next";
import { useUpdateCurrentAccountBalance } from "@/ui/hooks/wallet";
import { useTransactionManagerContext } from "@/ui/utils/tx-ctx";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useAppState } from "@/ui/states/appState";
import { getNetworkCurrency } from "@/ui/utils";
import { ss } from "@/ui/utils";

const ConfirmSend = () => {
  const location = useLocation();
  const pushTx = usePushJKCTxCallback();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const updateAddressBook = useUpdateAddressBook();
  const updateBalance = useUpdateCurrentAccountBalance();
  const { updateTransactions } = useTransactionManagerContext();
  const currentAccount = useGetCurrentAccount();
  const { network } = useAppState(ss(["network"]));
  const confirmSend = async () => {
    setLoading(true);
    try {
      const data = await pushTx(location.state.hex);
      console.log(data);
      if (!data) {
        throw new Error("Failed pushing transaction");
      }

      setTimeout(() => {
        updateBalance().catch(console.error);
        if (currentAccount?.address) {
          updateTransactions(currentAccount.address).catch(console.error);
        }
      }, 100);

      navigate(`/pages/finalle-send/${data}`);

      if (location.state.save) {
        await updateAddressBook(location.state.toAddress);
      }
    } catch (e) {
      toast.error((e as Error).message);
      console.error(e);
      navigate(-1);
    }
  };

  const fields = [
    {
      label: t("send.confirm_send.to_addrses"),
      value: location.state.toAddress,
    },
    {
      label: t("send.confirm_send.from_address"),
      value: location.state.fromAddress,
    },
    {
      label: t(
        `send.confirm_send.${
          location.state.inscriptionTransaction ? "inscription_id" : "amount"
        }`
      ),
      value:
        location.state.amount +
        (location.state.inscriptionTransaction ? "" : " " + getNetworkCurrency(network)),
    },
    {
      label: t("send.confirm_send.fee"),
      value: `${location.state.feeAmount / 10 ** 8} ${getNetworkCurrency(network)} (${
        location.state.includeFeeInAmount
          ? t("send.confirm_send.included")
          : t("send.confirm_send.not_included")
      })`,
    },
  ];

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.container}>
          {fields.map((i) => (
            <div key={i.label} className={s.item}>
              <div className={cn(s.label, "input-span")}>{i.label}</div>
              <div className={s.input}>{i.value}</div>
            </div>
          ))}
        </div>
        <button
          disabled={loading}
          className={"bottom-btn"}
          onClick={confirmSend}
        >
          {t("send.confirm_send.confirm")}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSend;
