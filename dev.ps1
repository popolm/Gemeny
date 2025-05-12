& minikube docker-env | Invoke-Expression

docker build -t backend-app ./backend

docker build -t frontend-app ./frontend

kubectl rollout restart deployment backend-deployment
kubectl rollout restart deployment frontend-deployment

Start-Process powershell -ArgumentList "minikube tunnel" -WindowStyle Hidden

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "kubectl port-forward svc/loki-grafana 3000:80"

Start-Process powershell -ArgumentList "kubectl port-forward service/loki 3100:3100"

Start-Process powershell -ArgumentList "kubectl port-forward -n monitoring svc/prometheus-server 9090:80"

Start-Sleep -Seconds 5

k6 run .\backend\test\load\load_test.js

Write-Host "Test de charge terminé !"
