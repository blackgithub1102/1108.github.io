<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>timeline</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <hr>
      <sidebar-link to="/products">
        <md-icon>dashboard</md-icon>
        <p>Products > Import</p>
      </sidebar-link>
      <sidebar-link to="/warehouse">
        <md-icon>home_work</md-icon>
        <p>Warehouse > Export</p>
      </sidebar-link>
      <sidebar-link to="/warehousereport">
        <md-icon>receipt</md-icon>
        <p>Warehouse Report</p>
      </sidebar-link>
      <hr>
      <sidebar-link to="/customer">
        <md-icon>account_box</md-icon>
        <p>Customer</p>
      </sidebar-link>
      <hr>
      <sidebar-link to="/staff">
        <md-icon>group</md-icon>
        <p>Staff</p>
      </sidebar-link>
      <sidebar-link to="/store">
        <md-icon>store</md-icon>
        <p>Store</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content></dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
};
</script>
