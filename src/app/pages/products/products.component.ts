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
import { ProductFormComponent } from './product-form/product-form.component';

@Component({
  selector: 'app-products',
  imports: [
    ButtonModule, TableModule, IconField, InputTextModule, InputIcon,
    CommonModule, FormsModule, PaginatorModule, ConfirmDialogModule,
    ProductFormComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent extends AbstractList {
  term: string = '';
  displayDialog: boolean = false;
  product: any = {};
  isEditing: boolean = false;

  constructor(
    private crudService: CrudService,
    private toolsService: ToolsService,
    private confirmationService: ConfirmationService
  ) {
    super(crudService, toolsService);
    this.service.path = 'api/products';
  }

  ngOnInit() {
    this.getList();
  }

  search() {
    this.filters.term = this.term;
    this.getList();
  }

  openNew() {
    this.product = {};
    this.isEditing = false;
    this.displayDialog = true;
  }

  editProduct(product: any) {
    this.product = { ...product };
    this.isEditing = true;
    this.displayDialog = true;
  }

  async saveProduct() {
    this.loading = true;
    try {
      if (this.isEditing) {
        await this.service.update(this.product.id, this.product);
      } else {
        await this.service.create(this.product);
      }
      await this.getList();
      this.displayDialog = false;
      this.product = {};
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(product: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o produto <strong>${product.name}?</strong>`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.removeItem(product.id);
      },
    });
  }
}
