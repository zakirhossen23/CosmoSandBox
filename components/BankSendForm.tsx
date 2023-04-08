import { CHAIN_ID } from "@/lib/constants";
import { RPC, gasPrice } from "@/lib/wallet";
import { Coin, DeliverTxResponse, SigningStargateClient } from "@cosmjs/stargate";
import { useState } from "react";

type Props = {
    address: string | undefined
}

const bankSend = async (toAddress: string, funds: string, memo?: string): Promise<DeliverTxResponse> => {
    if (!window || !window.keplr || !window.getOfflineSignerOnlyAmino) {
        throw new Error("No Keplr");
    }
    const offlineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    const client = await SigningStargateClient.connectWithSigner(
      RPC(),
      offlineSigner,
      {
        gasPrice,
      },
    );

    const coins: Coin[] = funds ? funds.split(',').map((f) => {
        const [amount, denom] = [...f.trim().split(/^(\d+)/)].filter(Boolean);
        return { amount, denom };
    }) : [];
    
    return client.sendTokens(accounts[0].address, toAddress, coins, "auto", memo);      
};


export const BankSendForm = ({address: fromAddress}: Props) => {
    const [res, setRes] = useState<any>(null);
    const [toAddress, setToAddress] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [funds, setFunds] = useState<string>('');
    const [memo, setMemo] = useState<string>();
    const send = async () => {
        if (!fromAddress || !toAddress || !funds) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const res = await bankSend(toAddress, funds, memo);
            setRes(res);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    if (!fromAddress) {
        return <div>connect Keplr first</div>
    }
    return <>
        <div className="field">
            <label className="label">Address To</label>
            <div className="control">
                <input className="input" onChange={(e) => {setToAddress(e.target.value)}} type="text" placeholder="Address" defaultValue={toAddress || ''} />
            </div>
        </div>
        <div className="field">
            <label className="label">Funds</label>
            <div className="control">
                <input className="input" onChange={(e) => {setFunds(e.target.value)}} type="text" placeholder="1000untrn,100atom" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label">Memo</label>
            <div className="control">
                <input className="input" onChange={(e) => {setMemo(e.target.value)}} type="text" placeholder="Memo" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={send}>Send</button>
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