(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"0875":function(t,e,i){"use strict";var a=i("ef34"),n=i.n(a);n.a},"73d0":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-page",[i("q-breadcrumbs",{staticClass:"q-mb-md"},[i("q-breadcrumbs-el",{attrs:{to:"/dashboard",label:"Inicio"}}),i("q-breadcrumbs-el",{attrs:{label:"Categorías"}})],1),i("p",{staticClass:"text-h6"},[t._v("Categorías")]),i("div",{staticClass:"text-right q-ma-lg"},[i("q-btn",{attrs:{push:"",color:"indigo-13",icon:"add",label:"agregar nuevo"},on:{click:function(e){t.dialog=!0}}})],1),i("div",{staticClass:"row q-col-gutter-md"},t._l(t.categorias,(function(e,a){return i("div",{key:a,staticClass:"col-lg-3 col-md-4 col-sm-12 col-xs-12 text-center"},[i("q-card",{staticClass:"my-card card-menu"},[i("q-img",{staticStyle:{height:"200px"},attrs:{src:t._f("render")(e.image)},on:{click:function(i){return t.$router.push({path:"/products/"+e.id,query:{name:e.name}})}}},[i("div",{staticClass:"absolute-bottom text-h6"},[t._v(t._s(t._f("cap")(e.name)))])]),i("q-separator"),i("q-card-actions",[i("q-btn",{attrs:{flat:"",color:"indigo-14",icon:"edit"},on:{click:function(e){return t.editDialog(a)}}}),i("q-btn",{attrs:{flat:"",color:"red",icon:"delete"},on:{click:function(e){return t.deleteDialog(a)}}})],1)],1)],1)})),0),i("q-dialog",{model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[i("q-card",{staticStyle:{width:"500px","max-width":"80vw"}},[i("q-card-section",[i("div",{staticClass:"text-h6"},[t._v("Agregar Categoría")])]),i("q-separator"),i("q-card-section",[i("CatForm",{attrs:{uid:t.uid,item:{}},on:{submited:t.submited}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"cerrar",color:"grey"}})],1)],1)],1),i("q-dialog",{model:{value:t.edit,callback:function(e){t.edit=e},expression:"edit"}},[i("q-card",{staticStyle:{width:"500px","max-width":"80vw"}},[i("q-card-section",[i("div",{staticClass:"text-h6"},[t._v("Editar Categoría")])]),i("q-separator"),i("q-card-section",[i("CatForm",{attrs:{uid:t.uid,item:t.actionItem},on:{submited:t.edited}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"cerrar",color:"grey"}})],1)],1)],1),i("q-dialog",{attrs:{persistent:""},model:{value:t.confirm,callback:function(e){t.confirm=e},expression:"confirm"}},[i("q-card",[i("q-card-section",{staticClass:"row items-center"},[i("q-avatar",{attrs:{icon:"delete",color:"red","text-color":"white"}}),i("span",{staticClass:"q-ml-sm"},[t._v("¿Deseas eliminar este elemento?.")])],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Cancelar",color:"indigo-14"}}),i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Eliminar",color:"indigo-14"},on:{click:t.deleteItem}})],1)],1)],1)],1)},n=[],o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("form",{staticClass:"q-gutter-md",attrs:{action:"#"},on:{submit:function(e){return e.preventDefault(),t.submit(e)}}},[i("q-input",{attrs:{filled:"",label:"Nombre de categoria",required:"",dense:"",rules:[function(t){return t&&t.length>3||"Ingrese un valor válido"}]},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}}),i("div",{staticClass:"text-center",attrs:{id:"preview"}},[t.file_url?i("img",{staticStyle:{"max-height":"300px"},attrs:{src:t.file_url}}):t._e()]),i("div",{staticClass:"text-center"},[""!=t.file_url?i("q-btn",{attrs:{outline:"",icon:"close",color:"indigo-14",size:"sm",label:"Eliminar imagen"},on:{click:t.detachImage}}):t._e()],1),i("q-input",{attrs:{filled:"",dense:"",type:"file",hint:"Agregar imagen"},on:{change:t.onFileChange},model:{value:t.file,callback:function(e){t.file=e},expression:"file"}}),i("div",{staticClass:"text-center q-mt-md"},[i("q-btn",{staticClass:"full-width",attrs:{color:"indigo-14",icon:"save",type:"submit",label:"guardar"}})],1)],1)])},r=[],s=(i("551c"),i("967e")),c=i.n(s),l=(i("96cf"),i("fa84")),d=i.n(l),u=(i("7f7f"),i("ac6a"),i("cadf"),i("06db"),i("456d"),i("8aa5")),m=i.n(u),g={name:"CatForm",props:{uid:{type:String,required:!0},item:{type:Object,default:{}}},data:function(){return{id:0,file_url:"",file:null,form:{name:"",image:""}}},mounted:function(){0!==Object.keys(this.item).length&&(this.id=this.item.id,console.log(this.id),this.form.name=this.item.name,this.form.image=this.item.image,this.file_url=this.item.image)},methods:{submit:function(){var t=d()(c.a.mark((function t(){var e,i,a,n;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e=this,this.$q.loading.show({message:"Guardando ..."}),null===this.file){t.next=6;break}return t.next=5,this.uploadFile();case 5:this.form.image=t.sent;case 6:0!==Object.keys(this.item).length&&""!==this.item.image&&this.item.image!==this.form.image&&(i=m.a.storage().refFromURL(this.item.image),i.delete()),a=m.a.firestore(),n={uid:this.uid,name:this.form.name,image:this.form.image},0!==Object.keys(this.item).length?a.collection("categories_"+this.uid).doc(this.id).update(n).then((function(){n.id=e.id,e.$q.loading.hide(),e.$emit("submited",n)})).catch((function(t){console.error("Error updating document: ",t)})):a.collection("categories_"+this.uid).add(n).then((function(t){n.id=t.id,e.$q.loading.hide(),e.$emit("submited",n)})).catch((function(t){console.error("Error adding document: ",t)}));case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),uploadFile:function(){var t=d()(c.a.mark((function t(){var e;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this,t.abrupt("return",new Promise((function(t,i){var a=m.a.storage().ref(),n=e.file,o=a.child("categories_"+e.uid+"/"+e.form.name+n.name).put(n);o.on(m.a.storage.TaskEvent.STATE_CHANGED,(function(t){var e=t.bytesTransferred/t.totalBytes*100;console.log("Upload is "+e+"% done")}),(function(t){console.log(t),i()}),(function(){o.snapshot.ref.getDownloadURL().then((function(e){t(e)}))}))})));case 2:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),onFileChange:function(t){var e=t.target.files[0];e.size>4194304?this.$q.notify({color:"warning",message:"La imagen es muy grande",icon:"warning",position:"center"}):"image/jpeg"!=e.type&&"image/png"!=e.type?this.$q.notify({color:"warning",message:"La imagen no tiene un formato valido",icon:"warning",position:"center"}):(this.file=t.target.files[0],this.file_url=URL.createObjectURL(e))},detachImage:function(){this.file=null,this.file_url="",this.form.image=""}}},f=g,h=i("2877"),p=i("eebe"),b=i.n(p),v=i("27f9"),q=i("9c40"),x=Object(h["a"])(f,o,r,!1,null,null,null),w=x.exports;b()(x,"components",{QInput:v["a"],QBtn:q["a"]});var C={name:"PageIndex",components:{CatForm:w},data:function(){return{uid:"",dialog:!1,edit:!1,confirm:!1,actionIndex:0,actionItem:{},buscar:"",categorias:[]}},mounted:function(){this.uid=m.a.auth().currentUser.uid;var t=this,e=m.a.firestore();e.collection("categories_"+this.uid).get().then((function(e){e.forEach((function(e){var i=e.data();i.id=e.id,t.categorias.push(i)}))}))},methods:{submited:function(t){this.categorias.push(t),console.log(this.categorias),this.dialog=!1,this.$q.notify({message:"Se ha agregado la categoría",color:"green"})},editDialog:function(t){this.edit=!0,this.actionIndex=t,this.actionItem=this.categorias[this.actionIndex],console.log(this.actionItem)},edited:function(t){this.categorias[this.actionIndex]=t,console.log(this.categorias[this.actionIndex]),this.edit=!1,this.$q.notify({message:"Se ha editado la categoría",color:"green"})},deleteDialog:function(t){this.confirm=!0,this.actionIndex=t,console.log(this.actionIndex)},deleteItem:function(){var t=this,e=this.categorias[this.actionIndex],i=m.a.firestore();i.collection("categories_"+this.uid).doc(e.id).delete().then((function(){if(""!==e.image){var i=m.a.storage().refFromURL(e.image);i.delete()}t.categorias.splice(t.actionIndex,1)})).catch((function(t){console.error("Error removing document: ",t)}))}},filters:{cap:function(t){return t.toUpperCase()},render:function(t){return""!=t?t:"https://firebasestorage.googleapis.com/v0/b/api-project-363815265684.appspot.com/o/plate.jpg?alt=media&token=a977c0d8-f9f0-4bdf-8061-abe110f28e58"}}},_=C,y=(i("0875"),i("9989")),I=i("ead5"),k=i("079e"),Q=i("65c6"),E=i("6ac5"),$=i("0016"),j=i("f09f"),F=i("068f"),S=i("eb85"),D=i("4b7e"),U=i("24e8"),L=i("a370"),O=i("cb32"),T=i("7f67"),A=Object(h["a"])(_,a,n,!1,null,null,null);e["default"]=A.exports;b()(A,"components",{QPage:y["a"],QBreadcrumbs:I["a"],QBreadcrumbsEl:k["a"],QToolbar:Q["a"],QToolbarTitle:E["a"],QInput:v["a"],QIcon:$["a"],QBtn:q["a"],QCard:j["a"],QImg:F["a"],QSeparator:S["a"],QCardActions:D["a"],QDialog:U["a"],QCardSection:L["a"],QAvatar:O["a"]}),b()(A,"directives",{ClosePopup:T["a"]})},ef34:function(t,e,i){}}]);