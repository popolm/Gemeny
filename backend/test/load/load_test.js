import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 100,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:81/hello");
  console.log(res.body);

  check(res, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
