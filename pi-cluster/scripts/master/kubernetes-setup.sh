echo "Installing Flannel"
sudo sysctl net.bridge.bridge-nf-call-iptables=1


kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/2140ac876ef134e0ed5af15c65e414cf26827915/Documentation/kube-flannel.yml
