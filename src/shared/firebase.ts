import * as admin from 'firebase-admin';

const serviceAccount = require('../../next-shop.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'next-shop-59dce.appspot.com',
});

// Cloud storage
export const Storage = admin.storage();
