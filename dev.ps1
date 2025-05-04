Write-Host "  Configuration de l'environnement Docker Minikube..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Lancer minikube tunnel dans une autre fenêtre si pas déjà ouvert
$tunnelRunning = Get-Process | Where-Object { $_.ProcessName -like "minikube-tunnel" }

Write-Host " Rebuild de l'image backend..."
cd backend
docker build -t backend-app .

Write-Host " Rebuild de l'image frontend..."
cd ../frontend
docker build -t frontend-app .

Write-Host "Restart des déploiements Kubernetes..."
cd ../k8s
kubectl rollout restart deployment backend-deployment
kubectl rollout restart deployment frontend-deployment

Write-Host " État des pods :"
kubectl get svc

Write-Host " Ouverture de l'IHM frontend..."
minikube tunnel
