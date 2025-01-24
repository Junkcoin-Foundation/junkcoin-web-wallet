import { IAccountStats } from "./api";

export interface IAccount {
  id: number;
  balance?: number;
  inscriptionCounter?: number;
  inscriptionBalance?: number;
  name: string;
  address?: string;
  stats?: IAccountStats;
}
