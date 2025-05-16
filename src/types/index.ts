export interface Currency {
  coin_id: string;
  name: string;
  symbol: string;
  colorful_image_url: string;
  gray_image_url: string;
  token_decimal: number;
}

export interface Rate {
  from_currency: string;
  to_currency: string;
  rates: {
    amount: string;
    rate: string;
  }[];
  time_stamp: number;
}

export interface Balance {
  currency: string;
  amount: number;
  usdValue?: number;
  tokenDecimal?: number; // Added for rendering precision
}


export interface ApiResponse<T> {
  ok: boolean;
  warning?: string;
  currencies?: T[];
  tiers?: T[];
  wallet?: T[];
}

export interface WalletData {
  currencies: Currency[];
  rates: Rate[];
  balances: Balance[];
} 