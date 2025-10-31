import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        steady: {
            executor: 'constant-arrival-rate',
            rate: 2,           // 2 req/giây = 120 req/phút
            timeUnit: '1s',
            duration: '60s',
            preAllocatedVUs: 10,
            maxVUs: 20,
        },
    },
};

const URL = 'http://127.0.0.1:8000/api/motorcycles?brand=Yamaha&per_page=12';

export default function () {
    const r = http.get(URL);
    check(r, {
        '200': (res) => res.status === 200,
        'X-Cache present': (res) => !!res.headers['X-Cache'],
    });
}
