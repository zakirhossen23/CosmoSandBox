import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { keplrSetup, networkSetup } from '@/lib/wallet'
import { ReactNode, useState } from 'react'
import { BalanceForm } from '@/components/BalanceForm'
import { BankSendForm } from '@/components/BankSendForm'
import { WasmCodeInfoForm } from '@/components/WasmCodeInfoForm'
import { WasmCodeIdContractsForm } from '@/components/WasmCodeIdContractsForm'
import { WasmQueryContractForm } from '@/components/WasmQueryContractForm'
import { WasmExecuteContractForm } from '@/components/WasmExecuteContractForm'
import { WasmInstantiateContractForm } from '@/components/WasmInstantiateContractForm'
import { WasmStoreContractForm } from '@/components/WasmStoreContractForm'
import { BankSendIBCForm } from '@/components/BankSendIBCForm'
import { B64Form } from '@/components/Base64Form'
import { IBCInfoForm } from '@/components/IBCInfoForm'
import { WasmContractInfoForm } from '@/components/WasmContractInfoForm'

const inter = Inter({ subsets: ['latin'] })

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type WalletDataType = ReturnType<typeof keplrSetup>;
type KeplrData = UnwrapPromise<WalletDataType> | null;

export default function Home() {
  const [wallet, setWallet] = useState<KeplrData>();
  const [content, setContent] = useState<ReactNode | null>();
  const getWallet = async () => {
    if (wallet) {
      return;
    }
    const x = await keplrSetup();
    setWallet(x);
  };

  return (
    <>
      <Head>
        <title>Peso4niza</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <nav className="bd-navbar navbar">
          <div className='navbar-brand'>
            <Link className="navbar-item" href="/">
              <h1 className="title"><big><big><big>🏜️</big></big></big> Peso4niza</h1>
            </Link>
            <div className='navbar-item'>
              {wallet && wallet.address}
            </div>
          </div>
          <div className='navbar-end field'>
            <div className='navbar-item'>
              <button className='button is-link mr-3' onClick={networkSetup}>Add network to Keplr</button>
              {!wallet && <button className='button is-link' onClick={getWallet}>Connect Keplr</button>}
              {wallet && <button className='button is-link' onClick={() => {setWallet(null);}}>Disconnect Keplr</button>}
            </div>
          </div>
        </nav>
        <div className="container mt-3">
          <div className="columns">
            <div className="column is-one-quarter">
              {wallet && <>
                <button className="button is-link m-3" onClick={() => setContent(<BalanceForm address={wallet?.address}  />)}>Get Balance</button>
                <button className="button is-link m-3" onClick={() => setContent(<BankSendForm address={wallet?.address}  />)}>MsgSend</button>
                <button className="button is-link m-3" onClick={() => setContent(<BankSendIBCForm address={wallet?.address}  />)}>MsgSendIBC</button>
                <button className="button is-link m-3" onClick={() => setContent(<IBCInfoForm />)}>IBCInfo</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmCodeInfoForm />)}>WasmCodeInfo</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmContractInfoForm />)}>WasmContractInfo</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmCodeIdContractsForm />)}>WasmCodeIdContacts</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmQueryContractForm />)}>Query Contract</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmStoreContractForm />)}>Store Contract</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmInstantiateContractForm />)}>Instantiate Contract</button>
                <button className="button is-link m-3" onClick={() => setContent(<WasmExecuteContractForm />)}>Execute Contract</button>
                <button className="button is-link m-3" onClick={() => setContent(<B64Form />)}>Base64</button>
              </>}
            </div>
            <div className="column">
              <div className="box">
                {content}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
