import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import AppIsLive from './components/e-commerce/mobile/AppIsLive';
import MobileApp from './components/e-commerce/mobile/MobileApp';
import PublishApp from './components/e-commerce/mobile/PublishApp';
import Settings from './components/e-commerce/settings/EComSettings';
import Publish from './components/e-commerce/settings/Publish';
import SiteInfo from './components/e-commerce/website/SiteInfo';
import Website from './components/e-commerce/website/Website';
import Collections from './components/inventory/Collections';
import CreateCollection from './components/inventory/CreateCollection';
import CreateDiscounts from './components/inventory/CreateDiscounts';
import Discounts from './components/inventory/Discounts';
import OpeningStocks from './components/inventory/OpeningStocks';
import Stocks from './components/inventory/Stocks';
import { AdminLogin } from './components/login/AdminLogin';
import Barcode from './components/product/barcode/Barcode';
import EnrichProduct from './components/product/pim/EnrichProduct';
import MapChannel from './components/product/pim/MapChannel';
import ParentProduct from './components/product/pim/ParentProduct';
import ProductInfo from './components/product/pim/ProductInfo';
import CreatePriceBook from './components/product/pricebook/CreatePriceBook';
import PriceBook from './components/product/pricebook/PriceBook';
import Articles from './components/product/product/Articles';
import CreateProduct from './components/product/product/CreateProduct';
import Brand from './components/product/product_hierarchy/Brand';
import Department from './components/product/product_hierarchy/Department';
import Division from './components/product/product_hierarchy/Division';
import ProductHierarchy from './components/product/product_hierarchy/ProductHierarchy';
import Section from './components/product/product_hierarchy/Section';
import GST from './components/product/tax/GST';
import GSTSlabs from './components/product/tax/GSTSlabs';
import HsnSac from './components/product/tax/HsnSac';
import TaxMasters from './components/product/tax/TaxMasters';
// import CreateVariant from './components/product/variants/CreateVariant';
import Variants from './components/product/variants/Variants';
import BusinessRules from './components/settings/company_profile/BusinessRules';
import CompanyProfile from './components/settings/company_profile/CompanyProfile';
import Legal from './components/settings/company_profile/Legal';
import OtherSettings from './components/settings/company_profile/OtherSettings';
import LocationDetails from './components/settings/location/LocationDetails';
import NewLocation from './components/settings/location/NewLocation';
import Payment from './components/settings/payment/Payment';
import Shipment from './components/settings/shipment/Shipment';
import AddUsers from './components/settings/users/AddUsers';
import Role from './components/settings/users/Role';
import RolePrivileges from './components/settings/users/RolePrivileges';
import Users from './components/settings/users/Users';
import Layout from './layout/Layout';
import OrderManagement from './components/sales/OrderManagement';
import SalesOrder from './components/sales/SalesOrder';
import Invoice from './components/sales/Invoice';
import ShipmentNote from './components/sales/ShipmentNote';
import ReturnNote from './components/sales/ReturnNote';
import Packing from './components/sales/Packing';
import OpenOrder from './components/sales/OpenOrder';
import Delivered from './components/sales/Delivered';
import Cancelled from './components/sales/Cancelled';
import Abondened from './components/sales/Abondened';
import Returned from './components/sales/Returned';
import CreateOrder from './components/sales/CreateOrder';
import Channel from './components/settings/company_profile/Channel';
import Group from './components/product/product_hierarchy/Group';
import PointStatus from './components/crm/PointStatus';
import CreateNew from './components/crm/CreateNew';
import Create from './components/crm/Create';
import Approved from './components/crm/Approved';
import Draft from './components/crm/Draft';
import Salesman from './components/crm/Salesman';
import Loyalty from './components/crm/Loyalty';
import Customer from './components/crm/Customer';
import ProductTags from './components/product/product/ProductTags';

function App() {

  return (
    <Routes>
      <Route path='/' element={<AdminLogin />} />

      <Route element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />

        <Route path='/product/product-hierarchy' element={<ProductHierarchy />} />
        <Route path='/product/division' element={<Division />} />
        <Route path='/product/department' element={<Department />} />
        <Route path='/product/section' element={<Section />} />
        <Route path='/product/brand' element={<Brand />} />
        <Route path='/product/group' element={<Group />} />
        <Route path='/product/tags' element={<ProductTags />} />

        <Route path='/product/tax/tax-masters' element={<TaxMasters />} />
        <Route path='/product/tax/gst' element={<GST />} />
        <Route path='/product/tax/gst-slabs' element={<GSTSlabs />} />
        <Route path='/product/tax/hsn' element={<HsnSac />} />


        <Route path='/product/product/articles' element={<Articles />} />
        <Route path='/product/product/create' element={<CreateProduct />} />

        <Route path='/product/variants' element={<Variants />} />
        {/* <Route path='/product/variant/create' element={<CreateVariant />} /> */}

        <Route path='/product/price-book' element={<PriceBook />} />
        <Route path='/product/price-book/create' element={<CreatePriceBook />} />

        <Route path='/product/barcode' element={<Barcode />} />

        <Route path='/product/pim' element={<ProductInfo />} />
        <Route path='/product/pim/product-info' element={<ParentProduct />} />
        <Route path='/product/pim/map-channel' element={<MapChannel />} />
        <Route path='/product/pim/enrich-product' element={<EnrichProduct />} />


        <Route path='/inventory/stocks' element={<Stocks />} />
        <Route path='/inventory/stocks/opening-stocks' element={<OpeningStocks />} />
        <Route path='/inventory/collections' element={<Collections />} />
        <Route path='/inventory/collections/create' element={<CreateCollection />} />
        <Route path='/inventory/discounts' element={<Discounts />} />
        <Route path='/inventory/discounts/create' element={<CreateDiscounts />} />

        <Route path='/settings/company-profile' element={<CompanyProfile />} />
        <Route path='/settings/company-profile/channels' element={<Channel />} />
        <Route path='/settings/company-profile/other-settings' element={<OtherSettings />} />
        <Route path='/settings/company-profile/legal' element={<Legal />} />
        <Route path='/settings/company-profile/business-rules' element={<BusinessRules />} />

        <Route path='/settings/location' element={<LocationDetails />} />
        <Route path='/settings/location/new-location' element={<NewLocation />} />

        <Route path='/settings/shipment' element={<Shipment />} />
        <Route path='/settings/user-management' element={<Users />} />
        <Route path='/settings/user/role' element={<Role />} />
        <Route path='/settings/user/role-privileges' element={<RolePrivileges />} />
        <Route path='/settings/user' element={<AddUsers />} />

        <Route path='/settings/payment' element={<Payment />} />

        {/* sales */}

        <Route path='/sales/order-management' element={<OrderManagement />} />
        <Route path='/sales/sales-order' element={<SalesOrder />} />
        <Route path='/sales/invoice' element={<Invoice />} />
        <Route path='/sales/shippment-note' element={<ShipmentNote />} />
        <Route path='/sales/return-note' element={<ReturnNote />} />
        <Route path='/sales/packing' element={<Packing />} />
        <Route path='/sales/open-order' element={<OpenOrder />} />
        <Route path='/sales/delivery' element={<Delivered />} />
        <Route path='/sales/cancel' element={<Cancelled />} />
        <Route path='/sales/abandon' element={<Abondened />} />
        <Route path='/sales/return' element={<Returned />} />
        <Route path='/sales/create-order' element={<CreateOrder />} />


        {/* crm */}
        <Route path='/crm/customer' element={<Customer />} />
        <Route path='/crm/loyalty' element={<Loyalty />} />
        <Route path='/crm/salesman' element={<Salesman />} />
        <Route path='/crm/customer/draft' element={<Draft />} />
        <Route path='/crm/customer/approved' element={<Approved />} />
        <Route path='/crm/customer/create' element={<Create />} />
        <Route path='/crm/loyalty/create-new' element={<CreateNew />} />
        <Route path='/crm/loyalty/point-status' element={<PointStatus />} />

        {/* E-Commerce */}

        <Route path='/e-commerce/mobile' element={<MobileApp />} />
        <Route path='/e-commerce/mobile/publish' element={<PublishApp />} />
        <Route path='/e-commerce/mobile/live' element={<AppIsLive />} />

        <Route path='/e-commerce/website' element={<Website />} />
        <Route path='/e-commerce/website/site-info' element={<SiteInfo />} />

        <Route path='/e-commerce/settings' element={<Settings />} />
        <Route path='/e-commerce/settings/publish' element={<Publish />} />


      </Route>
    </Routes>
  );
}

export default App;
