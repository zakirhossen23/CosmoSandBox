import { CHAIN_ID } from "@/lib/constants";
import { RPC, gasPrice } from "@/lib/wallet";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
import { ChangeEvent, useState } from "react";

const request = async (wasmCode: Uint8Array): Promise<any> => {
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

    return client.upload(accounts[0].address, wasmCode, 'auto');
};


export const WasmStoreContractForm = () => {
    const [file, setFile] = useState<Uint8Array>();
    const [res, setRes] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            setFile(uint8Array);
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };

        reader.readAsArrayBuffer(file);
    };
    

    const send = async () => {
        if (!file) {
            return;
        }
        setLoading(true);
        setError(false);
        try {
            const res = await request(file);
            setRes(res);
        } catch (e: any) {
            setError(true);
            setRes(e.message.toString());
        }
        setLoading(false);
    }
    
    return <>
        <div className="field">
            <label className="label">Wasm</label>
            <div className="control">
                <input className="input" onChange={handleFileChange} type="file" />
            </div>
        </div>
        <div className="field">
            <label className="label"></label>
            <div className="control">
                <button className="button is-link" disabled={loading} onClick={send}>Upload</button>
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