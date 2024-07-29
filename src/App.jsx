import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import ProductHome from './components/product/ProductHome';
import Dashboard from './components/dashboard/Dashboard';
import Division from './components/product/Division';
import Department from './components/product/Department';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
         <Route index element={<Dashboard />} />
        <Route path='/product' element={<ProductHome />} />
        <Route path='/product/division' element={<Division />} />
        <Route path='/product/department' element={<Department />} />
      </Route>
    </Routes>
  );
}

export default App;
