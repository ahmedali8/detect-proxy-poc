import { useState } from "react";
import "./App.css";
import { JsonRpcProvider } from "@ethersproject/providers";
import detectProxyTarget from "detect-evm-proxy";
import { EIP1193ProviderRequestFunc } from "detect-evm-proxy/build/cjs/types";

function App() {
  const [value, setValue] = useState<string>("");

  const [error, setError] = useState<boolean>();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [kind, setKind] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const address = value;

      if (!address) return;

      const jsonRpcProvider = new JsonRpcProvider("https://rpc.ankr.com/eth");
      const requestFunc: EIP1193ProviderRequestFunc = ({ method, params }) =>
        jsonRpcProvider.send(method, params);

      const target = await detectProxyTarget(address, requestFunc);

      // logs {contractAddress: "0x4bd844F72A8edD323056130A86FC624D0dbcF5b0", kind: "EIP-1967 Transparent Proxy Pattern"}
      console.log(target);

      if (target === null) {
        setContractAddress("Not a proxy!");
        setKind("Not a proxy!");
        return;
      }

      setContractAddress(target.contractAddress);
      setKind(target.kind);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  if (error) {
    return <p>Error ocurred, Try again!</p>;
  }

  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          style={{ flex: 1, marginRight: "1rem" }}
        />
        <button type="submit" style={{ flex: "none" }}>
          Submit
        </button>
      </form>
      {contractAddress && <p>contractAddress: {contractAddress}</p>}
      {kind && <p>kind: {kind}</p>}
    </div>
  );
}

export default App;
