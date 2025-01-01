import { createHashRouter, Navigate } from "react-router-dom";

import Wallet from "@/ui/pages/main/wallet";

import PagesLayout from "@/ui/components/layout";
import Login from "@/ui/pages/main/login";
import CreatePassword from "./main/create-password";
import Home from "./main/home";
import Inscriptions from "./main/inscriptions";
import InscriptionDetails from "./main/inscriptions/inscription-details";
import CreateNewAccount from "./main/new-account";
import NewWallet from "./main/new-wallet";
import NewMnemonic from "./main/new-wallet/new-mnemonic";
import RestoreMnemonic from "./main/new-wallet/restore-mnemonic";
import RestorePrivKey from "./main/new-wallet/restore-priv-key";
import Receive from "./main/receive";
import ConfirmSend from "./main/send/confirm-send";
import CreateSend from "./main/send/create-send";
import FinalleSend from "./main/send/finalle-send";
import Settings from "./main/settings";
import ConnectedSites from "./main/settings/connected-sites";
import Language from "./main/settings/language";
import Security from "./main/settings/security";
import ChangePassword from "./main/settings/security/change-password";
import ChangeAddrType from "./main/settings/wallet/change-addr-type";
import WalletSettings from "./main/settings/wallet/component";
import SwitchAccount from "./main/switch-account";
import ShowPk from "./main/switch-account/show-pk";
import SwitchWallet from "./main/switch-wallet";
import ShowMnemonic from "./main/switch-wallet/show-mnemonic";
import TokensComponent from "./main/tokens/component";
import TransactionInfo from "./main/transaction-info";
import Connect from "./provider/connect";
import CreateTx from "./provider/create-tx/component";
import InscribeTransfer from "./provider/inscribe-transfer";
import MultiPsbtSign from "./provider/multi-psbt-sign";
import SignMessage from "./provider/sign-message";
import SignPsbt from "./provider/sign-psbt";
import NetworkSettings from "./main/settings/wallet/network";

export const guestRouter = createHashRouter([
  {
    path: "account",
    children: [
      { path: "login", element: <Login /> },
      { path: "create-password", element: <CreatePassword /> },
    ],
  },
  { path: "*", element: <Navigate to={"/account/login"} /> },
]);

export const authenticatedRouter = createHashRouter([
  { path: "/", element: <Home /> },
  {
    path: "home",
    element: <Wallet />,
  },
  {
    path: "pages",
    element: <PagesLayout />,
    children: [
      { path: "settings", element: <Settings /> },
      { path: "switch-account", element: <SwitchAccount /> },
      { path: "create-new-account", element: <CreateNewAccount /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "receive", element: <Receive /> },
      { path: "switch-wallet", element: <SwitchWallet /> },
      { path: "create-new-wallet", element: <NewWallet /> },
      { path: "new-mnemonic", element: <NewMnemonic /> },
      { path: "restore-mnemonic", element: <RestoreMnemonic /> },
      { path: "restore-priv-key", element: <RestorePrivKey /> },
      { path: "show-pk/:accId", element: <ShowPk /> },
      { path: "show-mnemonic/:walletId", element: <ShowMnemonic /> },
      { path: "change-addr-type", element: <ChangeAddrType /> },
      { path: "transaction-info/:txId", element: <TransactionInfo /> },
      { path: "finalle-send/:txId", element: <FinalleSend /> },
      { path: "create-send", element: <CreateSend /> },
      { path: "confirm-send", element: <ConfirmSend /> },
      { path: "connected-sites", element: <ConnectedSites /> },
      { path: "language", element: <Language /> },
      { path: "security", element: <Security /> },
      { path: "inscription-details", element: <InscriptionDetails /> },
      { path: "inscriptions", element: <Inscriptions /> },
      { path: "wallet-settings", element: <WalletSettings /> },
      { path: "network-settings", element: <NetworkSettings /> },
      {
        path: "bel-20",
        element: <TokensComponent />,
      },
    ],
  },
  {
    path: "provider",
    children: [
      { path: "connect", element: <Connect /> },
      { path: "signMessage", element: <SignMessage /> },
      { path: "createTx", element: <CreateTx /> },
      { path: "signPsbt", element: <SignPsbt /> },
      { path: "inscribeTransfer", element: <InscribeTransfer /> },
      { path: "multiPsbtSign", element: <MultiPsbtSign /> },
    ],
  },
  { path: "*", element: <Navigate to={"/"} /> },
]);