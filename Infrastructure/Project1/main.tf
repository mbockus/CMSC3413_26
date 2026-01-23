terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      # Latest published version on the Terraform Registry at time of writing
      version = "= 4.57.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

variable "subscription_id" {
  type = string
}

resource "azurerm_resource_group" "project1" {
  name     = "project1-resources"
  location = "Central US"
}

# Replaces azurerm_app_service_plan
resource "azurerm_service_plan" "project1example" {
  name                = "project1-appserviceplan"
  location            = azurerm_resource_group.project1.location
  resource_group_name = azurerm_resource_group.project1.name

  os_type  = "Windows"
  sku_name = "F1"
}

# Replaces azurerm_app_service
resource "azurerm_windows_web_app" "project1example" {
  name                = "project1-example-app-service" # CHANGEME - must be globally unique
  location            = azurerm_resource_group.project1.location
  resource_group_name = azurerm_resource_group.project1.name
  service_plan_id     = azurerm_service_plan.project1example.id

  site_config {
    # Free tier doesn't support Always On
    always_on = false

    application_stack {
      current_stack  = "dotnet"
      dotnet_version = "v8.0"
    }
  }
}
