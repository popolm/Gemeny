pour lancer le projet

tout dans terminal dans cd C:\Users\users\my-javascript-app>

cd front/
npm start
cd ..
cd back/
npm start

démarrer docker desktop

dans un powershell windows en admin:
minikube start
minikube ip (pour vérifier que ça fonctionne bien)
minikube tunnel

sur l'internet :
localhost:80
localhost:81

kubectl port-forward svc/loki-grafana 3000:80

kubectl port-forward service/loki 3100:3100

Invoke-WebRequest -Uri "http://localhost:3100/loki/api/v1/query?query={namespace=`"default`"}" -UseBasicParsing

kubectl port-forward -n default $(kubectl get pods -l app=promtail -n default -o jsonpath="{.items[0].metadata.name}") 9080:9080

kubectl port-forward -n monitoring svc/prometheus-server 9090:80

accès db.json : 

kubectl get pods
kubectl exec -it "nomdupods" -- /bin/sh
cd app/data/
cat db.json
