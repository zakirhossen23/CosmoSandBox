import { CHAIN_ID } from "@/lib/constants";
import { RPC, gasPrice } from "@/lib/wallet";
import { Coin, DeliverTxResponse, SigningStargateClient } from "@cosmjs/stargate";
import { useState } from "react";

export const B64Form = () => {
    const [res, setRes] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>();
    const encode = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = Buffer.from(msg || '').toString('base64');
            setRes(res);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    const decode = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = Buffer.from(msg || '', 'base64').toString('utf8');
            setRes(res);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    
    return <>
        
        <div className="field">
            <label className="label">Msg</label>
            <div className="control">
                <textarea className="textarea" onChange={(e) => {setMsg(e.target.value)}} placeholder="Memo" defaultValue={''} />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link mr-3" disabled={loading} onClick={encode}>Encode</button>
                <button className="button is-link" disabled={loading} onClick={decode}>Decode</button>
            </div>
        </div>
        <div className="field">
            <label className="label">Result</label>
            <div className='control'>
                <textarea style={{maxWidth: '1000px', overflowWrap: "break-word"}} value={res} className={`textarea ${error && 'has-text-danger'}`}></textarea>
            </div>
        </div>
    </>
};