import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import FunctionsIcon from '@material-ui/icons/Functions';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import HouseIcon from '@material-ui/icons/House';
import StoreIcon from '@material-ui/icons/Store';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CategoryIcon from '@material-ui/icons/Category';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AssessmentIcon from '@material-ui/icons/Assessment';

const dashboardRoutes = [
  {
    id: 1,
    collapse: false,
    path: '/dashboard/list',
    childPath: '/list',
    name: 'Dashboard',
    permission: 'dashboard',
    icon: Dashboard,
    childs: [],
  },
  {
    id: 2,
    collapse: false,
    path: '/warehouse/list',
    childPath: '/list',
    name: 'Warehouse',
    permission: 'warehouse',
    icon: HouseIcon,
    childs: [],
  },
  {
    id: 3,
    collapse: false,
    path: '/store/list',
    childPath: '/list',
    name: 'Store',
    permission: 'store',
    icon: StoreIcon,
    childs: [],
  },
  {
    id: 4,
    collapse: false,
    path: '/user/list',
    childPath: '/list',
    name: 'User',
    permission: 'user',
    icon: Person,
    childs: [],
  },
  {
    id: 5,
    collapse: false,
    path: '/supplier/list',
    childPath: '/list',
    name: 'Supplier',
    permission: 'party',
    icon: PeopleOutlineIcon,
    childs: [],
  },
  {
    id: 5,
    collapse: false,
    path: '/whole_sale_customer/list',
    childPath: '/list',
    name: 'Customer',
    permission: 'whole_sale_customer_list',
    icon: PeopleOutlineIcon,
    childs: [],
  },
  // {
  //   id: 6,
  //   collapse: true,
  //   path: '/customer',
  //   childPath: '/list',
  //   name: 'Customer',
  //   icon: PeopleOutlineIcon,
  //   childs: [
  //     {
  //       id: 1,
  //       collapse: false,
  //       path: '/whole_sale_customer',
  //       childPath: '/list',
  //       name: 'Whole Sale Customer',
  //       permission: 'whole_sale_customer_list',
  //       icon: PeopleOutlineIcon,
  //     },
  //     {
  //       id: 2,
  //       collapse: false,
  //       path: '/pos_sale_customer',
  //       childPath: '/list',
  //       name: 'POS Sale Customer',
  //       permission: 'pos_sale_customer_list',
  //       icon: PeopleOutlineIcon,
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   collapse: false,
  //   path: '/product_search/list',
  //   childPath: '/list',
  //   name: 'Product Search',
  //   permission: 'product_search_list',
  //   icon: SearchIcon,
  //   childs: [],
  // },
  {
    id: 7,
    collapse: true,
    path: '/product',
    childPath: '/list',
    name: 'PRD Managment',
    icon: LocalMallIcon,
    childs: [
      {
        id: 0,
        collapse: false,
        path: '/product_management',
        childPath: '/category',
        name: 'Category',
        permission: 'product_category',
        icon: FunctionsIcon,
      },
      {
        id: 1,
        collapse: false,
        path: '/product_size',
        childPath: '/list',
        name: 'Product Size',
        permission: 'product_size',
        icon: FunctionsIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/product_unit',
        childPath: '/list',
        name: 'Product Unit',
        permission: 'product_unit',
        icon: FunctionsIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/product_sub_unit',
        childPath: '/list',
        name: 'Product Sub Unit',
        permission: 'product_sub_unit',
        icon: FunctionsIcon,
      },
      {
        id: 4,
        collapse: false,
        path: '/product_management',
        childPath: '/list',
        name: 'Product List',
        permission: 'product_management',
        icon: LocalMallIcon,
      },
    ],
  },



  {
    id: 9,
    collapse: true,
    path: '/warehouse_management',
    childPath: '/warehouse_stock',
    name: 'WH Management',
    icon: HouseIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/warehouse_management',
        childPath: '/warehouse_stock_in',
        name: 'Warehouse Stock In',
        permission: 'warehouse_stock',
        icon: FunctionsIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/warehouse_management',
        childPath: '/warehouse_stock',
        name: 'Warehouse Stock',
        permission: 'warehouse_stock',
        icon: FunctionsIcon,
      },
 
    ],
  },

  {
    id: 10,
    collapse: true,
    path: '/store_management',
    childPath: '/store_stock',
    name: 'STR Management',
    icon: StoreIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/store_management',
        childPath: '/store_stock_in',
        name: 'Store Stock In',
        permission: 'store_stock_in',
        icon: FunctionsIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/store_management',
        childPath: '/store_stock',
        name: 'Store Stock',
        permission: 'warehouse_stock',
        icon: FunctionsIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/store_management',
        childPath: '/store_stock_request',
        name: 'Stock Request',
        permission: 'warehouse_stock',
        icon: FunctionsIcon,
      },
 
    ],
  },

  {
    id: 10,
    collapse: true,
    path: '/sale_management',
    childPath: '/pos_sale',
    name: 'Sale Management',
    icon: ShoppingCartIcon,
    childs: [
      // {
      //   id: 1,
      //   collapse: false,
      //   path: '/sale_management',
      //   childPath: '/pos_sale',
      //   name: 'Stock Out(POS)',
      //   permission: 'pos_sale',
      //   icon: ShoppingCartIcon,
      // },
      {
        id: 2,
        collapse: false,
        path: '/sale_management',
        childPath: '/whole_sale',
        name: 'Stock Out(Whole)',
        permission: 'whole_sale',
        icon: ShoppingCartIcon,
      },
      // {
      //   id: 3,
      //   collapse: false,
      //   path: '/sale_management',
      //   childPath: '/pos_sale_return',
      //   name: 'Sale Return(POS)',
      //   permission: 'whole_sale',
      //   icon: KeyboardReturnIcon,
      // },
      {
        id: 4,
        collapse: false,
        path: '/sale_management',
        childPath: '/whole_sale_return',
        name: 'Sale Return(Whole)',
        permission: 'whole_sale',
        icon: KeyboardReturnIcon,
      },
 
    ],
  },
  // {
  //   id:11,
  //   collapse: false,
  //   path: '/staff/list',
  //   childPath: '/list',
  //   name: 'Staff',
  //   permission: 'attendence',
  //   icon: PeopleOutlineIcon,
  //   childs: [],
  // },
  // {
  //   id:12,
  //   collapse: false,
  //   path: '/attendence/list',
  //   childPath: '/list',
  //   name: 'Attendence',
  //   permission: 'attendence',
  //   icon: AccessTimeIcon,
  //   childs: [],
  // },
  // {
  //   id:13,
  //   collapse: false,
  //   path: '/expense_category/list',
  //   childPath: '/list',
  //   name: 'Expense Category',
  //   permission: 'expense_category',
  //   icon: AccessTimeIcon,
  //   childs: [],
  // },

  // {
  //   id: 12,
  //   collapse: true,
  //   path: '/attendence',
  //   name: 'Attendence',
  //   icon: PeopleOutlineIcon,
  //   childs: [
  //     {
  //       id: 1,
  //       collapse: false,
  //       path: '/staff',
  //       childPath: '/list',
  //       permission: 'role',
  //       name: 'Attendence',
  //       icon: PeopleOutlineIcon,
  //     },
  //   ],
  // },
  {
    id: 14,
    collapse: true,
    path: '/report',
    name: 'Report',
    icon: AssessmentIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/report',
        childPath: '/trial_balance',
        permission: 'report',
        name: 'Trial Balance',
        icon: AssessmentIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/report',
        childPath: '/customer_due',
        permission: 'report',
        name: 'Customer Due',
        icon: IndeterminateCheckBoxIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/report',
        childPath: '/supplier_due',
        permission: 'report',
        name: 'Supplier Due',
        icon: IndeterminateCheckBoxIcon,
      },
    ],
  },


  {
    id: 15,
    collapse: true,
    path: '/accounts',
    name: 'Accounts',
    icon: AccountBalanceWalletIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/accounts',
        childPath: '/expense_category',
        permission: 'role',
        name: 'Expense Category',
        icon: CategoryIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/accounts',
        childPath: '/expense',
        permission: 'role',
        name: 'Expense',
        icon: IndeterminateCheckBoxIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/accounts',
        childPath: '/ladger',
        permission: 'role',
        name: 'Ladger',
        icon: IndeterminateCheckBoxIcon,
      },

    ],
  },

  {
    id: 16,
    collapse: true,
    path: '/pos_settings',
    name: 'POS Setting',
    icon: SettingsIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/role',
        childPath: '/list',
        permission: 'role',
        name: 'Role',
        icon: AccessibilityNewIcon,
      },
    ],
  },

];

export default dashboardRoutes;
