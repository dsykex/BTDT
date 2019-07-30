import { Injectable } from '@angular/core';
import * as firebase from '../fb';
import { Observable } from 'rxjs';

export interface tvarr {
  user: string;
}

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
          db.doc(authData.email).get().then(user => { 
            if(user.exists)
              resolve(user.data());
          })
        }
      })
    });

    return userObs;
  }
}