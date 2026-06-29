import { Profile } from './pages/profile/profile';
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { authGuard } from './core/auth/auth-guard';
import { Vms } from './pages/vms/vms';
import { Cluster } from './pages/cluster/cluster';
import { NotFound } from './pages/not-found/not-found'; // ◄ 1. Importe ton nouveau composant
import { CreateVm } from './pages/create-vm/create-vm';
import { VmDetails } from './pages/vm-details/vm-details';
import { LxcContainers } from './pages/lxc-containers/lxc-containers';
import { CreateLxc } from './pages/create-lxc/create-lxc';
import { LxcDetails } from './pages/lxc-details/lxc-details';
import { authRoleGuard } from './core/auth/auth-role-guard';
import { AddCluster } from './pages/add-cluster/add-cluster';

export const routes: Routes = [
    // Route publique
    {
        path: 'auth/login',
        component: Login,
        title: 'Login - Virtacore Portal',
    },
    {
        path: 'layout',
        component: Layout,
        canActivate: [authGuard],
        children: [
            {
                path: 'vms',
                component: Vms,
                title: 'Virtual machines - Virtacore Portal'
            },
            {
                path: 'clusters',
                component: Cluster,
                title: 'Clusters - Virtacore Portal',
                canActivate:[authRoleGuard]
            },
            {
                path: 'add_cluster',
                component: AddCluster,
                title: 'Add Clusters - Virtacore Portal',
                canActivate:[authRoleGuard]
            },
            {
                path: 'createVm',
                component: CreateVm,
                title: 'Create Vm - Virtacore Portal'
            },
            {
                path: 'vms/:id',
                component: VmDetails,
                title: 'VM details - Virtacore Portal'
            },
            {
                path: 'lxc-containers',
                component: LxcContainers,
                title: 'Lxc Containers - Virtacore Portal'
            },
            {
                path: 'lxc-containers/:id',
                component: LxcDetails,
                title: 'Lxc Details - Virtacore Portal'
            },
            {
                path: 'createLxc',
                component: CreateLxc,
                title: 'Create Lxc - Virtacore Portal'
            },
            {
                path: 'profile',
                component: Profile,
                title: 'Profile - Virtacore Portal'
            }
        ]
    },

    // ◄ 2. Capture toutes les mauvaises URLs en dehors du Layout
    {
        path: '404',
        component: NotFound,
        title: '404 Not Found - Virtacore'
    },
    {
        path: '**',
        redirectTo: '404'
    }
];
