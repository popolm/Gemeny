# Basculer Docker vers l'environnement Minikube
Write-Host " Configuration de l'environnement Docker vers Minikube..."
& minikube docker-env | Invoke-Expression

# Rebuild images
Write-Host " Build de l'image backend..."
docker build -t backend-app ./backend

Write-Host " Build de l'image frontend..."
docker build -t frontend-app ./frontend

# Redémarrer les déploiements
Write-Host "Redémarrage des pods backend et frontend..."
kubectl rollout restart deployment backend-deployment
kubectl rollout restart deployment frontend-deployment

# Lancer minikube tunnel en arrière-plan
Write-Host " Lancement du tunnel Minikube..."
Start-Process powershell -ArgumentList "minikube tunnel" -WindowStyle Hidden

# Attendre un peu avant les port-forwards
Start-Sleep -Seconds 2

# Port-forward Grafana
Write-Host " Port-forward Grafana sur http://localhost:3000"
Start-Process powershell -ArgumentList "kubectl port-forward svc/loki-grafana 3000:80"

# Port-forward Loki
Write-Host " Port-forward Loki sur http://localhost:3100"
Start-Process powershell -ArgumentList "kubectl port-forward service/loki 3100:3100"

Write-Host " Environnement de développement prêt !"
