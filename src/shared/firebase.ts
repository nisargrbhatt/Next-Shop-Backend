import * as admin from 'firebase-admin';

// const serviceAccount = require('../../next-shop.json');
/* eslint-disable */
const serviceAccount = require('../../configs/next-shop');
/* eslint-enable */

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.serviceAccount),
  storageBucket: 'next-shop-59dce.appspot.com',
});

// Cloud storage
export const Storage = admin.storage();
