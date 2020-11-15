<template>
  <div>
    <form action="#" @submit.prevent="submit" class="q-gutter-md">
      <q-input
        filled
        v-model="form.name"
        label="Nombre de categoria"
        required
        dense
        :rules="[ val => val && val.length > 3 || 'Ingrese un valor válido']"
      />

      <div id="preview" class="text-center">
        <img style="max-height: 300px" v-if="file_url" :src="file_url" />
      </div>

      <div class="text-center">
        <q-btn
          v-if="file_url!=''"
          outline
          icon="close"
          color="indigo-14"
          size="sm"
          label="Eliminar imagen"
          @click="detachImage"
        />
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
        <q-btn color="indigo-14" icon="save" class="full-width" type="submit" label="guardar" />
      </div>
    </form>
  </div>
</template>



<script>
import firebase from "firebase";

export default {
  name: "CatForm",
  props: {
    uid: {
      type: String,
      required: true
    },

    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      id: 0,
      file_url: "",
      file: null,
      form: {
        name: "",
        image: ""
      }
    };
  },
  mounted: function() {
    if (Object.keys(this.item).length !== 0) {
      this.id = this.item.id;
      console.log(this.id);
      this.form.name = this.item.name;
      this.form.image = this.item.image;
      this.file_url = this.item.image;
    }
  },
  methods: {
    submit: async function() {
      let self = this;
      this.$q.loading.show({
        message: "Guardando ..."
      });

      if (this.file !== null) {
        //carga imagen si la hay
        this.form.image = await this.uploadFile();
      }

      //si se edita y ya existe una imagen la borramos para no des aprovechar espacio en storage
      if (Object.keys(this.item).length !== 0) {
        if (this.item.image !== "" && this.item.image !== this.form.image) {
          //console.log(this.item.image,this.form.image)
          var storageRef = firebase.storage().refFromURL(this.item.image);
          storageRef.delete();
        }
      }

      var db = firebase.firestore();

      var db_data = {
        uid: this.uid,
        name: this.form.name,
        image: this.form.image
      };

      if (Object.keys(this.item).length !== 0) {
        //editar
        db.collection("categories_" + this.uid)
          .doc(this.id)
          .update(db_data)
          .then(function() {
            db_data.id = self.id;
            self.$q.loading.hide();
            self.$emit("submited", db_data);
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        db.collection("categories_" + this.uid)
          .add(db_data)
          .then(function(docRef) {
            db_data.id = docRef.id;
            self.$q.loading.hide();
            self.$emit("submited", db_data);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
    },
    uploadFile: async function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        var storageRef = firebase.storage().ref();
        var file = self.file;
        var uploadTask = storageRef
          .child("categories_" + self.uid + "/" + self.form.name + file.name)
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
    },
    detachImage() {
      this.file = null;
      this.file_url = "";
      this.form.image = "";
    }
  }
  // watch: {
  //   item: function(val) {
  //     if (val !== {}) {
  //       this.id = val.id;
  //       this.form.name = val.name;
  //       this.form.image = val.image;
  //     }
  //   }
  // }
};
</script>
