import { Component } from '@angular/core';
import { AbstractList } from '../../shared/abstract-list';
import { CrudService } from '../../services/crud.service';
import { ToolsService } from '../../services/tools.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ClientsFormComponent } from './clients-form/clients-form.component';

@Component({
  selector: 'app-clients',
  imports: [
    ButtonModule, TableModule, IconField, InputTextModule, InputIcon,
    CommonModule, FormsModule, PaginatorModule, ConfirmDialogModule,
    ClientsFormComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent extends AbstractList {
  term: string = '';
  displayDialog: boolean = false;
  client: any = {};
  isEditing: boolean = false;

  constructor(
    private crudService: CrudService,
    private toolsService: ToolsService,
    private confirmationService: ConfirmationService
  ) {
    super(crudService, toolsService);
    this.service.path = 'api/customers';
  }

  ngOnInit() {
    this.getList();
  }

  search() {
    this.filters.term = this.term;
    this.getList();
  }

  openNew() {
    this.client = {};
    this.isEditing = false;
    this.displayDialog = true;
  }

  editClient(client: any) {
    this.client = { ...client };
    this.isEditing = true;
    this.displayDialog = true;
  }

  async saveClient() {
    this.loading = true;
    try {
      if (this.isEditing) {
        await this.service.update(this.client.id, this.client);
      } else {
        await this.service.create(this.client);
      }
      await this.getList();
      this.displayDialog = false;
      this.client = {};
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(client: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o cliente <strong>${client.company_name}?</strong>`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.removeItem(client.id);
      },
    });
  }
}
