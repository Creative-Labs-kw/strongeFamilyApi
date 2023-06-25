import * as admin from "firebase-admin";
// $ from "console.firebase >> serviceaccounts>>adminsdk"
const serviceAccount = require("./firebase.json"); // Provide the path to your service account credentials JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Other Firebase configuration options if required
});
export default admin;
