import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/_models/Usuario';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: Usuario; // ← Criada a classe 'Usuario'dentro dos models - ./ProAgil-App/_models.

  // ↓ Faz a injeção dos serviços no contrutor.
  constructor(private authService: AuthService
            , public router: Router
            , public fb: FormBuilder
            , private toastr: ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.fb.group({
      fullName : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName : ['', Validators.required],
      // Agrupar as informações
      passwords : this.fb.group({
        password : ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword : ['', Validators.required]
      }, { validators : this.compararSenhas }) // ← Chama a função para comparar as senhas e verificar se estão iguais.
    });
  }

  // ↓ Função que verifica a confirmação do password digitada e compara com o campo password.
  compararSenhas(fb: FormGroup) {
    // ↓ Pegar o componente 'confirmPassword' por meio da utilização do ReactForm.
    const confirmSenhaCtrl = fb.get('confirmPassword');

    // ↓ Verifica se tem algum erro de validação.
    if (confirmSenhaCtrl.errors == null || 'mismatch' in confirmSenhaCtrl.errors ) {
      // ↓ Verifica se o valor do 'password' digitado é o mesmo do 'confirmSenhaCtrl'.
      if (fb.get('password').value !== confirmSenhaCtrl.value) {
        confirmSenhaCtrl.setErrors({mismatch: true});
      } else {
        confirmSenhaCtrl.setErrors(null);
      }
    }

  }


  cadastrarUsuario() {
    // ↓ Verificar se o formulário está validado.
    if (this.registerForm.valid) {
      // ↓ Monta o objeto que vai ficar no 'this.user.
      // Faz o Match entre o password e todos os campos do formulario.
      this.user = Object.assign({password: this.registerForm.get('passwords.password').value}, this.registerForm.value);
      // console.log(this.user); // ← Verificar se as informações estão vindo corretamente.
      // ↓ Subscribe serve para executar o comando:
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Usuário Cadastrado!');
        }, error => {
          const erro = error.error;
          erro.array.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Usuário já cadastrado!');
                break;
              default:
                this.toastr.error(`Erro ao cadastrar! CODE: ${element.code}`); // ← Mostra qual o tipo de erro.
                break;
            }
          });
        });
    }

  }

}
