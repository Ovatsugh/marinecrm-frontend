import { CrudService } from '../services/crud.service';
import { ToolsService } from '../services/tools.service';

export abstract class AbstractList {
  loading = false;
  dataSource: any = { data: [] };
  filters: any = {
    per_page: 20,
    page: 1,
    sort_column: 'created_at',
    sort_order: 'desc',
  };

  scrollHeight = 'calc((100vh - 9rem) * 0.70)';

  userCurrent: any = {};

  constructor(public service: CrudService, public tools: ToolsService) { }

  async getList() {
    const keys = Object.keys(this.filters);
    keys.forEach((key) => {
      if (this.filters[key] == null || this.filters[key] == '') {
        delete this.filters[key];
      }
    });

    this.loading = true;
    await this.service
      .listing(this.filters)
      .then((res: any) => {
        this.dataSource = res;
        console.log(this.dataSource)
      })
      .finally(() => (this.loading = false));
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.per_page = event.rows;
    this.getList()
  }

  onSort(event: any) {
    console.log('onSort', event);
  }

  async removeItem(id: any) {
    this.loading = true;
    await this.service
      .delete(id)
      .then(async (res: any) => {
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }

  loadProducts(event: any) {
		console.log('loadProducts', event);
		this.filters.sort_column = event.sortField;
		this.filters.sort_direction = event.sortOrder == 1 ? 'asc' : 'desc';

		this.getList();
	}

}
