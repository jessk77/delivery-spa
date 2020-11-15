const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const db = admin.firestore()
const msg = admin.messaging()


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.sendNotification = functions.https.onRequest((request, response) => {
      cors(request, response, () => {
            //console.log(request.body)

            var uid = request.body.client
            var ruid = request.body.ruid
            var type = request.body.type

            const payload = getPayload(type)

            db.collection("users_" + ruid)
                  .doc(uid)
                  .get()
                  .then(function (doc) {
                        if (doc.exists) {
                              var token = doc.data().token;
                              console.log(token)
                              msg.sendToDevice(token, payload)
                        } else {
                              // doc.data() will be undefined in this case
                              console.log("No such document! " + uid);
                        }
                  });

            response.send("ok");
      });
});


function getPayload(type) {

      var title = "";
      var body = "";

      switch (type) {
            case "aceptada":
                  title = 'Tu pedido ha sido aceptado';
                  body = "Ya se encuentran preparando tu pedido";
                  break;
            case "enviada":
                  title = 'Tu pedido ha sido enviado';
                  body = "El repartidor ya se encuentra en camino";
                  break;

            case "cancelada":
                  title = 'Tu pedido ha sido cancelado';
                  body = "Lo sentimos tu pedido no será procesado";
                  break;
            default:
                  title = 'Notificación de pedido';
                  body = "Revisa tu pedido";
                  break;
      }

      return {
            notification: {
                  title: title,
                  body: body,
                  sound: 'default',
                  icon: 'fcm_push_icon'//"fcm_push_icon"
            }
            // data: {
            //       test: "Mario",
            // }
      };
}

exports.sendFullNotification = functions.https.onRequest((request, response) => {
      cors(request, response, () => {
            //console.log(request.body)

            var ruid = request.body.ruid
            var title = request.body.title
            var body = request.body.body

            const payload = {
                  notification: {
                        title: title,
                        body: body,
                        sound: 'default',
                        icon: 'fcm_push_icon'//"fcm_push_icon"
                  }
            }

            db.collection("users_" + ruid)
            .get()
            .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                        var token = doc.data().token;
                        msg.sendToDevice(token, payload)
                  });
            });

            response.send("ok");
      });
});

exports.refundPayment = functions.https.onRequest((request, response) => {
      cors(request, response, () => {

            var mode=""
            var client_id=""
            var client_secret=""

            db.collection("users")
            .doc(request.body.uid)
            .get()
            .then(function(doc) {
                  if (doc.exists) {
                    mode = doc.data().paypal_env;
                    client_id = doc.data().paypal_client_id;
                    client_secret = doc.data().paypal_client_secret;
                  } 
                });

            var paypal = require('paypal-rest-sdk');
            paypal.configure({
                  'mode': mode, //sandbox or live
                  'client_id': client_id,
                  'client_secret': client_secret
            });

            var data = {
                  "amount": {
                        "currency": "MXN",
                        "total": request.body.total
                  }
            }
            saleId = request.body.saleId;
            paypal.sale.refund(saleId, data, function (error, refund) {
                  if (error) {
                        console.log(error);
                        response.send("error");
                  } else {
                        console.log("Refund Sale Response");
                        console.log(JSON.stringify(refund));
                        response.send("ok");
                  }

            });
      });
});


exports.createUser = functions.https.onRequest((request, response) => {

      admin.auth().createUser({
            email: "contacto@atomikod.com",
            password: "admin123.",
            displayName: "Atomikod Delivery",
            disabled: false
      })
            .then(async function (userRecord) {
                  // See the UserRecord reference doc for the contents of userRecord.
                  console.log("Successfully created new user:", userRecord);
                  const customClaims = {
                        admin: true,
                  }
                  try {
                        var _ = await admin.auth().setCustomUserClaims(userRecord.uid, customClaims)

                        var dbi = db.collection("users").doc(userRecord.uid).set({
                              name: userRecord.displayName,
                              email: userRecord.email,
                              role: customClaims
                        })

                        console.log("insert on db", dbi)

                  } catch (error) {
                        response.send("Error claims ");
                  }

                  response.send("Successfully created new user ");

            })
            .catch(function (error) {
                  console.log("Error creating new user:", error);
                  response.send("Error creating new user: " + error.message);
            });
      //firebase deploy --only functions functions:createUser,functions:sendNotification, functions:sendFullNotification

});
