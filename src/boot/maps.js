import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAWC-HW19Mmar8HDqJZsGRSzepOHgXAvkU',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
});