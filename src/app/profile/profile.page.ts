import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from '../../fb';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';

declare var TimelineMax: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user: any = {};
  constructor(public cameraPreview: CameraPreview, public authService: AuthService, public zone: NgZone, public router: Router, public alertCtrl: AlertController) { }

  ngOnInit() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: false,
      previewDrag: true,
      toBack: true,
      alpha: 1,
      
    }
    
    // start camera
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
    
    this.authService.getUserInfo().then(userData => {
      if(userData.email)
      {
        this.user = userData;
      }
      else 
      {
        this.zone.run(() => { this.router.navigateByUrl('home') } );
      }
    })
    
  }

  async logoutConfirm() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'dark',
          handler: (blah) => {
           
          }
        }, {
          text: 'Yep',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });

    await alert.present();
  }

  logOut()
  {
    firebase.default.auth().signOut().then(() => { this.zone.run(() => { this.router.navigateByUrl('home') }) });
  }
}
