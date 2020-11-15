<template>
  <div>
    <div class="text-h6">Banners</div>
    <br />
    <div class="row">
      <div class="col-8">
        <p>
          Agrega los banners que apareceran al inicio de la App, puedes tener un máximo de 5 imágenes.
          <br />Tamaño recomendado:
        </p>
      </div>
      <div class="col text-center">
        <q-btn  v-if="banners.length<5" push color="indigo-14" icon="add_photo_alternate" @click="dialog=true">Agregar imagen</q-btn>
      </div>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="(item,index) in banners" :key="item" class="my-card" style="width: 320px">
        <q-img :src="item"></q-img>

        <q-card-actions>
          <q-btn flat @click="deleteItem(index,item)">Eliminar</q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Banner</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <form action="#" @submit.prevent="submit" class="q-gutter-md">
            <div id="preview" class="text-center">
              <img style="max-height: 300px" v-if="file_url" :src="file_url" />
            </div>

            <q-input
              filled
              dense
              v-model="file"
              type="file"
              @change="onFileChange"
              hint="Agregar imagen"
            />
            <div class="text-center q-mt-md">
              <q-btn
                color="indigo-14"
                icon="save"
                class="full-width"
                type="submit"
                label="guardar"
              />
            </div>
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cerrar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "Banners",
  data() {
    return {
      uid: "",
      dialog: false,
      user: null,
      name: "",
      banners: [],
      file_url: "",
      file: null
    };
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
          if (doc.data().hasOwnProperty("banners")) {
            self.banners = doc.data().banners;
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
  },
  methods: {
    submit: async function() {
      if (this.file) {
        let self = this;
        this.$q.loading.show({
          message: "Guardando ..."
        });

        var banner = await this.uploadFile();
        this.banners.push(banner);

        var db = firebase.firestore();
        var db_data = {
          banners: this.banners
        };

        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update(db_data)
          .then(function() {
            self.dialog = false;
            self.$q.loading.hide();
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        this.$q.notify({
          message: "Seleccione una imagen",
          color: "warning"
        });
      }
    },
    deleteItem(index, item) {
      var db = firebase.firestore();
      this.banners.splice(index, 1);
      var db_data = {
        banners: this.banners
      };

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update(db_data)
        .then(function() {
          var storageRef = firebase.storage().refFromURL(item);
          storageRef.delete();
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    uploadFile: async function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        var storageRef = firebase.storage().ref();
        var file = self.file;
        var uploadTask = storageRef
          .child("banners_" + self.uid + "/" + file.name)
          .put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          function(error) {
            console.log(error);
            reject();
          },
          function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function(downloadURL) {
                resolve(downloadURL);
              });
          }
        );
      });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      //console.log(file);
      if (file.size > 2048 * 2048) {
        this.$q.notify({
          color: "warning",
          message: "La imagen es muy grande",
          icon: "warning",
          position: "center"
        });
        return;
      } else if (file.type != "image/jpeg" && file.type != "image/png") {
        this.$q.notify({
          color: "warning",
          message: "La imagen no tiene un formato valido",
          icon: "warning",
          position: "center"
        });
      } else {
        this.file = e.target.files[0];
        this.file_url = URL.createObjectURL(file);
      }
    }
  }
};
</script>