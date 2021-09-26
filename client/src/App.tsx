import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectWallet";
import DisconnectButton from "./components/DisconnectWallet";
import qrcode from "qrcode-generator";
import Records from "./components/Records";
import Transfers from "./components/Transfers";

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://api.tez.ie/rpc/granadanet")
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>("");
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<any>({dates: [], records: [],});
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("transfer");

  // Granadanet Memoir contract
  const contractAddress: string = "KT1PjaJZxYvE335fdD7GXLshPWdFAYan1ta3";

  const generateQrCode = (): { __html: string } => {
    const qr = qrcode(0, "L");
    qr.addData(publicToken || "");
    qr.make();

    return { __html: qr.createImgTag(4) };
  };

  if (publicToken && (!userAddress || isNaN(userBalance))) {
    return (
      <div className="main-box">
        <h1>MyMedMemoir</h1>
        <div id="dialog">
          <header>Decentralized Medical Reports</header>
          <div id="content">
            <p className="text-align-center">
              <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
              your wallet
            </p>
            <div
              dangerouslySetInnerHTML={generateQrCode()}
              className="text-align-center"
            ></div>
            <p id="public-token">
              {copiedPublicToken ? (
                <span id="public-token-copy__copied">
                  <i className="far fa-thumbs-up"></i>
                </span>
              ) : (
                <span
                  id="public-token-copy"
                  onClick={() => {
                    if (publicToken) {
                      navigator.clipboard.writeText(publicToken);
                      setCopiedPublicToken(true);
                      setTimeout(() => setCopiedPublicToken(false), 2000);
                    }
                  }}
                >
                  <i className="far fa-copy"></i>
                </span>
              )}

              <span>
                Public token: <span>{publicToken}</span>
              </span>
            </p>
            <p className="text-align-center">
              Status: {beaconConnection ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <div id="footer">
        </div>
      </div>
    );
  } else if (userAddress && !isNaN(userBalance)) {
    return (
      <div className="main-box">
        <h1>Memoir</h1>
        <div id="tabs">
          <div
            id="transfer"
            className={activeTab === "transfer" ? "active" : ""}
            onClick={() => setActiveTab("transfer")}
          >
            Wallet
          </div>
          <div
            id="contract"
            className={activeTab === "contract" ? "active" : ""}
            onClick={() => setActiveTab("contract")}
          >
            New Report
          </div>
          <div
            id="reports"
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </div>
        </div>
        <div id="dialog">
          <div id="content">
            {activeTab === "transfer" &&
              <div id="transfers">
                <h3 className="text-align-center">Make a transfer</h3>
                <Transfers
                  Tezos={Tezos}
                  setUserBalance={setUserBalance}
                  userAddress={userAddress}
                />
                <p>
                  <i className="far fa-file-code"></i>&nbsp;
                  <a
                    href={`https://better-call.dev/granadanet/${contractAddress}/operations`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  {contractAddress}
                  </a>
                </p>
                <p>
                  <i className="far fa-address-card"></i>&nbsp; {userAddress}
                </p>
                <p>
                  <i className="fas fa-piggy-bank"></i>&nbsp;
                  {(userBalance / 1000000).toLocaleString("en-US")} ꜩ
                </p>
                <DisconnectButton
                  wallet={wallet}
                  setPublicToken={setPublicToken}
                  setUserAddress={setUserAddress}
                  setUserBalance={setUserBalance}
                  setWallet={setWallet}
                  setTezos={setTezos}
                  setBeaconConnection={setBeaconConnection}
                />
              </div>
            }
            {activeTab === "contract" &&
              <div id="increment-decrement">
                <Records
                   contract={contract}
                   setUserBalance={setUserBalance}
                  Tezos={Tezos}
                   userAddress={userAddress}
                   setStorage={setStorage}
                />
              </div>
            }
            {activeTab === "reports" &&
              <div id="increment-decrement">
                 {storage.dates.map((val: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, idx: any) =>
                 <div className="apneReports">
                   <details>
                     <summary>
                      {JSON.parse(storage.records[idx]).date}
                     </summary>
                     Name: {JSON.parse(storage.records[idx]).name}<br></br>
                     Age: {JSON.parse(storage.records[idx]).age}<br></br>
                     Height: {JSON.parse(storage.records[idx]).height}<br></br>
                     Weight: {JSON.parse(storage.records[idx]).weight}<br></br>
                     Prescription: {JSON.parse(storage.records[idx]).prescription}<br></br>
                    </details>
                   </div>)}

              </div>
            }
          </div>
        </div>
        <div id="footer">
        </div>
      </div>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <div className="main-box">
        <div className="title">
          <h1>MyMedMemoir</h1>
        </div>
        <div id="dialog">
          <header>Welcome to MyMedMemoir!</header>
          <div id="content">
            <p>Hello!</p>
            <p>Go forth and M³!</p>
          </div>
          <ConnectButton
            Tezos={Tezos}
            setContract={setContract}
            setPublicToken={setPublicToken}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            contractAddress={contractAddress}
            setBeaconConnection={setBeaconConnection}
            wallet={wallet}
          />
        </div>
        <div id="footer">
          <h1> hi</h1>
          <img src="./footer.png"/>
        </div>
      </div>
    );
  } else {
    return <div>An error has occurred</div>;
  }
};

export default App;
