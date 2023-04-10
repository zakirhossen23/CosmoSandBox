import { RPC } from "@/lib/wallet";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useState } from "react";

const request = async (addr: string): Promise<any> => {
    if (!window || !window.keplr || !window.getOfflineSignerOnlyAmino) {
        throw new Error("No Keplr");
    }
    const client = await CosmWasmClient.connect(
        RPC()
    );
    return await client.getContract(addr);
};


export const WasmContractInfoForm = () => {
    const [res, setRes] = useState<any>(null);
    const [contract, setContract] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const send = async () => {
        if (!contract) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const res = await request(contract);
            setRes(res);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    
    return <>
        <div className="field">
            <label className="label">CodeId</label>
            <div className="control">
                <input className="input" onChange={(e) => {setContract(e.target.value)}} type="string" placeholder="contract address" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={send}>Get</button>
            </div>
        </div>
        <div className="field">
            <label className="label">Result</label>
            <div className='control'>
                <pre style={{maxWidth: '1000px', overflowWrap: "break-word"}} className={`${error && 'has-text-danger'}`}>{typeof res === 'string' ? res : JSON.stringify(res, null, 2)}</pre>
            </div>
        </div>
    </>
};