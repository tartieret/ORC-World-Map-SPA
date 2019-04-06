import ProjectMap from './components/ProjectMap.vue';
import Dashboard from './components/Dashboard.vue';
import About from './components/About.vue';
import Contact from './components/Contact.vue';

export const routes = [{
    path: '/',
    name: 'map',
    component: ProjectMap
}, {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
}, {
    path: '/about',
    name: 'about',
    component: About
}, {
    path: '/contact',
    name: 'contact',
    component: Contact
}];