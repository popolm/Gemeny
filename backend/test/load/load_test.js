import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% des requêtes < 500ms
    http_req_failed: ["rate<0.01"], // <1% d'erreurs
  },
};
export default function () {
  const res = http.get("http://localhost:43210/hello");
  console.log(res.body);

  check(res, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
