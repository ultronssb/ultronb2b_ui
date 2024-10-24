import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Customer from './components/crm/Customer';
import CustomerCreate from './components/crm/CustomerCreate';
import CustomerDraft from './components/crm/CustomerDraft';
import { Loyalty } from './components/crm/Loyalty';
import LoyaltyCreate from './components/crm/LoyaltyCreate';
import LoyaltyPointStatus from './components/crm/LoyaltyPointStatus';
import Salesman from './components/crm/Salesman';
import Dashboard from './components/dashboard/Dashboard';
import AppIsLive from './components/e-commerce/mobile/AppIsLive';
import MobileApp from './components/e-commerce/mobile/MobileApp';
import PublishApp from './components/e-commerce/mobile/PublishApp';
import Settings from './components/e-commerce/settings/EComSettings';
import Publish from './components/e-commerce/settings/Publish';
import SiteInfo from './components/e-commerce/website/SiteInfo';
import Website from './components/e-commerce/website/Website';
import CollectionCreation from './components/inventory/CollectionCreation';
import Collections from './components/inventory/Collections';
import DiscountCreation from './components/inventory/DiscountCreation';
import Discounts from './components/inventory/Discounts';
import OpeningStocks from './components/inventory/OpeningStocks';
import Stocks from './components/inventory/Stocks';
import { AdminLogin } from './components/login/AdminLogin';
import EnrichProduct from './components/product/pim/EnrichProduct';
import MapChannel from './components/product/pim/MapChannel';
import ProductInfoManagement from './components/product/pim/ProductInfoManagement';
import CreatePriceBook from './components/product/pricebook/CreatePriceBook';
import PriceBook from './components/product/pricebook/PriceBook';
import Articles from './components/product/product/Articles';
import CreateProduct from './components/product/product/CreateProduct';
import { Attribute } from './components/product/product_category/Attribute';
import Brand from './components/product/product_category/Brand';
import Category from './components/product/product_category/Category';
import FabricContent from './components/product/product_category/FabricContent';
import Group from './components/product/product_category/Group';
import GST from './components/product/product_category/GST';
import ProductTags from './components/product/product_category/ProductTags';
import Taxonomy from './components/product/product_category/Taxonomy';
import Variants from './components/product/product_category/Variants';
import ProductHistory from './components/product/product_history/ProductHistory';
import CreateOrder from './components/sales/CreateOrder';
import Enquiry from './components/sales/Enquiry';
import Invoice from './components/sales/Invoice';
import OrderAbondened from './components/sales/OrderAbondened';
import OrderCancelled from './components/sales/OrderCancelled';
import OrderDelivered from './components/sales/OrderDelivered';
import OrderOpen from './components/sales/OrderOpen';
import OrderReturned from './components/sales/OrderReturned';
import Packing from './components/sales/Packing';
import ReturnNote from './components/sales/ReturnNote';
import SalesOrder from './components/sales/SalesOrder';
import ShipmentNote from './components/sales/ShipmentNote';
import BusinessRules from './components/settings/company_profile/BusinessRules';
import Channel from './components/settings/company_profile/Channel';
import CompanyProfile from './components/settings/company_profile/CompanyProfile';
import Legal from './components/settings/company_profile/Legal';
import OtherSettings from './components/settings/company_profile/OtherSettings';
import Filters from './components/settings/filters/Filters.jsx';
import LocationDetails from './components/settings/location/LocationDetails';
import NewLocation from './components/settings/location/NewLocation';
import LocationType from './components/settings/location_type/LocationType';
import Payment from './components/settings/payment/Payment';
import DeliveryMode from './components/settings/shipment/DeliveryMode.jsx';
import Shipment from './components/settings/shipment/Shipment';
import AddUsers from './components/settings/users/AddUsers';
import Role from './components/settings/users/Role';
import RolePrivileges from './components/settings/users/RolePrivileges';
import Layout from './layout/Layout';

import VariantBarcode from './components/product/barcode/Barcode';
import { NavigationProvider } from './common/NavigationContext.jsx';

const ProtectedRoute = ({ element: Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return <Component />;
};

function App() {

  return (
    <NavigationProvider>
      <Routes>

        <Route path='/' element={<AdminLogin />} />

        <Route element={<Layout />}>
          <Route path='/dashboard' element={<ProtectedRoute element={Dashboard} />} />

          <Route path='/product/product-hierarchy' element={<ProtectedRoute element={Category} />} />
          <Route path='/product/tags' element={<ProtectedRoute element={ProductTags} />} />
          <Route path='/product/gst' element={<ProtectedRoute element={GST} />} />
          <Route path='/product/variants' element={<ProtectedRoute element={Variants} />} />
          <Route path='/product/brand' element={<ProtectedRoute element={Brand} />} />
          <Route path='/product/group' element={<ProtectedRoute element={Group} />} />
          <Route path='/product/taxonomy' element={<ProtectedRoute element={Taxonomy} />} />
          <Route path='/product/attribute' element={<ProtectedRoute element={Attribute} />} />
          <Route path='/product/fabricContent' element={<ProtectedRoute element={FabricContent} />} />
          {/* 
        <Route path='/product/tax/tax-masters' element={<ProtectedRoute element={TaxMasters} />} />
        <Route path='/product/tax/gst-slabs' element={<ProtectedRoute element={GSTSlabs} />} />
        <Route path='/product/tax/hsn' element={<ProtectedRoute element={HsnSac} />} />
 */}

          <Route path='/product/product/articles' element={<ProtectedRoute element={Articles} />} />
          <Route path='/product/product/create' element={<ProtectedRoute element={CreateProduct} />} />


          <Route path='/product/pim' element={<ProtectedRoute element={ProductInfoManagement} />} />
          <Route path='/product/pim/map-channel' element={<ProtectedRoute element={MapChannel} />} />
          <Route path='/product/pim/enrich-product' element={<ProtectedRoute element={EnrichProduct} />} />

          <Route path='/product/price-book' element={<ProtectedRoute element={PriceBook} />} />
          <Route path='/product/price-book/create' element={<ProtectedRoute element={CreatePriceBook} />} />

          <Route path='/product/barcode' element={<ProtectedRoute element={VariantBarcode} />} />

          <Route path='/product/history' element={<ProtectedRoute element={ProductHistory} />} />




          {/* sales */}
          <Route path='/sales/enquiry' element={<ProtectedRoute element={Enquiry} />} />
          <Route path='/sales/order-management' element={<ProtectedRoute element={OrderOpen} />} />
          <Route path='/sales/delivery' element={<ProtectedRoute element={OrderDelivered} />} />
          <Route path='/sales/cancel' element={<ProtectedRoute element={OrderCancelled} />} />
          <Route path='/sales/abandon' element={<ProtectedRoute element={OrderAbondened} />} />
          <Route path='/sales/return' element={<ProtectedRoute element={OrderReturned} />} />
          <Route path='/sales/create-order' element={<ProtectedRoute element={CreateOrder} />} />

          <Route path='/sales/sales-order/:orderNo' element={<ProtectedRoute element={SalesOrder} />} />
          <Route path='/sales/sales-order' element={<ProtectedRoute element={SalesOrder} />} />

          <Route path='/sales/invoice' element={<ProtectedRoute element={Invoice} />} />

          <Route path='/sales/shippment-note' element={<ProtectedRoute element={ShipmentNote} />} />

          <Route path='/sales/return-note' element={<ProtectedRoute element={ReturnNote} />} />

          <Route path='/sales/packing' element={<ProtectedRoute element={Packing} />} />


          {/* Inventory */}
          <Route path='/inventory/stocks' element={<ProtectedRoute element={Stocks} />} />
          <Route path='/inventory/stocks/opening-stocks' element={<ProtectedRoute element={OpeningStocks} />} />

          <Route path='/inventory/collections' element={<ProtectedRoute element={Collections} />} />
          <Route path='/inventory/collections/create' element={<ProtectedRoute element={CollectionCreation} />} />

          <Route path='/inventory/discounts' element={<ProtectedRoute element={Discounts} />} />
          <Route path='/inventory/discounts/create' element={<ProtectedRoute element={DiscountCreation} />} />


          {/* crm */}
          <Route path='/crm/customer' element={<ProtectedRoute element={Customer} />} />
          <Route path='/crm/customer/create' element={<ProtectedRoute element={CustomerCreate} />} />
          <Route path='/crm/customer/draft' element={<ProtectedRoute element={CustomerDraft} />} />

          <Route path='/crm/loyalty' element={<ProtectedRoute element={Loyalty} />} />
          <Route path='/crm/loyalty/create' element={<ProtectedRoute element={LoyaltyCreate} />} />
          <Route path='/crm/loyalty/point-status' element={<ProtectedRoute element={LoyaltyPointStatus} />} />

          <Route path='/crm/salesman' element={<ProtectedRoute element={Salesman} />} />


          {/* E-Commerce */}
          <Route path='/e-commerce/mobile' element={<ProtectedRoute element={MobileApp} />} />
          <Route path='/e-commerce/mobile/publish' element={<ProtectedRoute element={PublishApp} />} />
          <Route path='/e-commerce/mobile/live' element={<ProtectedRoute element={AppIsLive} />} />

          <Route path='/e-commerce/website' element={<ProtectedRoute element={Website} />} />
          <Route path='/e-commerce/website/site-info' element={<ProtectedRoute element={SiteInfo} />} />

          <Route path='/e-commerce/settings' element={<ProtectedRoute element={Settings} />} />
          <Route path='/e-commerce/settings/publish' element={<ProtectedRoute element={Publish} />} />


          {/* Settings */}
          <Route path='/settings/company-profile' element={<ProtectedRoute element={CompanyProfile} />} />
          <Route path='/settings/company-profile/channels' element={<ProtectedRoute element={Channel} />} />
          <Route path='/settings/company-profile/other-settings' element={<ProtectedRoute element={OtherSettings} />} />
          <Route path='/settings/company-profile/legal' element={<ProtectedRoute element={Legal} />} />
          <Route path='/settings/company-profile/business-rules' element={<ProtectedRoute element={BusinessRules} />} />

          <Route path='/settings/location' element={<ProtectedRoute element={LocationDetails} />} />
          <Route path='/settings/location/new-location' element={<ProtectedRoute element={NewLocation} />} />

          <Route path='/settings/payment' element={<ProtectedRoute element={Payment} />} />

          <Route path='/settings/shipment' element={<ProtectedRoute element={Shipment} />} />
          <Route path='/settings/deliverymode' element={<ProtectedRoute element={DeliveryMode} />} />

          <Route path='/settings/user-management' element={<ProtectedRoute element={AddUsers} />} />
          <Route path='/settings/user/role' element={<Role />} />
          <Route path='/settings/user/role-privileges' element={<ProtectedRoute element={RolePrivileges} />} />

          <Route path='/settings/location-type' element={<ProtectedRoute element={LocationType} />} />

          <Route path='/settings/filters' element={<ProtectedRoute element={Filters} />} />

        </Route>
      </Routes>
    </NavigationProvider>
  );
}

export default App;
