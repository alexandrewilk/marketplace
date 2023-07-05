/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require('firebase-functions')
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp();
const db = admin.firestore()
const apiKey = functions.config().sendgrid.key
const tempKey = functions.config().temp.key
sgMail.setApiKey(apiKey)







exports.welcomeEmail = functions.auth.user().onCreate((user) => {
    const msg = {
        to: user.email,
        from: 'testeurtesteur54@gmail.com',
        template_id: tempKey,
        dynamic_template_data: {
            name: user.email,
            text: 'bienvenu ma g'
        }
    }
    return sgMail.send(msg)
})

exports.updateUserProfileOnNewChat = functions.firestore.document("Chats/{chatID}").onCreate((snapshot, context)=>{
    const chatters = snapshot.data().chatters
    const batch = db.batch()
    for (const uuid of chatters){
        batch.update(db.doc('Users/'+uuid), {chatsWith : FieldValue.arrayUnion(snapshot.id)})
    }
    return batch.commit()
})

// exports.weeklySummary = functions.pubsub.schedule('').onRun(async context => {
//     const userSnapshots = await admin.firestore().collection('Users').get();
//     const qualifiedUser = userSnapshots.filter(u=> u.alertes)
//     const annonces = await admin.firestore.collection('Listings').orderBy('timestamp').limit(1000).get()
//     const emails = userSnapshots.docs.map(snap => snap.data().email);
//     const msg = {
//         from : 'testeurtsteur54@gmail.com',
//         personalizations : [

//         ]
//     }
// })


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
