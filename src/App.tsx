import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import { useState } from "react";
import AsteroidGame from "./components/AsteroidGame"; // ИМПОРТ КОМПОНЕНТА
import WebApp from "@twa-dev/sdk";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect();
  const [currentView, setCurrentView] = useState<'contract' | 'game'>('contract'); // СОСТОЯНИЕ ДЛЯ НАВИГАЦИИ

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

    // Если показываем игру
    if (currentView === 'game') {
        return <AsteroidGame onBack={() => setCurrentView('contract')} />;
    }

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
        {/*<div>-----------------------------------------------------------------------тут какакя то хуёня</div>*/}
        {/* КНОПКА ДЛЯ ПЕРЕХОДА В ИГРУ */}
        {connected && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button
                    onClick={() => setCurrentView('game')}
                    style={{
                        padding: '15px 30px',
                        fontSize: '18px',
                        backgroundColor: '#4FC3F7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🎮 Играть в Asteroid Game
                </button>
            </div>
        )}
        {/*<div>-----------------------------------------------------------------------тут какакя то хуёня</div>*/}

      <div>
        <div className='Card'>
          <div>{WebApp.platform}</div>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance && (
            <div className='Hint'>{fromNano(contract_balance)}</div>
          )}
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <a onClick={() => { showAlert(); }}> Show Alert </a>

        <br />

        {connected && (<a onClick={() =>
            { sendIncrement();}}>Increment by 5 </a>)
        }

        <br />

        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Request deposit of 1 TON
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            Request 0.7 TON withdrawal
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
