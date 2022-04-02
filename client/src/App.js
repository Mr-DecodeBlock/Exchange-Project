import './App.css';
import { DAppProvider, ChainId } from "@usedapp/core"
import Header from './components/Header';
function App() {
  return (
    <div className="App">
      <DAppProvider supportedChainIds={[ChainId.MAINNET, ChainId.Kovan]}> <Header /></DAppProvider>

    </div>
  );
}

export default App;
