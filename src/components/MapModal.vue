<template>
  <div>
    <q-dialog  persistent v-model="active">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ubicación cliente</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <GmapMap
            :center="{lat:lat, lng:lng}"
            :zoom="14"
            :options="{ streetViewControl: false }"
            style="width: 500px; height: 400px"
          >
            <GmapMarker :position="{lat:lat, lng:lng}" :clickable="false" :draggable="false" />
          </GmapMap>
          <p class="q-mt-md text-body1">{{dir}}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="indigo-14" @click="diss" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
export default {
  name: "MapModal",
  props: ["active", "dir","lat", "lng"],
  computed: {
    google: gmapApi,
  },
  methods: {
    diss() {
      this.$emit("dismiss", 1);
    }
  }
};
</script>