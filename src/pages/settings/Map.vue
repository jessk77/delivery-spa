<template>
  <div>
    <div class="text-h6">Localización y radio de entrega</div>
    <br />
    <p>Mueve el pin para establecer tu ubicación, define el radio de entrega en kilometros a los que puedes enviar pedidos</p>
<p class="text-subtitle1">Radio: {{radio}} Km</p>
    <q-slider
      v-model="radio"
      :min="1"
      :max="15"
      :step="0.5"
      label
      label-always
      color="indigo-14"
    />
    <GmapMap
      :center="{lat:currentLocation.lat, lng:currentLocation.lng}"
      :zoom="15-(radio/3)"
      :options="{ streetViewControl: false }"
      style="width: 100%; height: 400px"
    >
    <GmapCircle
    :center="{lat:lat, lng:lng}"
    :radius="radio*1000"
    :visible="true"
    :options="{fillColor:'blue',fillOpacity:0.4,strokeColor: 'blue', strokeWeight: 1}"
  ></GmapCircle>

      <GmapMarker
        :position="{lat:lat, lng:lng}"
        :clickable="true"
        :draggable="true"
        @dragend="getCoordenadas($event.latLng)"
      />
    </GmapMap>
    <div class="text-center">
      <q-btn
        push
        color="indigo-14"
        icon="save"
        class="q-ma-md"
        @click="guardar"
        label="guardar cambios"
      />
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import { gmapApi } from "vue2-google-maps";
export default {
  name: "Map",
  data() {
    return {
      uid: "",
      radio: 1,
      currentLocation: { lat: 19.043522331313046, lng: -98.19798590761836 },
      lat: 19.043522331313046,
      lng: -98.19798590761836,
    };
  },
  computed: {
    google: gmapApi,
  },
  mounted: function() {
        let self = this;
        this.uid = firebase.auth().currentUser.uid;
        var db = firebase.firestore();
        db.collection("users")
          .doc(this.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              self.name = doc.data().name;
              if (doc.data().hasOwnProperty("radio")) {
                self.radio = doc.data().radio;
                self.lat = doc.data().lat;
                self.currentLocation.lat = doc.data().lat;
                self.lng = doc.data().lng;
                self.currentLocation.lng = doc.data().lng;
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
  },
  methods: {
        getCoordenadas(evnt) {
      this.lat = evnt.lat();
      this.lng = evnt.lng();
      //console.log(this.coordenadas);
    },
    guardar: function() {
      let self = this;

      var db = firebase.firestore();
      var db_data = {
        radio: this.radio,
        lat: this.lat,
        lng: this.lng
      };

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update(db_data)
        .then(function() {
          self.$q.notify({
            message: "Se han guardado los cambios",
            color: "green"
          });
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  }
};
</script>