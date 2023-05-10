import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  CHAIN_ID,
  NEUTRON_DENOM,
  CHAIN_NAME,
  GAS_PRICE,
  RPC_ENDPOINT,
  REST_ENDPOINT
} from './constants';
import { GasPrice } from '@cosmjs/stargate';
import { Decimal } from '@cosmjs/math';

export const RPC = () =>  {
  return RPC_ENDPOINT;
};

export const networkSetup = () => {
    typeof window !== 'undefined' &&
    window.keplr &&
    window.keplr.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      rpc: RPC_ENDPOINT,
      rest: REST_ENDPOINT,
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'neutron',
        bech32PrefixAccPub: 'neutronpub',
        bech32PrefixValAddr: 'neutronvaloper',
        bech32PrefixValPub: 'neutronvaloperpub',
        bech32PrefixConsAddr: 'neutronvalcons',
        bech32PrefixConsPub: 'neutronvalconspub',
      },
      currencies: [
        {
          coinDenom: 'NTRN',
          coinMinimalDenom: 'untrn',
          coinDecimals: 6,
          coinGeckoId: 'ntrn',
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'NTRN',
          coinMinimalDenom: 'untrn',
          coinDecimals: 6,
          coinGeckoId: 'ntrn',
        },
      ],
      stakeCurrency: {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
        coinGeckoId: 'ntrn',
      },
      coinType: 118,
      features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    });     
}

export const keplrSetup = async () => {
  if (!window.keplr || !window.getOfflineSignerOnlyAmino) {
    alert('Please install keplr extension');
  } else {
    await window.keplr.enable(CHAIN_ID);
    const offlineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    const { name } = await window.keplr.getKey(CHAIN_ID);

    const CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner,
    );

    const balance = await CosmWasmClient.getBalance(
      accounts[0].address,
      NEUTRON_DENOM,
    );

    return {
      client: CosmWasmClient,
      username: name,
      address: accounts[0].address,
      balance: balance.amount,
    };
  }
}


export const gasPrice: GasPrice = {
  amount: Decimal.fromUserInput(GAS_PRICE, 18),
  denom: NEUTRON_DENOM,
};
