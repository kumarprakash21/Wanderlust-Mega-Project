#!/bin/bash
set -euo pipefail

# Set the Instance ID and path to the .env file
INSTANCE_ID="i-097932daab6262922"

# Path to the .env file
file_to_find="../backend/.env.docker"

# Retrieve the public DNS name of the specified EC2 instance
public_dns=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicDnsName' \
    --output text)

if [ ! -f "$file_to_find" ]; then
    echo "ERROR: File not found: $file_to_find"
    exit 1
fi

# The frontend is exposed through Kubernetes NodePort 31000.
sed -i \
    -e "s|^FRONTEND_URL=.*|FRONTEND_URL=http://${public_dns}:31000|" \
    "$file_to_find"
