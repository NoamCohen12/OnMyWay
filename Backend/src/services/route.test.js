import { buildRoute } from './route.service.js';

const startPoint = { x: 32.8, y: 35 };

const points = [
    { name: 'Yossi Cohen', x: 32.0853, y: 34.7818 },
    { name: 'Sarah Levi', x: 31.7683, y: 35.2137 },
    { name: 'David Mizrahi', x: 32.7940, y: 34.9896 }
];

const route = buildRoute(startPoint, points);
console.log(route.map(p => p.name));
