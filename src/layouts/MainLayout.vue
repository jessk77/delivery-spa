<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-grey-2 text-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>Admin Delivery</q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="400"
      bordered
      content-class="drawer-bg"
    >
      <q-scroll-area style="height: calc(100% - 160px); margin-top: 170px;">
        <q-list class="q-mt-sm" padding>
          <EssentialLink
            class="text-grey-1"
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
      <div class="absolute-top" style="height: 160px">
        <div class="absolute-bottom bg-transparent text-center">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="~assets/profile.jpg" />
          </q-avatar>
          <div class="text-grey-2">Bienvenido</div>
          <div class="text-weight-bold q-mb-sm text-light-blue-1 ">{{userName}}</div>
          <q-btn
            flat
            icon="input"
            color="grey-3"
            size="sm"
            label="Cerrar Sesión"
            @click="logout"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-lg">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";
import firebase from "firebase";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },
  created: function(){
    var user = firebase.auth().currentUser;
    if(!user){
      this.$router.push("/")
    }
    this.userName=user.displayName
  },
  methods:{
    logout (){
      firebase.auth().signOut().then(function() {
  console.log("logout")
}).catch(function(error) {
  // An error happened.
});

    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      userName: "",
      essentialLinks: [
        {
          title: "Inicio",
          icon: "home",
          link: "/dashboard"
        },
        {
          title: "Menu",
          icon: "restaurant",
          link: "/menu"
        },
        {
          title: "Pedidos",
          icon: "assignment_ind",
          link: "/orders"
        },
        // {
        //   title: "Cupones",
        //   icon: "loyalty",
        //   link: "/coupons"
        // },
        {
          title: "Notificaciones",
          icon: "notifications",
          link: "/notifications"
        },
        {
          title: "Ajustes",
          icon: "settings",
          link: "/settings"
        }
      ]
    };
  }
};
</script>

<style>
.drawer-bg {
  background-image: linear-gradient(
    to bottom,
    #0d5ae6 0%,
    #0b96ec 51%,
    #0fc9f4 100%
  );
  background-size: 200% auto;
  transition: background-position 0.2s;
}
</style>