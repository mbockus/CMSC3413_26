Here's some general steps for using these terraform files:

1. Install az cli
2. Install terraform
3. Ensure both `terraform` and `az` are available on your path by openening a cmd prompt and executing both
4. Execute `az login`
5. Execute `terraform init` in the same directory as your main.tf file
6. Execute `terraform apply` and provide the subscript id that was provided in the output of `az login`

If you experience quota issues, you may need to request more quota from Microsoft 
by going to "Usage + quotas" under your subscription in the Azure portal. 