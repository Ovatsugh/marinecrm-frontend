import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudService } from '../../services/crud.service';
import { ToolsService } from '../../services/tools.service';
import { MessageService } from '../../services/message.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban',
  imports: [CommonModule, CardModule, TagModule, SkeletonModule, DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {
  loading = true;
  
  stages = [
    { id: 'prospecção', name: 'Prospecção', sales: [] as any[] },
    { id: 'negociação', name: 'Negociação', sales: [] as any[] },
    { id: 'fechada', name: 'Fechada', sales: [] as any[] }
  ];

  get stageIds(): string[] {
    return this.stages.map(s => 'stage-' + s.id);
  }

  skeletonArray = [1, 2, 3];

  constructor(
    private crudService: CrudService,
    private toolsService: ToolsService,
    private messageService: MessageService
  ) {
    this.crudService.path = 'api/sales';
  }

  ngOnInit() {
    this.loadSales();
  }

  async loadSales() {
    this.loading = true;
    try {
      const response = await this.crudService.getCustom('api/sales', { per_page: 1000 });
      const sales = response.data?.data || response.data || [];
      
      // Limpar as vendas de todos os estágios
      this.stages.forEach(stage => stage.sales = []);
      
      // Distribuir vendas pelos estágios
      sales.forEach((sale: any) => {
        const stage = this.stages.find(s => s.id === sale.stage?.toLowerCase());
        if (stage) {
          stage.sales.push(sale);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      this.loading = false;
    }
  }

  async drop(event: CdkDragDrop<any[]>, newStage: string) {
    if (event.previousContainer === event.container) {
      // Reordenar dentro da mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover para outra coluna
      const sale = event.previousContainer.data[event.previousIndex];
      const oldStage = sale.stage;
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Atualizar o estágio no backend
      try {
        sale.stage = newStage;
        await this.crudService.update(sale, sale.id);
        this.messageService.toastSuccess('Venda movida com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar venda:', error);
        // Reverter a mudança em caso de erro
        sale.stage = oldStage;
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
        this.messageService.toastError('Erro ao mover venda');
      }
    }
  }

  getStageSeverity(stage: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (stage?.toLowerCase()) {
      case 'fechada':
        return 'success';
      case 'negociação':
        return 'info';
      case 'prospecção':
        return 'warning';
      default:
        return 'info';
    }
  }

  getTotalByStage(stage: any): number {
    return stage.sales.reduce((sum: number, sale: any) => sum + (parseFloat(sale.amount) || 0), 0);
  }
}
