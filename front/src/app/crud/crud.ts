import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiPessoas } from '../servico/api-pessoas';
import { Pessoa } from '../modelo/Pessoa';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crud.html',
  styleUrl: './crud.css',
})
export class Crud {
  // Visibilidade dos botões
  btnCadastrar: boolean = true;

  // Colunas da tabela
  colunas: String[] = ['id', 'nome', 'cidade', 'selecionar'];

  // Vetor para armazenar as pessoas
  vetor: Pessoa[] = [];

  // Objeto - Formulário Reativo
  formularioPessoa = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    cidade: new FormControl(),
  });

  // Constructor
  constructor(private servico: ApiPessoas) {}

  // ngOnInit - Executa este método após o componente ser montado
  ngOnInit(): void {
    this.listar();
  }

  // Método para selecionar todas as pessoas da API
  listar(): void {
    this.servico.listar().subscribe((pessoas) => (this.vetor = pessoas));
  }

  // Método para cadastrar pessoas
  cadastrar(): void {
    // Criar um novo objeto
    let obj = { ...this.formularioPessoa.value }; // Copia todas as características do nosso formulário
    delete obj.id; // Remove o id, para que a nossa API receba um objeto contendo apenas o nome e a cidade

    // Realizar a requisição de cadastro (POST) e atualizar o vetor
    this.servico.cadastrar(obj).subscribe((pessoa) => (this.vetor = [...this.vetor, pessoa]));

    // Limpar o formulário
    this.formularioPessoa.reset();
  }

  // Método para selecionar uma pessoa específica
  selecionarPessoa(id: string): void {
    this.servico.selecionarPessoa(id).subscribe((pessoa) => {
      // Disponibiliza um objeto com as características: id, nome e cidade para o nosso formulário reativo
      this.formularioPessoa.patchValue(pessoa);

      // Visibilidade dos botões
      this.btnCadastrar = false;
    });
  }

  // Método para cancelar as ações de alteração e remoção
  cancelar(): void {
    this.formularioPessoa.reset();
    this.btnCadastrar = true;
  }

  alterar(): void {
    this.servico.alterar(this.formularioPessoa.value).subscribe((pessoa) => {
      // Obter o índice da pessoa alterada no vetor
      const indicePessoaAlterada = this.vetor.findIndex((obj) => obj.id === pessoa.id);

      // Atualizar valor do vetor
      this.vetor[indicePessoaAlterada] = pessoa;

      // Forçar a atualização do vetor (para exibir corretamente na tabela)
      this.vetor = [...this.vetor];

      // Limpar o formulário
      this.cancelar();
    });
  }

  // Método para remover pessoas
  remover(): void {
    this.servico.remover(this.formularioPessoa.value.id).subscribe((pessoa) => {
      // Obter o índice da pessoa removida no vetor
      const indicePessoaRemovida = this.vetor.findIndex((obj) => obj.id === pessoa.id);

      // Efetuar a remoção no vetor
      this.vetor.splice(indicePessoaRemovida, 1);

      // Forçar a atualização do vetor (para exibir corretamente na tabela)
      this.vetor = [...this.vetor];

      // Visibilidade dos botões e limpeza dos campos
      this.cancelar();
    });
  }
}
