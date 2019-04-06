import Map from './components/Map.vue';
import Dashboard from './components/Dashboard.vue';
import About from './components/About.vue';
import Contact from './components/Contact.vue';

export const routes = [{
    path: '/',
    component: Map
}, {
    path: '/dashboard',
    component: Dashboard
}, {
    path: '/about',
    component: About
}, {
    path: '/contact',
    component: Contact
}];