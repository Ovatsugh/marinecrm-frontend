import { NgForm } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { ToolsService } from '../services/tools.service';

export abstract class AbstractForm {
    loading = false;
    dados: any = {};

    constructor(public service: CrudService, public tools: ToolsService) { }

    abstract submit(form: NgForm): void;
    abstract finish(result: any): void;

    onSubmit(form: NgForm) {
        this.tools.markFormGroupTouched(form.control);

        if (form.status == 'VALID') {
            this.submit(form);
        }
    }

    async getData(id: any) {
        this.loading = true;
        await this.service
            .show(id)
            .then((res) => {
                this.dados = res?.data ?? res;
            })
            .finally(() => (this.loading = false));
    }

    async create(dados: any) {
        console.log('criando')
        this.loading = true;
        await this.service
            .create(dados)
            .then((res) => {
                this.finish(res);
            })
            .finally(() => (this.loading = false));
    }

    async update(dados: any, id: any) {
        this.loading = true;
        await this.service
            .update(dados, id)
            .then((res) => {
                this.finish(res);
            })
            .finally(() => (this.loading = false));
    }
}
