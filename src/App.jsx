import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Collections from './components/inventory/Collections';
import CreateCollection from './components/inventory/CreateCollection';
import Discounts from './components/inventory/Discounts';
import OpeningStocks from './components/inventory/OpeningStocks';
import Stocks from './components/inventory/Stocks';
import Department from './components/product/Department';
import Division from './components/product/Division';
import ProductHome from './components/product/ProductHome';
import Layout from './layout/Layout';
import CompanyProfile from './components/settings/CompanyProfile';
import OtherSettings from './components/settings/OtherSettings';
import Legal from './components/settings/Legal';
import BusinessRules from './components/settings/BusinessRules';
import CreateDiscounts from './components/inventory/CreateDiscounts';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='/product/product-hierarchy' element={<ProductHome />} />
        <Route path='/product/division' element={<Division />} />
        <Route path='/product/department' element={<Department />} />

        <Route path='/inventory/stocks' element={<Stocks />} />
        <Route path='/inventory/stocks/opening-stocks' element={<OpeningStocks />} />
        <Route path='/inventory/collections' element={<Collections />} />
        <Route path='/inventory/collections/create' element={<CreateCollection />} />
        <Route path='/inventory/discounts' element={<Discounts />} />
        <Route path='/inventory/discounts/create' element={<CreateDiscounts />} />
        <Route path='/inventory/discounts' element={<Discounts />} />

        <Route path='/settings/company-profile' element={<CompanyProfile />} />
        <Route path='/settings/other-settings' element={<OtherSettings />} />
        <Route path='/settings/legal' element={<Legal />} />
        <Route path='/settings/business-rules' element={<BusinessRules />} />

      </Route>
    </Routes>
  );
}

export default App;
