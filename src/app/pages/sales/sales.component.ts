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
import { SalesFormComponent } from './sales-form/sales-form.component';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sales',
  imports: [
    ButtonModule, TableModule, IconField, InputTextModule, InputIcon,
    CommonModule, FormsModule, PaginatorModule, ConfirmDialogModule,
    SalesFormComponent, TagModule
  ],
  providers: [ConfirmationService],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent extends AbstractList {
  term: string = '';
  displayDialog: boolean = false;
  sale: any = {};
  isEditing: boolean = false;
  customers: any[] = [];
  products: any[] = [];

  constructor(
    private crudService: CrudService,
    private toolsService: ToolsService,
    private confirmationService: ConfirmationService
  ) {
    super(crudService, toolsService);
    this.service.path = 'api/sales';
  }

  ngOnInit() {
    this.getList();
    this.loadCustomersData();
    this.loadProductsData();
  }

  async loadCustomersData() {
    try {
      const response = await this.service.getCustom('api/customers', { per_page: 1000 });
      this.customers = response.data?.data || response.data || [];
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  async loadProductsData() {
    try {
      const response = await this.service.getCustom('api/products', { per_page: 1000 });
      this.products = response.data?.data || response.data || [];
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  search() {
    this.filters.term = this.term;
    this.getList();
  }

  openNew() {
    this.sale = {};
    this.isEditing = false;
    this.displayDialog = true;
  }

  editSale(sale: any) {
    this.sale = { ...sale };
    this.isEditing = true;
    this.displayDialog = true;
  }

  async saveSale() {
    this.loading = true;
    try {
      if (this.isEditing) {
        await this.service.update(this.sale, this.sale.id);
      } else {
        await this.service.create(this.sale);
      }
      await this.getList();
      this.displayDialog = false;
      this.sale = {};
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(sale: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir esta venda?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.removeItem(sale.id);
      },
    });
  }

  getStageSeverity(stage: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (stage?.toLowerCase()) {
      case 'fechada':
        return 'success';
      case 'negociação':
        return 'info';
      case 'prospecção':
        return 'warning';
      case 'perdida':
        return 'danger';
      default:
        return 'info';
    }
  }
}
