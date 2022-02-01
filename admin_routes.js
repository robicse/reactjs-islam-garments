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
    id: 22,
    collapse: false,
    path: '/product_search/list',
    childPath: '/list',
    name: 'Search',
    permission: 'product_search_list',
    icon: SearchIcon,
    childs: [],
  },
  {
    id: 5,
    collapse: false,
    path: '/user/list',
    childPath: '/list',
    name: 'User',
    permission: 'user',
    icon: Person,
    childs: [],
  },
  {
    id: 14,
    collapse: false,
    path: '/supplier/list',
    childPath: '/list',
    name: 'Supplier',
    permission: 'party',
    icon: PeopleOutlineIcon,
    childs: [],
  },
  {
    id: 18,
    collapse: true,
    path: '/customer',
    childPath: '/list',
    name: 'Customer',
    icon: PeopleOutlineIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/whole_sale_customer',
        childPath: '/list',
        name: 'Whole Sale Customer',
        permission: 'whole_sale_customer_list',
        icon: PeopleOutlineIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/pos_sale_customer',
        childPath: '/list',
        name: 'POS Sale Customer',
        permission: 'pos_sale_customer_list',
        icon: PeopleOutlineIcon,
      },
    ],
  },
  {
    id: 7,
    collapse: true,
    path: '/product',
    childPath: '/list',
    name: 'Product',
    icon: LocalMallIcon,
    childs: [
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
        path: '/product_management',
        childPath: '/list',
        name: 'Product Management',
        permission: 'product_management',
        icon: LocalMallIcon,
      },
    ],
  },
  {
    id: 13,
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
