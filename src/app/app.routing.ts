import { Routes } from '@angular/router';
import { SiteLayoutComponent } from './shared/components/layouts/site-layout/site-layout.component';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuardService as AuthGuard } from './shared/services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './shared/services/auth/role-guard.service';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'adesoesc',
    pathMatch: 'full'
  },
  {
    path: 'redecredenciada', 
    loadChildren: './views/redecredenciada/redecredenciadas.module#RedecredenciadasModule', 
    data: { title: 'Rede credenciada', breadcrumb: 'Rede credenciada'}
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './views/sessions/sessions.module#SessionsModule',
        data: { title: 'Session'}
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: { title: 'Dashboard', breadcrumb: 'Dashboard'}
      },
      {
        path: 'meusdados',
        loadChildren: './views/meusdados/meusdados.module#MeusdadosModule',
        data: { title: 'Meus Dados', breadcrumb: 'Meus Dados'}
      },
	  {
        path: 'modulos',
        loadChildren: './views/modulos/modulos.module#ModulosModule',
        data: { title: 'Modulos', breadcrumb: 'Módulos'}
      },
	  {
        path: 'programas',
        loadChildren: './views/programas/programas.module#ProgramasModule',
        data: { title: 'Programas', breadcrumb: 'Programas'}
      },
      {
        path: 'roles',
        loadChildren: './views/roles/roles.module#RolesModule',
        data: { title: 'Roles', breadcrumb: 'Papéis'}
      },
      {
        path: 'permissions',
        loadChildren: './views/permissions/permissions.module#PermissionsModule',
        data: { title: 'Permissions', breadcrumb: 'Permissões'}
      },
      {
        path: 'usuarios',
        loadChildren: './views/usuarios/usuarios.module#UsuariosModule',
        data: { title: 'Usuarios', breadcrumb: 'Usuários'}
      },
      {
        path: 'redes',
        loadChildren: './views/redes/redes.module#RedesModule',
        data: { title: 'Redes', breadcrumb: 'Redes'}
      },
      {
        path: 'especialidades',
        loadChildren: './views/especialidades/especialidades.module#EspecialidadesModule',
        data: { title: 'Especialidades', breadcrumb: 'Especialidades'}
      },
      {
        path: 'tiposdeestabelecimento',
        loadChildren: './views/tiposdeestabelecimento/tiposdeestabelecimento.module#TiposdeestabelecimentoModule',
        data: { title: 'Tipos de estabelecimento', breadcrumb: 'Tipos de estabelecimento'}
      },
      {
        path: 'tiposdeplano',
        loadChildren: './views/tiposdeplano/tiposdeplano.module#TiposdeplanoModule',
        data: { title: 'Tipos de plano', breadcrumb: 'Tipos de plano'}
      },
      {
        path: 'contratacoes',
        loadChildren: './views/contratacoes/contratacoes.module#ContratacoesModule',
        data: { title: 'Contratações', breadcrumb: 'Contratações'}
      },
      {
        path: 'roldecobertura',
        loadChildren: './views/rolsdecobertura/rolsdecobertura.module#RolsdecoberturaModule',
        data: { title: 'Rol de cobertura', breadcrumb: 'Rol de cobertura'}
      },
      {
        path: 'coparticipacoes',
        loadChildren: './views/coparticipacoes/coparticipacoes.module#CoparticipacoesModule',
        data: { title: 'Coparticipações', breadcrumb: 'Coparticipações'}
      },
      {
        path: 'grupos',
        loadChildren: './views/grupos/grupos.module#GruposModule',
        data: { title: 'Especialidades/Grupos', breadcrumb: 'Especialidades/Grupos'}
      },
      {
        path: 'procedimentos',
        loadChildren: './views/procedimentos/procedimentos.module#ProcedimentosModule',
        data: { title: 'Procedimentos', breadcrumb: 'Procedimentos'}
      },
      {
        path: 'faixasetarias',
        loadChildren: './views/faixasetarias/faixasetarias.module#FaixasetariasModule',
        data: { title: 'Faixas etárias', breadcrumb: 'Faixas etárias'}
      },
      {
        path: 'operadoras',
        loadChildren: './views/operadoras/operadoras.module#OperadorasModule',
        data: { title: 'Operadoras', breadcrumb: 'Operadoras'}
      },
      {
        path: 'credenciados',
        loadChildren: './views/credenciados/credenciados.module#CredenciadosModule',
        data: { title: 'Credenciados', breadcrumb: 'Credenciados'}
      },
      {
        path: 'planos',
        loadChildren: './views/planos/planos.module#PlanosModule',
        data: { title: 'Planos', breadcrumb: 'Planos'}
      },
      {
        path: 'abrangencias',
        loadChildren: './views/abrangencias/abrangencias.module#AbrangenciasModule',
        data: { title: 'Abrangências', breadcrumb: 'Abrangências'}
      },
      {
        path: 'pedidos',
        loadChildren: './views/pedidos/pedidos.module#PedidosModule',
        data: { title: 'Pedidos', breadcrumb: 'Pedidos'}
      },
      {
        path: 'vendedores',
        loadChildren: './views/vendedores/vendedores.module#VendedoresModule',
        data: { title: 'Vendedores', breadcrumb: 'Vendedores'}
      },
	  {
        path: 'corretoras',
        loadChildren: './views/corretoras/corretoras.module#CorretorasModule',
        data: { title: 'Corretoras', breadcrumb: 'Corretoras'}
      },
	  {
        path: 'perguntas',
        loadChildren: './views/perguntas/perguntas.module#PerguntasModule',
        data: { title: 'Perguntas', breadcrumb: 'Perguntas'}
      },
	  {
        path: 'itens',
        loadChildren: './views/planoitens/planoitens.module#PlanoitensModule',
        data: { title: 'Itens', breadcrumb: 'Itens'}
      },
	   {
        path: 'adesoes',
        loadChildren: './views/adesoes/adesoes.module#AdesoesModule',
        data: { title: 'Adesões', breadcrumb: 'Adesões'}
      },
      {
        path: 'adesoesc',
        loadChildren: './views/adesoesc/adesoesc.module#AdesoescModule',
        data: { title: 'Gerir Adesões', breadcrumb: 'Gerir Adesões'}
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];
