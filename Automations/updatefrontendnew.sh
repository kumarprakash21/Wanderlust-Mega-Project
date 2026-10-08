#!/bin/bash
set -euo pipefail

# Set the Instance ID and path to the .env file
INSTANCE_ID="i-097932daab6262922"

# Retrieve the public IP address and public DNS name of the specified EC2 instance
ipv4_address=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)
public_dns=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicDnsName' \
    --output text)

# Path to the .env file
file_to_find="../frontend/.env.docker"

if [ ! -f "$file_to_find" ]; then
    echo "ERROR: File not found: $file_to_find"
    exit 1
fi

# Update the frontend API URL and Vite host allowlist from the EC2 instance.
sed -i \
    -e "s|^VITE_API_PATH=.*|VITE_API_PATH=http://${ipv4_address}:31100|" \
    -e "s|^VITE_ALLOWED_HOST=.*|VITE_ALLOWED_HOST=${public_dns}|" \
    "$file_to_find"

if ! grep -q '^VITE_ALLOWED_HOST=' "$file_to_find"; then
    printf '\nVITE_ALLOWED_HOST=%s\n' "$public_dns" >> "$file_to_find"
fi
