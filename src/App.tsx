/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DerivProvider } from '@/contexts/DerivContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Trade } from '@/pages/Trade';
import { Funds } from '@/pages/Funds';
import { History } from '@/pages/History';
import { Markets } from '@/pages/Markets';
import { Profile } from '@/pages/Profile';
import { Roadmap } from '@/pages/Roadmap';

export default function App() {
  return (
    <DerivProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trade" element={<Trade />} />
            <Route path="trade/:symbol" element={<Trade />} />
            <Route path="funds" element={<Funds />} />
            <Route path="history" element={<History />} />
            <Route path="markets" element={<Markets />} />
            <Route path="profile" element={<Profile />} />
            <Route path="roadmap" element={<Roadmap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DerivProvider>
  );
}

