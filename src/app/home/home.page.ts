import { Component,  ViewChild, ElementRef, OnInit } from '@angular/core';
import {Power1, Bounce} from 'gsap/all';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from '../../fb';
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

  timeline: any = new TimelineMax({onReverseComplete: (any) => {
    this.router.navigateByUrl('/home');
  }}); 

  isReversed: boolean = false;;
  public user: any = {};

  constructor(public authService: AuthService, public router: Router) {
  
  }

  ngOnInit()
  {
    this.authService.getUserInfo().then(userData => {
      if(userData.email)
      {
        this.router.navigateByUrl('/profile');
      }
      else
      {
        this.timeline.fromTo(this.hidden.nativeElement, 0.5, {y: 100, display: 'block'}, {y: 0}, '-=0.3').
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

  join()
  {
    if(this.user.email && this.user.first_name && this.user.last_name && this.user.password && this.user.confirm_password)
    {
      if(this.user.password == this.user.confirm_password)
      {
        let db = firebase.default.firestore();
        let users = db.collection('users');
        firebase.default.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then(()=>{
          let newUser = {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            password: this.user.password,
            createdAt: Date.now(),
            rank: 'm'
          };

          users.doc(this.user.email).set(newUser).then(()=> {
            firebase.default.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
              this.router.navigateByUrl('/login');
            });
          }).catch(() => { });
        }).catch(()=>{
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
