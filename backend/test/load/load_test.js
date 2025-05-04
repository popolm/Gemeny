import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus: 100, // Nombre d'utilisateurs virtuels simultanés
    duration: '30s', // Durée du test
};

export default function () {
    let res = http.get('http://your-api-url/hello');

    check(res, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(1);
}
