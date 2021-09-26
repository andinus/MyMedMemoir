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

  const [formKaName, setName] = useState('');
  const [formKaDate, setDate] = useState('');
  const [formKaHeight, setHeight] = useState('');
  const [formKaWeight, setWeight] = useState('');
  const [formKaAge, setAge] = useState('');
  const [formKaHospital, setHospital] = useState('');
  const [formKaPrescription, setPrescription] = useState('');

  const addRecord = async (): Promise<void> => {
    setLoadingIncrement(true);
    try {
      const apnaForm = {
        name: formKaName,
        date: formKaDate,
        age: formKaAge,
        height: formKaHeight,
        weight: formKaWeight,
        hospital: formKaHospital,
        prescription: formKaPrescription,
      };
      console.log(JSON.stringify(apnaForm));
      const op = await contract.methods.default(JSON.stringify(apnaForm)).send();
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
    <div>
      <form action="" method="get" className="form-apna">
          <label className="labelIska">Doctor:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
          <input type="text" className="formFields" id="form-name" 
          onChange={event => setName(event.target.value)} required/>
          <br/>
          <label className="labelIska">Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input type="date" className="formFields" id="form-date" 
          onChange={event => setDate(event.target.value)} required/><br/>
          <label className="labelIska">Age:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input type="number" className="formFields" id="form-age" 
          onChange={event => setAge(event.target.value)} required/><br/>
          <label className="labelIska">Height:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input type="number" className="formFields" id="form-height" 
          onChange={event => setHeight(event.target.value)} required/><br/>
          <label className="labelIska">Weight:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input type="number" className="formFields" id="form-date" 
          onChange={event => setWeight(event.target.value)} required/><br/>
          <label className="labelIska">Hospital:&nbsp;</label>&nbsp;&nbsp;&nbsp;
          <input type="text" className="formFields" id="form-hospital" 
          onChange={event => setHospital(event.target.value)} required/><br/>
          <br/>
          <label className="labelIska">Presciption: </label><br/>
          <textarea className="formFields" id="form-prescription"
          onChange={event => setPrescription(event.target.value)}/><br/>
          <span id="form-ka-button">
          <button type="submit"  className="button" disabled={loadingIncrement} onClick={addRecord}>
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
          </span>
      </form>
    </div>
  );
};

export default Records;
