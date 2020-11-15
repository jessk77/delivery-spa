<template>
  <q-page>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el to="/dashboard" label="Inicio" />
      <q-breadcrumbs-el label="Ordenes" />
    </q-breadcrumbs>
    <p class="text-h6">Pedidos</p>

    <q-card flat>
        <q-tabs
          v-model="tab"
          class="bg-indigo-13 text-white"
          align="justify"
          narrow-indicator
        >
          <q-tab  name="news" icon="receipt" label="Nuevos" />
          <q-tab name="inprogress" icon="fastfood" label="Preparando" />
          <q-tab name="ready" icon="check" label="Enviadas" />
          <q-tab name="history" icon="assignment" label="Historial" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-grey-2 text-center">
          <q-tab-panel name="news">
           <New />
          </q-tab-panel>

          <q-tab-panel name="inprogress" class="">
            <Process />
          </q-tab-panel>

          <q-tab-panel name="ready">
           <Sended />
          </q-tab-panel>

           <q-tab-panel name="history">
           <List />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

    
  </q-page>
</template>

<script>

import New from 'components/orders/New'
import Process from 'components/orders/Process'
import Sended from 'components/orders/Sended'
import List from 'components/orders/List'

export default {
  name: "PageIndex",
  components:{
    New,
    Process,
    Sended,
    List
  },
  data() {
    return {
      alert: false,
      buscar: "",
      tab: "news",
    };
  },
  filters: {
    
  }
};
</script>
