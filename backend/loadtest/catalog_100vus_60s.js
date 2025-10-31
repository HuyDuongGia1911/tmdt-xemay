import http from 'k6/http';
import { sleep, check } from 'k6';
export const options = { vus: 100, duration: '60s' };
export default function () {
    const r = http.get('http://localhost:8000/api/motorcycles?brand=Yamaha&per_page=12');
    check(r, { '200': res => res.status === 200, 'X-Cache present': res => !!res.headers['X-Cache'] });
    sleep(1);
}
