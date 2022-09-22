echo "Running update script..."
ssh -t pi@192.168.0.8 "bash -i -c 'npm --version'" < ./bash/update.sh
