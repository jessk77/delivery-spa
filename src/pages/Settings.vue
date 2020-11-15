<template>
  <q-page>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el label="Ajustes" />
    </q-breadcrumbs>
    <p class="text-h6">Ajustes</p>

    <q-card>
      <q-tabs v-model="tab" class="bg-indigo-13 text-white" align="justify" narrow-indicator>
        <q-tab name="general" icon="settings" label="General" />
        <q-tab name="images" icon="collections" label="Banners" />
        <q-tab name="map" icon="place" label="Localización" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <General />
        </q-tab-panel>

        <q-tab-panel name="images" class>
          <Banners />
        </q-tab-panel>

        <q-tab-panel name="map">
           <Map />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import General from 'pages/settings/General'
import Banners from 'pages/settings/Banners'
import Map from 'pages/settings/Map'
// import Process from 'components/orders/Process'

export default {
  name: "Settings",
  components: {
    General,
    Banners,
    Map
  },
  data() {
    return {
      buscar: "",
      tab: "general",
    };
  }
};
</script>
