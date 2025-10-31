import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        overlimit: {
            executor: 'constant-arrival-rate',
            rate: 3,               // 3 req/giây -> 180 req/phút > 120
            timeUnit: '1s',
            duration: '60s',
            preAllocatedVUs: 20,
            maxVUs: 50,
        },
    },
};

const URL = 'http://127.0.0.1:8000/api/motorcycles?brand=Yamaha&per_page=12';

export default function () {
    const r = http.get(URL);
    check(r, {
        '200 or 429': (res) => res.status === 200 || res.status === 429,
    });
}
