import './App.css';
import { DAppProvider, ChainId } from "@usedapp/core"
import Header from './components/Header';
import Deposit from './components/Deposit';

function App() {

  return (
    <div id="Home" className="App">
      <DAppProvider supportedChainIds={[ChainId.Mainnet, ChainId.Kovan]}>
        <Header /> <Deposit /> </DAppProvider>

    </div>
  );
}

export default App;
