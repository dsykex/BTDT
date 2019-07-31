import { Component,  ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Power1, Bounce} from 'gsap/all';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from '../../fb';
import { sign } from 'crypto';
declare var TimelineMax: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  public post: any = {};
  @ViewChild('section') section: ElementRef;
  @ViewChild('logo') logo: ElementRef;
  @ViewChild('userarea') userarea: ElementRef;
  @ViewChild('bg') bg: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('loginBtn') loginBtn: ElementRef;
  @ViewChild('hidden') hidden: ElementRef;

  errorMsg: any;

  timeline: any;

  isReversed: boolean = false;;
  public user: any = {};

  constructor(public authService: AuthService, public ngZone: NgZone, public alertCtrl: AlertController, public router: Router) {
    this.timeline = new TimelineMax({onReverseComplete: (any) => {
      this.ngZone.run(()=> { this.router.navigateByUrl('profile'); })
    }, onComplete: (any) => {
      console.log('anim done..');
    } });
  }

  ngOnInit()
  {
    this.authService.getUserInfo().then(userData => {
      console.log(userData);
      if(userData.email)
      {
        console.log('found');
        this.router.navigateByUrl('profile');
      }
      else
      {
          this.timeline.fromTo(this.hidden.nativeElement, 0.2, {y: 100, display: 'block'}, {y: 0}, '-=0.1').
          fromTo(this.logo.nativeElement, 2, {y: '-100vh'}, {y: '0%', ease: Bounce.easeInOut}).
          fromTo(this.userarea.nativeElement, 0.4, {opacity: 0, display: 'block'}, {opacity:1, ease: Power1.easeInOut}).
          fromTo(this.loginBtn.nativeElement, 0.5, {y: "100vh"}, {y: '0%', ease: Power1.easeInOut}).
          fromTo(this.bg.nativeElement, 0.5, {opacity: 0}, {opacity: 1, ease: Power1.easeInOut}, '-=0.5')
      }
    })
  }

  login()
  {
    firebase.default.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
      this.timeline.reverse();
    }).catch(()=> {
      this.errorMsg = 'An error occured. Please check your login credentials and network and try again.';
      setTimeout(() => {
        this.errorMsg = '';
      },3000);
    });
  }

  async signupPanel()
  {
      const alert = await this.alertCtrl.create({
        header: 'Welcome!',
        inputs: [
          {
            name: 'first_name',
            type: 'text',
            placeholder: 'First Name'
          },
          {
            name: 'last_name',
            type: 'text',
            placeholder: 'Last Name'
          },
          {
            name: 'display_name',
            type: 'text',
            placeholder: 'Display Name'
          },
          {
            name: 'email',
            type: 'email',
            placeholder: 'Email'
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Password'
          },
          {
            name: 'confirm_password',
            type: 'password',
            placeholder: 'Confirm Password'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              
            }
          }, {
            text: 'Create Account',
            handler: (data) => {
              console.log(data);
              if(data.email && data.first_name && data.last_name && data.display_name && data.password && data.confirm_password)
              {
                if(data.password == data.password)
                {
                  let db = firebase.default.firestore();
                  let users = db.collection('users');
                  firebase.default.auth().createUserWithEmailAndPassword(data.email, data.password).then(()=>{
                    console.log('created!');
                    let newUser = {
                      first_name: data.first_name,
                      last_name: data.last_name,
                      display_name: data.display_name,
                      email: data.email,
                      password: data.password,
                      createdAt: Date.now(),
                      rank: 'm'
                    };

                    // Successful Account Creation and Login
                    users.add(newUser).then(()=> {
                      firebase.default.auth().signInWithEmailAndPassword(data.email, data.password).then(() => {
                        this.timeline.reverse();
                      });
                    }).catch(() => { });
                  }).catch(()=> {
                    this.errorMsg = 'An error occured processing your request. Either an an account exists under that email, a network related problem, or something internal. Please try again.';
                    setTimeout(() => {
                      this.errorMsg = '';
                    },3000);
                  })
                }
                else
                {
                  this.errorMsg = 'Passwords must match.';
                  setTimeout(() => {
                    this.errorMsg = '';
                  },3000);
                }
              }
              else
              {
                this.errorMsg = 'All fields are required.';
                setTimeout(() => {
                  this.errorMsg = '';
                },3000);
              }
            }
          }
        ]
      });
  
      await alert.present();
  }
}
