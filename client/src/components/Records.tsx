import React, { useState, Dispatch, SetStateAction } from "react";
import { ContractMethod, TezosToolkit, WalletContract } from "@taquito/taquito";

interface RecordsProps {
  contract: WalletContract | any;
  setUserBalance: Dispatch<SetStateAction<any>>;
  Tezos: TezosToolkit;
  userAddress: string;
  setStorage: Dispatch<SetStateAction<number>>;
}

const Records = ({ contract, setUserBalance, Tezos, userAddress, setStorage }: RecordsProps) => {
  const [loadingIncrement, setLoadingIncrement] = useState<boolean>(false);
  const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false);

  const addRecord = async (): Promise<void> => {
    setLoadingIncrement(true);
    try {
      const op = await contract.methods.default("tesds").send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage);
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIncrement(false);
    }
  };

  if (!contract && !userAddress) return <div>&nbsp;</div>;
  return (
    <div className="buttons">
      <button className="button" disabled={loadingIncrement} onClick={addRecord}>
        {loadingIncrement ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-plus"></i>&nbsp; Add Record
          </span>
        )}
      </button>
    </div>
  );
};

export default Records;
