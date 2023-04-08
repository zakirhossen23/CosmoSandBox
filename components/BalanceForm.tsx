import { RPC } from "@/lib/wallet";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { useState } from "react";

type Props = {
    address: string | undefined
}

const fetchBalances = async (address: string): Promise<Coin[] | undefined> => {
    const tendermint = await Tendermint34Client.connect(RPC());
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const { balances } = await bankQueryService.AllBalances({
       address,
    });
    return balances;
  };


export const BalanceForm = ({address: defaultAddress}: Props) => {
    const [balances, setBalances] = useState<any>(null);
    const [address, setAddress] = useState<string | undefined>(defaultAddress);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const getBalance = async () => {
        if (!address) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const balances = await fetchBalances(address);
            setBalances(balances);
        } catch (e: any) {
            setError(true);
            setBalances(e.message.toString());
        }
        setLoading(false);
    }
    if (!address) {
        return <div>connect Keplr first</div>
    }
    return <>
        <div className="field">
            <label className="label">Address</label>
            <div className="control">
                <input className="input" onChange={(e) => {setAddress(e.target.value)}} type="text" placeholder="Address" defaultValue={address || ''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={getBalance}>Fetch</button>
            </div>
        </div>
        <div className="field">
            <label className="label">Balances</label>
            <div className='control'>
                <pre style={{maxWidth: '1000px', overflowWrap: "break-word"}} className={`${error && 'has-text-danger'}`}>{typeof balances === 'string' ? balances : JSON.stringify(balances, null, 2)}</pre>
            </div>
        </div>
    </>
};