import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ 引入 Router
import './index.css';
import '@douyinfe/semi-ui/dist/css/semi.min.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>     {/* ✅ Router 提供 useNavigate 等 hook 的上下文 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
