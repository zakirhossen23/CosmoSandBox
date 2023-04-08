import { CHAIN_ID } from "@/lib/constants";
import { RPC, gasPrice } from "@/lib/wallet";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
import { useState } from "react";

const request = async (contract: string, msg: string, funds?: string, memo?:string): Promise<any> => {
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
    const coins: Coin[] = funds ? funds.split(',').map((f) => {
        const [amount, denom] = [...f.trim().split(/^(\d+)/)].filter(Boolean);
        return { amount, denom };
    }) : [];

    return client.execute(accounts[0].address, contract, JSON.parse(msg), 'auto', memo, coins);
};


export const WasmExecuteContractForm = () => {
    const [res, setRes] = useState<any>(null);
    const [contract, setContract] = useState<string | undefined>();
    const [msg, setMsg] = useState<string | undefined>();
    const [funds, setFunds] = useState<string | undefined>();
    const [memo, setMemo] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const send = async () => {
        if (!contract || !msg) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const res = await request(contract, msg, funds, memo);
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
                <input className="input" onChange={(e) => {setContract(e.target.value)}} type="string" placeholder="contract" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label">Message</label>
            <div className="control">
                <textarea className="textarea" onChange={(e) => {setMsg(e.target.value)}} placeholder="message" defaultValue={''}>{msg}</textarea>
            </div>
        </div>
        <div className="field">
            <label className="label">Funds</label>
            <div className="control">
                <input className="input" onChange={(e) => {setFunds(e.target.value)}} type="string" placeholder="1000untrn,1000atom" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label">Memo</label>
            <div className="control">
                <input className="input" onChange={(e) => {setMemo(e.target.value)}} type="string" placeholder="memo" defaultValue={''} />
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