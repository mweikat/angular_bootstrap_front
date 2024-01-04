import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  @ViewChild('passwordInput') passwordInput:ElementRef|any;
  @ViewChild('passwordInput_confirm') passwordInput_confirm:ElementRef|any;
  eyeClass:string = 'bi-eye-fill';
  isShowing:boolean = false;
  showValidationErrors:boolean = false;
  msgErrorS:string = '';
  private recaptchaExecute: Subscription | undefined;

  formRegister = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.maxLength(50)]),
    lastName: new FormControl('',[Validators.required,Validators.maxLength(50)]),
    email: new FormControl('',[Validators.required,Validators.pattern(this.customValidator.emailValidation()),Validators.maxLength(150)]),
    password: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
    passwordConfirm: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
  });

  userModel:UserModel|any = {} as UserModel;

  constructor(private readonly authService:AuthService, 
    private customValidator:CustomvalidationService,
    private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit(): void {
    //show recaptcha
    const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    console.log('element ', element);
    if (element) {
      element.style.visibility = 'visible';
    }
  }

  register(){

    if(this.formRegister.value.passwordConfirm!='' && this.formRegister.value.password!=this.formRegister.value.passwordConfirm){
      this.msgErrorS = "Las contraseñas no coinciden";
      return;
    }else
      this.msgErrorS = "";

    if (this.formRegister.valid) {
      

      this.executeAction("Registro_de_Usuario");      
      
      this.showValidationErrors = false;
    }else
      this.showValidationErrors = true;
  }

  private executeAction(action: string): void {

    if (this.recaptchaExecute) {
      this.recaptchaExecute.unsubscribe();
    }

    this.recaptchaV3Service.execute(action).subscribe((token)=>{

        this.userModel.captcha = token;
        
        this.userModel.name = this.formRegister.value.name;
        this.userModel.last_name = this.formRegister.value.lastName;
        this.userModel.email = this.formRegister.value.email;
        this.userModel.password = this.formRegister.value.password;
        this.userModel.password_confirmation = this.formRegister.value.password;

        this.authService.register(this.userModel).subscribe(receivedItem => {

                      
        },(error) => {

          if(error.error.email!=undefined){
  
          }
            
        });
    },
    (error) => {
      console.log(error);
    })
  }

  showPass(){

    if(this.isShowing){
      this.passwordInput.nativeElement.type='password';
      this.passwordInput_confirm.nativeElement.type='password';
      this.eyeClass='bi-eye-fill';
      this.isShowing=false;
    }else{
      this.passwordInput.nativeElement.type='text';
      this.passwordInput_confirm.nativeElement.type='text';
      this.eyeClass='bi-eye-slash-fill';
      this.isShowing=true;
    }
    
  }

  getErrorMessage(field:string) {

    if (field=='name'&&this.formRegister.get('name')?.hasError('required')) 
      return '*Nombre es requerido';

    if (field=='lastName'&&this.formRegister.get('lastName')?.hasError('required')) 
      return '*Apellido es requerido';
    
    if ((field=='email')&&(this.formRegister.get('email')?.hasError('required')||this.formRegister.get('email')?.hasError('pattern'))) 
      return '*Email no es válido';
    
    if ((field=='password')&&(this.formRegister.get('password')?.hasError('required')||
        this.formRegister.get('password')?.hasError('maxlength')||
        this.formRegister.get('password')?.hasError('minlength')))
      return '*Contraseña entre 6 y 20 caracteres';
    
    if(field=='passwordConfirm'&&(this.formRegister.get('passwordConfirm')?.hasError('required')))
      return 'Repite la contraseña';
    
    if(field=='terms'&&this.formRegister.get('terms')?.hasError('required'))
      return 'Debe aceptar los Términos y Condiciones';

    return '';
  }
  
}
