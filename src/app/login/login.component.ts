import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ERR_CODE} from 'error.codes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: Observable<firebase.User>

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    public alertCtrl: AlertController) {
    this.user = afAuth.authState
   }

  ngOnInit() {
  }

  public async socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = new firebase.auth.FacebookAuthProvider();
    }else 
    if (socialPlatform == "google") {
      socialPlatformProvider = new firebase.auth.GoogleAuthProvider();
    }
    //  else if (socialPlatform == "linkedin") {
    //   socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    // }
    try{

      await firebase.auth().signInWithPopup(socialPlatformProvider)
    }catch(err){
      if (err.code === ERR_CODE.ACCOUNT_ALREADY_EXISTS){
        this.doAlert()
      }
      console.log(err);
    }
  }

  async doAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Account with this email already exists',
      buttons: ['Ok']
    });

   await alert.present();
  }

  signOut(){
    this.afAuth.auth.signOut()
  }
}
