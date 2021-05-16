import firebase from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
export const app = firebase.initializeApp({
    apiKey: 'AIzaSyCfUgLy7_SmD78BLzr7ohztt7o9tZyj6IM',
    authDomain: 'where-s-waldo-7ace2.firebaseapp.com',
    projectId: 'where-s-waldo-7ace2',
    storageBucket: 'where-s-waldo-7ace2.appspot.com',
    messagingSenderId: '225583877908',
    appId: '1:225583877908:web:4f36fc2d5a8567e7473c01',
    measurementId: 'G-RW1YB0F875',
});
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
