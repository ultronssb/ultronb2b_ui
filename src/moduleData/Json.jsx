import { orderBy } from "lodash";

export const data = [
  {
    id: "1",
    name: "Dashboard",
    parent_id: null,
    orderBy: 1,
    path: "/",
    icon: <span className="material-symbols-outlined">monitoring</span>
  },
  {
    id: "2",
    name: "Product",
    parent_id: null,
    orderBy: 2,
    path: "/product/product-hierarchy",
    icon: <span className="material-symbols-outlined">
      inventory_2</span>,
    defaultChildId: 8,
  },
  {
    id: "3", name: "Sales", parent_id: null, orderBy: 3, path: "/sales", icon: <span className="material-symbols-outlined">
      shopping_cart</span>
  },
  {
    id: "4",
    name: "Inventory",
    parent_id: null,
    orderBy: 4,
    path: "/inventory/stocks",
    icon: <span className="material-symbols-outlined">
      inventory</span>
  },
  {
    id: "5", name: "CRM", parent_id: null, orderBy: 5, path: "/crm", icon: <span className="material-symbols-outlined">
      volunteer_activism</span>
  },
  {
    id: "6",
    name: "E-Commerce",
    parent_id: null,
    orderBy: 6,
    path: "/e-commerce",
    icon: <span className="material-symbols-outlined">
      shoppingmode</span>
  },
  {
    id: "7", name: "Settings", parent_id: null, orderBy: 7, path: "/settings", icon: <span className="material-symbols-outlined">
      settings</span>
  },

  {
    id: "8",
    name: "Product Hierarchy",
    parent_id: "2",
    orderBy: 1,
    path: "/product/product-hierarchy",
  },
  { id: "9", name: "Tax", parent_id: "2", orderBy: 2, path: "/product/tax" },
  {
    id: "10",
    name: "Product",
    parent_id: "2",
    orderBy: 3,
    path: "/product/creation",
  },
  {
    id: "11",
    name: "Variants",
    parent_id: "2",
    orderBy: 4,
    path: "/product/variants",
  },
  {
    id: "12",
    name: "Price Book",
    parent_id: "2",
    orderBy: 5,
    path: "/product/price-book",
  },
  {
    id: "13",
    name: "Barcode",
    parent_id: "2",
    orderBy: 6,
    path: "/product/barcode",
  },
  {
    id: "14",
    name: "History",
    parent_id: "2",
    orderBy: 7,
    path: "/product/history",
  },
  { id: "15", name: "PIM", parent_id: "2", orderBy: 8, path: "/product/pim" },
  { id: "16", name: "ProductHeirarchy", parent_id: '8', orderBy: 1, path: "/product/product-hierarchy"},
  { id: "17", name: "Division", parent_id: "8", orderBy: 2, path: "/product/division"},
  { id: "18", name: "Department", parent_id: "8", orderBy: 3, path: "/product/department" },
  { id: "19", name: "Section", parent_id: "8", orderBy: 4,path: "/product/section" },
  { id: "20", name: "Category", parent_id: "8", orderBy: 5, path: "/product/category" },
  { id: "21", name: "Brand", parent_id: "8", orderBy: 6, path: "/product/brand" },

  { id: "22", name: "Tax Masters", parent_id: "9", orderBy: 1 },
  { id: "23", name: "GST", parent_id: "9", orderBy: 2 },
  { id: "24", name: "GST Slabs", parent_id: "9", orderBy: 3 },
  { id: "25", name: "HSN/SAC", parent_id: "9", orderBy: 4 },

  { id: "26", name: "Articles", parent_id: "10", orderBy: 1 },
  { id: "27", name: "Upload", parent_id: "10", orderBy: 2 },
  { id: "28", name: "Draft", parent_id: "10", orderBy: 3 },
  { id: "29", name: "Approved", parent_id: "10", orderBy: 4 },
  { id: "30", name: "Create", parent_id: "10", orderBy: 5 },
  { id: "31", name: "Package Product", parent_id: "10", orderBy: 6 },

  { id: "32", name: "Variants", parent_id: "11", orderBy: 1 },
  { id: "33", name: "Draft", parent_id: "11", orderBy: 2 },
  { id: "34", name: "Create", parent_id: "11", orderBy: 3 },

  { id: "35", name: "Price Book", parent_id: "12", orderBy: 1 },
  { id: "36", name: "Create", parent_id: "12", orderBy: 2 },

  { id: "37", name: "Barcode", parent_id: "13", orderBy: 1 },
  { id: "38", name: "Create", parent_id: "13", orderBy: 2 },

  { id: "39", name: "History", parent_id: "14", orderBy: 1 },
  { id: "40", name: "Create History", parent_id: "14", orderBy: 2 },

  { id: "41", name: "PIM", parent_id: "15", orderBy: 1 },
  { id: "42", name: "Product Info", parent_id: "15", orderBy: 2 },
  { id: "43", name: "Map Channel", parent_id: "15", orderBy: 3 },
  { id: "44", name: "Enrich Product", parent_id: "15", orderBy: 4 },

  { id: "45", name: "Order Management", parent_id: "3", orderBy: 1 },
  { id: "46", name: "Sales Order", parent_id: "3", orderBy: 2 },
  { id: "47", name: "Invoice", parent_id: "3", orderBy: 3 },
  { id: "48", name: "Shippment Note", parent_id: "3", orderBy: 4 },
  { id: "49", name: "Return Note", parent_id: "3", orderBy: 5 },
  { id: "50", name: "Packing", parent_id: "3", orderBy: 6 },

  { id: "51", name: "Order Management", parent_id: "45", orderBy: 1 },
  { id: "52", name: "Open Order", parent_id: "45", orderBy: 2 },
  { id: "53", name: "Delivered", parent_id: "45", orderBy: 3 },
  { id: "54", name: "Cancelled", parent_id: "45", orderBy: 4 },
  { id: "55", name: "Abandoned", parent_id: "45", orderBy: 5 },
  { id: "56", name: "Returned", parent_id: "45", orderBy: 6 },
  { id: "57", name: "Create Order", parent_id: "45", orderBy: 7 },

  { id: "58", name: "Sales Order", parent_id: "46", orderBy: 1 },

  { id: "59", name: "Invoice", parent_id: "47", orderBy: 1 },

  { id: "60", name: "Shipment Note", parent_id: "48", orderBy: 1 },

  { id: "61", name: "Return Note", parent_id: "49", orderBy: 1 },

  { id: "62", name: "Packing", parent_id: "50", orderBy: 1 },

  { id: "63", name: "Stocks", parent_id: "4", orderBy: 1, path:'/inventory/stocks' },
  { id: "64", name: "Collections", parent_id: "4", orderBy: 2, path: "/inventory/collections"},
  { id: "65", name: "Discounts", parent_id: "4", orderBy: 3, path: "/inventory/discounts" },

  { id: "66", name: "Stocks", parent_id: "63", orderBy: 1, path:'/inventory/stocks' },
  { id: "67", name: "Opening Stock", parent_id: "63", orderBy: 2, path:'/inventory/opening-stocks'},
  { id: "68", name: "Bulk Upload", parent_id: "63", orderBy: 3, model: true},

  { id: "69", name: "Collections", parent_id: "64", orderBy: 1 },
  { id: "70", name: "Create Collection", parent_id: "64", orderBy: 2 },
  { id: "71", name: "Bulk Upload", parent_id: "64", orderBy: 3 },

  { id: "72", name: "Discounts", parent_id: "65", orderBy: 1 },
  { id: "73", name: "Create Discounts", parent_id: "65", orderBy: 2 },

  { id: "74", name: "Customer", parent_id: "5", orderBy: 1 },
  { id: "75", name: "Loyalty", parent_id: "5", orderBy: 2 },
  { id: "76", name: "Sales Man", parent_id: "5", orderBy: 3 },

  { id: "77", name: "Customer", parent_id: "70", orderBy: 1 },
  { id: "78", name: "Draft", parent_id: "70", orderBy: 2 },
  { id: "79", name: "Approved", parent_id: "70", orderBy: 3 },
  { id: "80", name: "Create", parent_id: "70", orderBy: 4 },
  { id: "81", name: "Bulk Uplaod", parent_id: "70", orderBy: 5 },

  { id: "82", name: "Loyalty", parent_id: "77", orderBy: 1 },
  { id: "83", name: "Create New", parent_id: "77", orderBy: 2 },
  { id: "84", name: "Point Status", parent_id: "77", orderBy: 3 },

  { id: "85", name: "Sales Man", parent_id: "76", orderBy: 1 },

  { id: "86", name: "Mobile", parent_id: "6", orderBy: 1 },
  { id: "87", name: "Website", parent_id: "6", orderBy: 2 },
  { id: "88", name: "Settings", parent_id: "6", orderBy: 3 },

  { id: "89", name: "Mobile App", parent_id: "86", orderBy: 1 },
  { id: "90", name: "Publish Your App", parent_id: "86", orderBy: 2 },
  { id: "91", name: "Your App is Live", parent_id: "86", orderBy: 3 },

  { id: "92", name: "Website", parent_id: "87", orderBy: 1 },
  { id: "93", name: "Site Info", parent_id: "87", orderBy: 2 },

  { id: "94", name: "E-Com Settings", parent_id: "88", orderBy: 1 },
  { id: "95", name: "Publish", parent_id: "88", orderBy: 2 },

  { id: "96", name: "Company Profile", parent_id: "7", orderBy: 1 },
  { id: "97", name: "Location", parent_id: "7", orderBy: 2 },
  { id: "98", name: "Payment", parent_id: "7", orderBy: 3 },
  { id: "99", name: "Shipment", parent_id: "7", orderBy: 4 },
  { id: "100", name: "Users", parent_id: "7", orderBy: 5 },

  { id: "101", name: "Company Profile", parent_id: "96", orderBy: 1 },
  { id: "102", name: "Other Settings", parent_id: "96", orderBy: 2 },
  { id: "103", name: "Legal", parent_id: "96", orderBy: 3 },
  { id: "104", name: "Business Rules", parent_id: "96", orderBy: 4 },

  { id: "105", name: "Location Details", parent_id: "97", orderBy: 1 },
  { id: "106", name: "New Location", parent_id: "97", orderBy: 2 },
  { id: "107", name: "Bulk Upload", parent_id: "97", orderBy: 3 },

  { id: "108", name: "Payment Mode", parent_id: "98", orderBy: 1 },

  { id: "109", name: "Shipment Mode", parent_id: "99", orderBy: 1 },

  { id: "110", name: "User Management", parent_id: "100", orderBy: 1 },
  { id: "111", name: "Role", parent_id: "100", orderBy: 2 },
  { id: "112", name: "Role Privileges", parent_id: "100", orderBy: 3 },
  { id: "113", name: "Users", parent_id: "100", orderBy: 4 },
];
