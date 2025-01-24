import type {
  ApiUTXO,
  IAccountStats,
  ITransaction,
} from "@/shared/interfaces/api";
import {
  ContentDetailedInscription,
  ContentInscriptionResopnse,
  FindInscriptionsByOutpointResponseItem,
} from "@/shared/interfaces/inscriptions";
import { IToken } from "@/shared/interfaces/token";
import { customFetch, fetchProps } from "@/shared/utils";
import { storageService } from "../services";
import { DEFAULT_FEES } from "@/shared/constant";
import { isValidTXID } from "@/ui/utils";

export interface UtxoQueryParams {
  hex?: boolean;
  amount?: number;
}

export interface IApiController {
  getUtxos(
    address: string,
    params?: UtxoQueryParams
  ): Promise<ApiUTXO[] | undefined>;
  pushTx(rawTx: string): Promise<{ txid?: string; error?: string }>;
  getTransactions(address: string): Promise<ITransaction[] | undefined>;
  getPaginatedTransactions(
    address: string,
    txid: string
  ): Promise<ITransaction[] | undefined>;
  getJKCPrice(): Promise<{ usd: number } | undefined>;
  getLastBlockJKC(): Promise<number | undefined>;
  getFees(): Promise<{ fast: number; slow: number } | undefined>;
  getAccountStats(address: string): Promise<IAccountStats | undefined>;
  getTokens(address: string): Promise<IToken[] | undefined>;
  getTransactionHex(txid: string): Promise<string | undefined>;
  getTransaction(txid: string): Promise<ITransaction | undefined>;
  getUtxoValues(outpoints: string[]): Promise<number[] | undefined>;
  getContentPaginatedInscriptions(
    address: string,
    page: number
  ): Promise<ContentInscriptionResopnse | undefined>;
  searchContentInscriptionByInscriptionId(
    inscriptionId: string
  ): Promise<ContentDetailedInscription | undefined>;
  searchContentInscriptionByInscriptionNumber(
    address: string,
    number: number
  ): Promise<ContentInscriptionResopnse | undefined>;
  getLocationByInscriptionId(
    inscriptionId: string
  ): Promise<{ location: string; owner: string } | undefined>;
  findInscriptionsByOutpoint(data: {
    outpoint: string;
    address: string;
  }): Promise<FindInscriptionsByOutpointResponseItem[] | undefined>;
}

type FetchType = <T>(
  props: Omit<fetchProps, "network">
) => Promise<T | undefined>;

class ApiController implements IApiController {
  private fetch: FetchType = async (p: Omit<fetchProps, "network">) => {
    try {
      return await customFetch({
        ...p,
        network: storageService.appState.network,
      });
    } catch {
      return;
    }
  };

  async getUtxos(address: string, params?: UtxoQueryParams) {
    const data = await this.fetch<ApiUTXO[]>({
      path: `/address/${address}/utxo`,
      params: params as Record<string, string>,
      service: "electrs",
    });
    if (Array.isArray(data)) {
      return data;
    }
  }

  async getFees() {
    const data = await this.fetch<Record<string, number>>({
      path: "/fee-estimates",
      service: "electrs",
    });
    if (data) {
      return {
        slow: "6" in data ? Number(data["6"].toFixed(0)) : DEFAULT_FEES.slow,
        fast:
          "2" in data ? Number(data["2"].toFixed(0)) + 1 : DEFAULT_FEES.fast,
      };
    }
  }

  async pushTx(rawTx: string) {
    const data = await this.fetch<string>({
      path: "/tx",
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      json: false,
      body: rawTx,
      service: "electrs",
    });
    if (isValidTXID(data) && data) {
      return {
        txid: data,
      };
    } else {
      return {
        error: data,
      };
    }
  }

  async getTransactions(address: string): Promise<ITransaction[] | undefined> {
    return await this.fetch<ITransaction[]>({
      path: `/address/${address}/txs`,
      service: "electrs",
    });
  }

  async getPaginatedTransactions(
    address: string,
    txid: string
  ): Promise<ITransaction[] | undefined> {
    try {
      return await this.fetch<ITransaction[]>({
        path: `/address/${address}/txs/chain/${txid}`,
        service: "electrs",
      });
    } catch (e) {
      return undefined;
    }
  }

  async getLastBlockJKC() {
    const data = await this.fetch<string>({
      path: "/blocks/tip/height",
      service: "electrs",
    });
    if (data) {
      return Number(data);
    }
  }

  async getJKCPrice() {
    const data = await this.fetch<{ usd: number }>({
      path: "/last-price",
      service: "electrs",
    });
    if (!data) {
      return undefined;
    }
    return {
      usd: data.usd,
    };
  }


  async getAccountStats(address: string): Promise<IAccountStats | undefined> {
    try {
      return await this.fetch({
        path: `/address/${address}/stats`,
        service: "electrs",
      });
    } catch {
      return { amount: 0, count: 0, balance: 0 };
    }
  }

  async getTokens(address: string): Promise<IToken[] | undefined> {
    return await this.fetch<IToken[]>({
      path: `/address/${address}/tokens`,
      service: "electrs",
    });
  }

  async getTransaction(txid: string) {
    return await this.fetch<ITransaction>({
      path: "/tx/" + txid,
      service: "electrs",
    });
  }

  async getTransactionHex(txid: string) {
    return await this.fetch<string>({
      path: "/tx/" + txid + "/hex",
      json: false,
      service: "electrs",
    });
  }

  async getUtxoValues(outpoints: string[]) {
    const result = await this.fetch<{ values: number[] }>({
      path: "/prev",
      body: JSON.stringify({ locations: outpoints }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      service: "electrs",
    });
    return result?.values;
  }

  async getContentPaginatedInscriptions(address: string, page: number) {
    return await this.fetch<ContentInscriptionResopnse>({
      path: `/inscriptions/balance/${address}/${page}`,
      service: "content",
    });
  }

  async searchContentInscriptionByInscriptionId(inscriptionId: string) {
    const htmlContent = await this.fetch<string>({
      path: `/inscription/${inscriptionId}`,
      service: "content",
      json: false,
    });

    if (!htmlContent) return;

    const preMatch = htmlContent.match(/<pre[^>]*>(.*?)<\/pre>/s);
    if (!preMatch?.[1]) return;

    const genesisHeight = htmlContent.match(/genesis height[^>]*>(\d+)</)?.[1];
    const genesisFee = htmlContent.match(/genesis fee[^>]*>(\d+)</)?.[1];
    const contentType = htmlContent.match(/content type[^>]*>([\w/; -]+)</)?.[1];
    const contentLength = htmlContent.match(/content length[^>]*>(\d+)/)?.[1];
    const timestamp = htmlContent.match(/timestamp[^>]*>([^<]+UTC)/)?.[1];

    try {
      const jsonContent = JSON.parse(preMatch[1]);
      const created = timestamp ? new Date(timestamp).getTime() / 1000 : 0;

      return {
        number: 0,
        id: inscriptionId,
        file_type: contentType?.includes('json') ? 'JSON' : 'TXT',
        mime: contentType || 'text/plain',
        file_size: parseInt(contentLength || '0'),
        created: Math.floor(created),
        creation_block: parseInt(genesisHeight || '0'),
        genesis_fee: parseInt(genesisFee || '0'),
        invalid_token_reason: null,
        protocol: {
          name: jsonContent?.p || '',
          valid: true,
          invalid_reason: null,
          invalid_token_reason: null
        },
        collection: null
      } as ContentDetailedInscription;
    } catch {
      return;
    }
  }

  async searchContentInscriptionByInscriptionNumber(
    address: string,
    number: number
  ) {
    return await this.fetch<ContentInscriptionResopnse>({
      path: `/search?account=${address}&page_size=6&page=1&from=${number}&to=${number}`,
      service: "content",
    });
  }

  async getLocationByInscriptionId(inscriptionId: string) {
    return await this.fetch<{ location: string; owner: string }>({
      path: `/location/${inscriptionId}`,
      service: "electrs",
    });
  }

  async findInscriptionsByOutpoint(data: {
    outpoint: string;
    address: string;
  }) {
    return await this.fetch<FindInscriptionsByOutpointResponseItem[]>({
      path: `/find_meta/${data.outpoint}?address=${data.address}`,
      service: "electrs",
    });
  }
}

export default new ApiController();