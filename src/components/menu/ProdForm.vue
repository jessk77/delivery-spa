<template>
  <div>
    <form action="#" @submit.prevent="submit" class="q-gutter-md">
      <q-input
        filled
        v-model="form.name"
        label="Nombre del producto"
        required
        dense
        :rules="[ val => val && val.length > 3 || 'Ingrese un valor válido']"
      />
      <q-input
        filled
        v-model="form.description"
        counter
        maxlength="200"
        label="Descripción del producto"
        dense
      />
      <q-input
        filled
        v-model="form.price"
        label="Precio del producto"
        required
        dense
        :rules="[ val => val && val > 0 || 'Ingrese un valor válido']"
      />

      <div v-if="!modificador" class="text-center">
        <q-btn push color="indigo-14" size="12px" label="agregar  modificador" @click="addModificador" />
      </div>
      <div v-if="modificador" class="text-center">
        <q-btn push color="red-14" size="12px" label="eliminar  modificador" @click="deleteModificador" />
      </div>

      <div class="q-gutter-sm" v-if="modificador">
        <p>Modificador:</p>
        <q-input
          filled
         v-model="form.modificador.name"
          label="Nombre del modificador"
          placeholder="Ejemplo: Selecciona un tamaño"
          dense
        />
       <br>
      <div v-for="(item,index) in form.modificador.values" :key="index" class="row q-mb-sm q-col-gutter-sm">
        <div class="col">
          <q-input
            filled
            v-model="item.name"
            label="Modificador"
            placeholder="Ejemplo: Chico"
            dense
            @change="modificador=false,modificador=true"
          />
        </div>
        <div class="col">
          <q-input @change="modificador=false,modificador=true" v-model="item.price" filled label="Costo adicional" dense />
        </div>
      </div>
      <div class="text-center q-gutter-sm">
        <q-btn push round color="red-14" size="12px" icon="remove" @click="removeRow" />
        <q-btn push round color="indigo-14" size="12px" @click="addRow" icon="add" />
      </div>

       <q-separator inset />
      </div>
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
        <q-btn-toggle
          v-model="form.status"
          push
          toggle-color="indigo-14"
          :options="[
          {label: 'Disponible', value: 1},
          {label: 'Agotado', value: 0},
        ]"
        />
        <q-btn
          push
          color="indigo-14"
          icon="save"
          class="full-width q-mt-lg"
          type="submit"
          label="guardar"
        />
      </div>
    </form>
  </div>
</template>



<script>
import firebase from "firebase";

export default {
  name: "ProdForm",
  props: {
    cat_id: {
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
      uid: "",
      file_url: "",
      file: null,
      form: {
        name: "",
        price: 0,
        image: "",
        description: "",
        status: 1,
        modificador: {}
      },
      modificador:false
    };
  },
  mounted: function() {
    this.uid=firebase.auth().currentUser.uid
    if (Object.keys(this.item).length !== 0) {
      this.id = this.item.id;
      this.form.name = this.item.name;
      this.form.description = this.item.description;
      this.form.price = this.item.price;
      this.form.status = +this.item.status;
      this.form.modificador = this.item.modificador;
      this.form.image = this.item.image;
      this.file_url = this.item.image;

      if(Object.keys(this.item.modificador).length !== 0){
        this.modificador=true
      }
    }
  },
  methods: {
    submit: async function() {
      let self = this;
      let formData = new FormData();
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
        cat_id: this.cat_id,
        name: this.form.name,
        price: this.form.price,
        description: this.form.description,
        image: this.form.image,
        modificador: this.form.modificador,
        status: this.form.status
      };

      if (Object.keys(this.item).length !== 0) {
        //editar
        db.collection("products_" + this.uid)
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
        db.collection("products_" + this.uid)
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

      //insertar
    },
    addModificador (){
      this.modificador=true
      this.form.modificador={}
      this.form.modificador.values=[]
      this.addRow()
    },
    deleteModificador (){
      this.modificador=false
      this.form.modificador={}
      
    },
    addRow(){
      this.modificador=false
      this.form.modificador.values.push({name: "", price: 0});
      this.modificador=true
    },
    removeRow(){
      this.modificador=false
      this.form.modificador.values.pop();
      this.modificador=true
    },
    uploadFile: async function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        var storageRef = firebase.storage().ref();
        var file = self.file;
        var uploadTask = storageRef
          .child(
            "categories_" +
              self.uid +
              "/" +
              self.cat_id +
              "/" +
              self.form.name +
              file.name
          )
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
