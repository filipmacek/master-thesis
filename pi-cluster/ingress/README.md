# Setup
1. Changes ingress controller service from type NodePort to LoadBalancer. Metallb is alreadyt installed on bare metal raspberry pi cluster. So it will assign a free IP address to nginx ingress controller service.
2. Be carefull you need to adapt docker containers for your raspberry pies archtecture ARM.
Also because you are using arm 26 version runAsUser must be 33 (alpine linux) instead of default value of 101


References:
https://limpygnome.com/2019/09/21/raspberry-pi-kubernetes-cluster/
https://www.shogan.co.uk/kubernetes/building-a-pi-kubernetes-cluster-part-3-worker-nodes-and-metallb/
