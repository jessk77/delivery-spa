import * as firebase from "firebase";
const configOptions = {
  apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseUrl",
    projectId: "projectID",
    storageBucket: "Bucket",
    messagingSenderId: "senderId",
    appId: "appID"
};
firebase.initializeApp(configOptions);
