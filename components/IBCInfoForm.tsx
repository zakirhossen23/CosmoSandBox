import { RPC } from "@/lib/wallet";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl as ChannelsQueryClientImpl } from "cosmjs-types/ibc/core/channel/v1/query";
import { Query } from "cosmjs-types/ibc/core/client/v1/query";
import { QueryClientImpl as ConnectionsQueryClientImpl } from "cosmjs-types/ibc/core/connection/v1/query";
import { useState } from "react";


const fetchInfo = async (impl: any, field: string): Promise<any> => {
    const tendermint = await Tendermint34Client.connect(RPC());
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new impl(rpcClient);
    const res = await queryService[field]()
    return res;
  };


export const IBCInfoForm = () => {
    const [res, setRes] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const getData = (cl:any, field: string) => async() => {
        setLoading(true);
        setError(false);
        try {
            const i = await fetchInfo(cl, field);
            setRes(i);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    
    return <>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link mr-3" disabled={loading} onClick={getData(ChannelsQueryClientImpl, 'Channels')}>Channels</button>
                <button className="button is-link" disabled={loading} onClick={getData(ConnectionsQueryClientImpl, 'Connections')}>Conenctions</button>
            </div>
        </div>
        <div className="field">
            <label className="label">Balances</label>
            <div className='control'>
                <pre style={{maxWidth: '1000px', overflowWrap: "break-word"}} className={`${error && 'has-text-danger'}`}>{typeof res === 'string' ? res : JSON.stringify(res, null, 2)}</pre>
            </div>
        </div>
    </>
};