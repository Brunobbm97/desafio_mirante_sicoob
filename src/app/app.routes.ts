import { Routes } from '@angular/router';
import { ConsultaLotesComponent } from './features/lotes/pages/consulta-lotes/consulta-lotes';

export const routes: Routes = [
    { path: '', redirectTo: 'consulta', pathMatch: 'full' },
    { path: 'consulta', component: ConsultaLotesComponent }
];