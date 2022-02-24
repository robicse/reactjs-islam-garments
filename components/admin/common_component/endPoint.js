import { baseUrl } from "const/api";

const endpoint = {
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    supplyerActiveListUrl: `${baseUrl}/supplier_active_list`,
    storeActiveListUrl: `${baseUrl}/store_active_list`,
    sizesActiveListUrl: `${baseUrl}/product_size_active_list`,
    unitActiveListUrl: `${baseUrl}/product_unit_active_list`,
    categoryActiveListUrl: `${baseUrl}/product_category_active_list`,
    subUnitActiveListUrl: `${baseUrl}/product_sub_unit_list`,
    wholeSaleCustomerActiveListUrl: `${baseUrl}/whole_sale_customer_active_list`,
    // headers: { headers: { Authorization: "Bearer " + user.details.token } },
  };