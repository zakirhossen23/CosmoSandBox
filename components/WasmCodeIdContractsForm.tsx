import { RPC } from "@/lib/wallet";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "cosmjs-types/cosmwasm/wasm/v1/query";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { useState } from "react";
import Long from 'long';


const request = async (codeId: number): Promise<any> => {
    const tendermint = await Tendermint34Client.connect(RPC());
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);
    const r = await bankQueryService.ContractsByCode({
      codeId: new Long(codeId)
    });
    return r.contracts;
  };


export const WasmCodeIdContractsForm = () => {
    const [content, setContent] = useState<any>(null);
    const [codeId, setCodeId] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const send = async () => {
        if (!codeId) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const balances = await request(codeId);
            setContent(balances);
        } catch (e: any) {
            setError(true);
            setContent(e.message.toString());
        }
        setLoading(false);
    }
    
    return <>
        <div className="field">
            <label className="label">Address</label>
            <div className="control">
                <input className="input" onChange={(e) => {setCodeId(parseInt(e.target.value, 10))}} type="number" placeholder="codeId" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={send}>Get</button>
            </div>
        </div>
        <div className="field">
            <label className="label">Balances</label>
            <div className='control'>
                <pre style={{maxWidth: '1000px', overflowWrap: "break-word"}} className={`${error && 'has-text-danger'}`}>{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</pre>
            </div>
        </div>
    </>
};