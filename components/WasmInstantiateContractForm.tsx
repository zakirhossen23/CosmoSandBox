import { CHAIN_ID } from "@/lib/constants";
import { RPC, gasPrice } from "@/lib/wallet";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
import { useState } from "react";

const request = async (codeId: number, msg: string, label: string): Promise<any> => {
    if (!window || !window.keplr || !window.getOfflineSignerOnlyAmino) {
        throw new Error("No Keplr");
    }
    const offlineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const client = await SigningCosmWasmClient.connectWithSigner(
        RPC(),
        offlineSigner,
        {
            gasPrice
        }
    );
    const accounts = await offlineSigner.getAccounts();
   

    return client.instantiate(accounts[0].address, codeId, JSON.parse(msg), label, 'auto');
};


export const WasmInstantiateContractForm = () => {
    const [res, setRes] = useState<any>(null);
    const [codeId, setCodeId] = useState<number | undefined>();
    const [msg, setMsg] = useState<string | undefined>();
    const [label, setLabel] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const send = async () => {
        if (!codeId || !msg || !label) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const res = await request(codeId, msg, label);
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
                <input className="input" onChange={(e) => {setCodeId(parseInt(e.target.value,10))}} type="number" placeholder="codeId" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label">Message</label>
            <div className="control">
                <textarea className="textarea" onChange={(e) => {setMsg(e.target.value)}} placeholder="message" defaultValue={''}>{msg}</textarea>
            </div>
        </div>
        <div className="field">
            <label className="label">Label</label>
            <div className="control">
                <input className="input" onChange={(e) => {setLabel(e.target.value)}} type="string" placeholder="Label" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={send}>Execute</button>
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