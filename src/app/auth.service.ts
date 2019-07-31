import { Injectable } from '@angular/core';
import * as firebase from '../fb';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public getUserInfo() : Promise<any>
  {
    let userObs = new Promise(resolve => {
      firebase.default.auth().onAuthStateChanged(authData => {
        if(!authData)
          resolve({});
        else
        {
          let db = firebase.default.firestore().collection('users');
          db.where('email', '==', authData.email).get().then(_user => {
            _user.docs.forEach(u => {
              resolve(u.data());
            });
          });
        }
      })
    });

    return userObs;
  }
}