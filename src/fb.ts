import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCiqN24BWP6bmtGq57kalgCgZ0so-atvuw",
    authDomain: "btdt-9bdce.firebaseapp.com",
    databaseURL: "https://btdt-9bdce.firebaseio.com",
    projectId: "btdt-9bdce",
    storageBucket: "btdt-9bdce.appspot.com",
    messagingSenderId: "924366111723",
    appId: "1:924366111723:web:9587023724afc212"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();