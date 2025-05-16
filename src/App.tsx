import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import WalletDashboard from './components/WalletDashboard';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <WalletDashboard />
    </ConfigProvider>
  );
}

export default App;