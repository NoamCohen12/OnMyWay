function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function buildRoute(startPoint, points) {
    const route = [];
    let current = startPoint;
    const remaining = [...points];

    while (remaining.length > 0) {
        let closestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const d = distance(current, remaining[i]);
            if (d < minDistance) {
                minDistance = d;
                closestIndex = i;
            }
        }

        current = remaining.splice(closestIndex, 1)[0];
        route.push(current);
    }

    return route;
}