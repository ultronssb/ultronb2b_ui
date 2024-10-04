export const data = [
  {
    id: "1",
    name: "Dashboard",
    parent_id: null,
    orderBy: 1,
    path: "/dashboard",
    icon: <span className="material-symbols-outlined">monitoring</span>,
  },
  {
    id: "2",
    name: "Product",
    parent_id: null,
    orderBy: 2,
    path: "/product/product-hierarchy",
    icon: <span className="material-symbols-outlined">inventory_2</span>,
    defaultChildId: "8",
  },
  {
    id: "3",
    name: "Sales",
    parent_id: null,
    orderBy: 3,
    path: "/sales/order-management",
    icon: <span className="material-symbols-outlined">shopping_cart</span>,
    defaultChildId: "35",
  },
  {
    id: "4",
    name: "Inventory",
    parent_id: null,
    orderBy: 4,
    path: "/inventory/stocks",
    icon: <span className="material-symbols-outlined">inventory</span>,
    defaultChildId: "53",
  },
  {
    id: "5",
    name: "CRM",
    parent_id: null,
    orderBy: 5,
    path: "/crm/customer",
    icon: <span className="material-symbols-outlined">volunteer_activism</span>,
    defaultChildId: "62"
  },
  {
    id: "6",
    name: "E-Commerce",
    parent_id: null,
    orderBy: 6,
    path: "/e-commerce/mobile",
    icon: <span className="material-symbols-outlined">shoppingmode</span>,
    defaultChildId: "71",
  },
  {
    id: "7",
    name: "Settings",
    parent_id: null,
    orderBy: 7, path: "/settings/company-profile", icon: <span className="material-symbols-outlined">
      settings</span>,
      defaultChildId: "81",
  },


  /* Product Child Component */
  { id: "8", name: "Product Categories", parent_id: "2", orderBy: 1, path: "/product/product-hierarchy" },
  { id: "9", name: "Product", parent_id: "2", orderBy: 2, path: "/product/product/articles" },
  { id: "10", name: "Product Enrichment", parent_id: "2", orderBy: 3, path: "/product/pim" },//pims
  { id: "11", name: "Price Book", parent_id: "2", orderBy: 4, path: "/product/price-book" },
  { id: "12", name: "Barcode", parent_id: "2", orderBy: 5, path: "/product/barcode" },
  { id: "13", name: "History", parent_id: "2", orderBy: 6, path: "/product/history" },

  { id: "14", name: "Product Category", parent_id: '8', orderBy: 1, path: "/product/product-hierarchy", },
  { id: "15", name: "Product Tags", parent_id: "8", orderBy: 2, path: "/product/tags" },
  { id: "16", name: "Tax", parent_id: "8", orderBy: 3, path: "/product/tax/gst" },
  { id: "17", name: "Variants", parent_id: "8", orderBy: 4, path: "/product/variants" },
  { id: "18", name: "Brand", parent_id: "8", orderBy: 6, path: "/product/brand" },
  { id: "19", name: "Group", parent_id: "8", orderBy: 7, path: "/product/group" },
  { id: "20", name: "Taxonomy", parent_id: "8", orderBy: 8, path: "/product/taxonomy" },
  // { id: "21", name: "Attribute", parent_id: "8", orderBy: 9, path: "/product/attribute" },


  { id: "22", name: "Product", parent_id: "9", orderBy: 1, path: "/product/product/articles" },
  { id: "23", name: "Draft", parent_id: "9", orderBy: 2, path: "/product/product/draft" },
  { id: "24", name: "Packaging", parent_id: "9", orderBy: 3, path: "/product/product/package" },
  { id: "25", name: "Upload", parent_id: "9", orderBy: 4, path: "/product/product/upload" },

  { id: "26", name: "Product Information", parent_id: "10", orderBy: 1, path: "/product/pim" },
  { id: "27", name: "Map Channel", parent_id: "10", orderBy: 3, path: "/product/pim/map-channel" },
  // { id: "28", name: "Enrich Product", parent_id: "10", orderBy: 4, path: "/product/pim/enrich-product" },

  { id: "29", name: "Price Book", parent_id: "11", orderBy: 1, path: "/product/price-book" },
  { id: "30", name: "Create", parent_id: "11", orderBy: 2, path: "/product/price-book/create" },

  { id: "31", name: "Barcode", parent_id: "12", orderBy: 1, path: "/product/barcode" },
  { id: "32", name: "Create", parent_id: "12", orderBy: 2, path: "/product/barcode/create" },

  { id: "33", name: "History", parent_id: "13", orderBy: 1, path: "/product/history" },
  { id: "34", name: "Create History", parent_id: "13", orderBy: 2, path: "/product/history/create" },

  // { id: "22", name: "Tax Masters", parent_id: "9", orderBy: 1, path: "/product/tax/tax-masters"},
  // { id: "23", name: "GST", parent_id: "9", orderBy: 2, path: "/product/tax/gst"},
  // { id: "24", name: "GST Slabs", parent_id: "9", orderBy: 3, path: "/product/tax/gst-slabs"},
  // { id: "25", name: "HSN/SAC", parent_id: "9", orderBy: 4, path: "/product/tax/hsn"},

  /* Sales Child Component */
  { id: "35", name: "Order Management", parent_id: "3", orderBy: 1, path: "/sales/order-management" },
  { id: "101", name: "Enquiry", parent_id: "3", orderBy: 2, path: "/sales/enquiry" },
  { id: "36", name: "Sales Order", parent_id: "3", orderBy: 3, path: "/sales/sales-order" },
  { id: "37", name: "Invoice", parent_id: "3", orderBy: 4, path: "/sales/invoice" },
  { id: "38", name: "Shippment Note", parent_id: "3", orderBy: 5, path: "/sales/shippment-note" },
  { id: "39", name: "Return Note", parent_id: "3", orderBy: 6, path: "/sales/return-note" },
  { id: "40", name: "Packing", parent_id: "3", orderBy: 7, path: "/sales/packing" },

  { id: "41", name: "Order Management", parent_id: "35", orderBy: 1, path: "/sales/order-management" },
  { id: "42", name: "Open Order", parent_id: "35", orderBy: 2, path: "/sales/open-order" },
  { id: "43", name: "Delivered", parent_id: "35", orderBy: 3, path: "/sales/delivery" },
  { id: "44", name: "Cancelled", parent_id: "35", orderBy: 4, path: "/sales/cancel" },
  { id: "45", name: "Abandoned", parent_id: "35", orderBy: 5, path: "/sales/abandon" },
  { id: "46", name: "Returned", parent_id: "35", orderBy: 6, path: "/sales/return" },
  { id: "47", name: "Create Order", parent_id: "35", orderBy: 7, path: "/sales/create-order" },

  { id: "48", name: "Sales Order", parent_id: "36", orderBy: 1, path: "/sales/sales-order" },

  { id: "49", name: "Invoice", parent_id: "37", orderBy: 1, path: "/sales/invoice" },

  { id: "50", name: "Shipment Note", parent_id: "38", orderBy: 1, path: "/sales/shippment-note" },

  { id: "51", name: "Return Note", parent_id: "39", orderBy: 1, path: "/sales/return-note" },

  { id: "52", name: "Packing", parent_id: "40", orderBy: 1, path: "/sales/packing" },


  /* Inventory Child Component */
  { id: "53", name: "Stocks", parent_id: "4", orderBy: 1, path: '/inventory/stocks' },
  { id: "54", name: "Collections", parent_id: "4", orderBy: 2, path: "/inventory/collections" },
  { id: "55", name: "Discounts", parent_id: "4", orderBy: 3, path: "/inventory/discounts" },

  { id: "56", name: "Stocks", parent_id: "53", orderBy: 1, path: '/inventory/stocks' },
  { id: "57", name: "Opening Stock", parent_id: "53", orderBy: 2, path: '/inventory/stocks/opening-stocks' },
  { id: "58", name: "Bulk Upload", parent_id: "53", orderBy: 3, modal: true },

  { id: "59", name: "Collections", parent_id: "54", orderBy: 1, path: "/inventory/collections" },
  { id: "60", name: "Bulk Upload", parent_id: "54", orderBy: 3, modal: true },

  { id: "61", name: "Discounts", parent_id: "55", orderBy: 1, path: "/inventory/discounts" },
  // { id: "610", name: "Create Discounts", parent_id: "54", orderBy: 2, path: "/inventory/discounts/create" },


  /* CRM Child Component */
  { id: "62", name: "Customer", parent_id: "5", orderBy: 1, path: "/crm/customer" },
  { id: "63", name: "Loyalty", parent_id: "5", orderBy: 2, path: "/crm/loyalty" },
  { id: "64", name: "Sales Man", parent_id: "5", orderBy: 3, path: "/crm/salesman" },

  { id: "65", name: "Customer", parent_id: "62", orderBy: 1, path: "/crm/customer" },
  { id: "66", name: "Draft", parent_id: "62", orderBy: 2, path: "/crm/customer/draft" },
  { id: "67", name: "Bulk Uplaod", parent_id: "62", orderBy: 5, modal: true },

  { id: "68", name: "Loyalty", parent_id: "63", orderBy: 1, path: "/crm/loyalty" },
  { id: "69", name: "Point Status", parent_id: "63", orderBy: 3, path: "/crm/loyalty/point-status" },

  { id: "70", name: "Sales Man", parent_id: "64", orderBy: 1, path: "/crm/salesman" },


  /* E-Commerce Child Component */
  { id: "71", name: "Mobile", parent_id: "6", orderBy: 1, path: "/e-commerce/mobile" },
  { id: "72", name: "Website", parent_id: "6", orderBy: 2, path: "/e-commerce/website" },
  { id: "73", name: "Settings", parent_id: "6", orderBy: 3, path: "/e-commerce/settings" },

  { id: "74", name: "Mobile App", parent_id: "71", orderBy: 1, path: "/e-commerce/mobile" },
  { id: "75", name: "Publish Your App", parent_id: "71", orderBy: 2, path: "/e-commerce/mobile/publish" },
  { id: "76", name: "Your App is Live", parent_id: "71", orderBy: 3, path: "/e-commerce/mobile/live" },

  { id: "77", name: "Website", parent_id: "72", orderBy: 1, path: "/e-commerce/website" },
  { id: "78", name: "Site Info", parent_id: "72", orderBy: 2, path: "/e-commerce/website/site-info" },

  { id: "79", name: "E-Com Settings", parent_id: "73", orderBy: 1, path: "/e-commerce/settings" },
  { id: "80", name: "Publish", parent_id: "73", orderBy: 2, path: "/e-commerce/settings/publish" },


  /* Settings Child Component */
  { id: "81", name: "Company Profile", parent_id: "7", orderBy: 1, path: "/settings/company-profile" },
  { id: "82", name: "Location", parent_id: "7", orderBy: 2, path: "/settings/location" },
  { id: "83", name: "Payment", parent_id: "7", orderBy: 3, path: "/settings/payment" },
  { id: "84", name: "Shipment", parent_id: "7", orderBy: 4, path: "/settings/shipment" },
  { id: "85", name: "Users", parent_id: "7", orderBy: 5, path: "/settings/user-management" },
  { id: "86", name: "Location Type", parent_id: "7", orderBy: 6, path: "/settings/location-type" },

  { id: "87", name: "Company Profile", parent_id: "81", orderBy: 1, path: '/settings/company-profile' },
  { id: "88", name: "Channels", parent_id: "81", orderBy: 2, path: '/settings/company-profile/channels' },
  { id: "89", name: "Other Settings", parent_id: "81", orderBy: 3, path: '/settings/company-profile/other-settings' },
  { id: "90", name: "Legal", parent_id: "81", orderBy: 4,path: '/settings/company-profile/legal' },
  { id: "91", name: "Business Rules", parent_id: "81", orderBy: 5, path: '/settings/company-profile/business-rules' },

  { id: "92", name: "Location Details", parent_id: "82", orderBy: 1, path: "/settings/location" },
  { id: "93", name: "Bulk Upload", parent_id: "82", orderBy: 3, modal: true },

  { id: "94", name: "Payment Mode", parent_id: "83", orderBy: 1, path: "/settings/payment" },

  { id: "95", name: "Shipment Mode", parent_id: "84", orderBy: 1, path: "/settings/shipment" },

  { id: "98", name: "Users", parent_id: "85", orderBy: 1, path: "/settings/user-management" },
  { id: "96", name: "Role", parent_id: "85", orderBy: 2, path: "/settings/user/role" },
  { id: "97", name: "Role Privileges", parent_id: "85", orderBy: 3, path: "/settings/user/role-privileges" },
];
