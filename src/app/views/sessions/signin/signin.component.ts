import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService as AuthGuard } from '../../../shared/services/auth/auth.service';
import { Credentials } from '../../../shared/services/user/credentials.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  signinForm: FormGroup;
  erro:  string = '';
  constructor(private router:Router,private authGuard:AuthGuard) { }

  ngOnInit() {
    localStorage.clear();
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    })
  }

  signin() {
    this.submitButton.disabled  = true;
    this.progressBar.mode       = 'indeterminate';
    const { email, senha }      = this.signinForm.value;
    const credentials: Credentials = {
      email,
      senha
    };
	  this.authGuard.login(credentials)
		.subscribe(
			result  =>  { 
            this.authGuard.setUser(
              result.token,
              result.userInfo,
              result.expiresAt,
              result.modulos,
              result.programas,
              result.funcoes,
              result.foto
            );
            this.submitButton.disabled  = false; 
            this.router.navigate(['/adesoesc']) ;
					  },
			error =>  { 
						this.erro  				          = 'e-mail ou senha inválida';
						this.submitButton.disabled  = false; 
						this.progressBar.mode       = 'determinate';
					  }    
		 );
  }
  
}
