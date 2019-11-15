import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import EditCus from "@/pages/EditCus.vue"
import Dashboard from "@/pages/Dashboard.vue";
import NewCus from "@/pages/NewCus.vue";
import NewStaff from "@/pages/NewStaff.vue";
import ExportGoods from "@/pages/ExportGoods.vue";
import WarehouseReport from "@/pages/WarehouseReport.vue";
import Warehouse from "@/pages/Warehouse.vue";
import Products from "@/pages/Products.vue";
import Customer from "@/pages/Customer.vue";
import EditPro from "@/pages/EditPro.vue";
import AddNew from "@/pages/NewPro.vue";
import AfterImport from "@/pages/AfterImport.vue";
import Staff from "@/pages/Staff.vue";
import EditStaff from "@/pages/EditStaff.vue";
import Store from "@/pages/Store.vue";
import Payroll from "@/pages/Payroll.vue";
import ViewPayroll from "@/pages/ViewPayroll.vue";
import EditGIS from "@/pages/EditGoodsInStore.vue";
import ViewDetails from "@/pages/DetailCustomer.vue";
import IPD from "@/pages/ImportProductData.vue";
import Email from "@/pages/email.vue";

const routes = [{
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [{
            path: "dashboard",
            name: "Dashboard",
            component: Dashboard
        },
        {
            path: "newcus",
            name: "New Customer",
            component: NewCus
        },
        {
            path: "editcus/:id",
            name: "Edit Customer",
            component: EditCus
        },
        {
            path: "exportgoods/:id",
            name: "Export Goods",
            component: ExportGoods
        },
        {
            path: "warehousereport",
            name: "Warehouse Report",
            component: WarehouseReport
        },
        {
            path: "warehouse",
            name: "Warehouse",
            component: Warehouse
        },
        {
            path: "products",
            name: "Products",
            component: Products
        },
        {
            path: "editgis/:id",
            name: "Edit Good in Store",
            component: EditGIS
        },
        {
            path: "customer",
            name: "Customer",
            component: Customer
        },
        {
            path: "editpro/:product_id",
            name: "Edit Product",
            component: EditPro
        },
        {
            path: "newpro",
            name: "Add New Product",
            component: AddNew
        },
        {
            path: "afterimport/:date",
            name: "   ",
            component: AfterImport
        },
        {
            path: "staff",
            name: "Staff",
            component: Staff
        },
        {
            path: "newstaff",
            name: "New Staff",
            component: NewStaff
        },
        {
            path: "editstaff/:id",
            name: "Edit Staff",
            component: EditStaff
        },
        {
            path: "store",
            name: "Store",
            component: Store
        },
        {
            path: "payroll",
            name: "Payroll",
            component: Payroll
        },
        {
            path: "viewpayroll",
            name: "View Payroll",
            component: ViewPayroll
        },
        {
            path: "detailcus/:id",
            name: "View Details",
            component: ViewDetails
        },
        {
            path: "ipd",
            name: "Add Products",
            component: IPD
        },
        {
            path: "email",
            name: "Email",
            component: Email
        },
    ]
}];

export default routes;