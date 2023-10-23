import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-check-code-rest-password',
  templateUrl: './check-code-rest-password.component.html',
  styleUrls: ['./check-code-rest-password.component.css']
})
export class CheckCodeRestPasswordComponent {
  userForm!: FormGroup;
  activeCode: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activeCode = false;

    this.userForm = this.fb.group({
        email: [[], [Validators.required]],
        code: [, [Validators.required]],
      },
    );
  }

  sendEmail() {
    console.log(this.userForm.value);
    console.log({email: this.userForm.value.email});

    if (this.userForm.value.email) {
      this.authService.sendEmailPassword({email: this.userForm.value.email}).subscribe({
        next: (data) => {
          console.log(data);
          this.activeCode = true
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }

  checkCode() {
    if (this.userForm.valid) {
      this.authService.verifyCodePassword(this.userForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.navigator('/changePassword');
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }

  navigator(rota: string): void {
    this.router.navigate([rota]);
  }
}
