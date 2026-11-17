import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDnC8-PG0RBpDgiv3e3L-bcdpCDXXjpBTI',
  authDomain: 'time-since-mouse-taken.firebaseapp.com',
  databaseURL: 'https://time-since-mouse-taken-default-rtdb.firebaseio.com',
  projectId: 'time-since-mouse-taken',
  storageBucket: 'time-since-mouse-taken.firebasestorage.app',
  messagingSenderId: '714648988262',
  appId: '1:714648988262:web:b2940d11e918f1caba5ba7',
}

export const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
