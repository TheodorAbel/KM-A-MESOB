# Addis Mesob Knowledge Management System (KMS) - Backend API

##  Project Overview

Addis Mesob KMS is an Ethiopian government-style internal system for knowledge sharing and service improvement. This is the **backend API** built with ASP.NET Core 8 Web API.

### 🎯 Features

- ✅ **Authentication System** (JWT + Role-based access)
- ✅ **Employee Management** (Admin only)
- ✅ **Knowledge Base** (Articles with categories)
- ✅ **Issue Tracking** (Create and update tickets)
- ✅ **Community Forum** (Posts and discussions)
- ✅ **Exit Workflow** (Offboarding records)
- ✅ **QMS Feedback** (Quality management feedback)

---

##  Employee & Login Credentials

###  Admin (Full Access)
| Name | Employee ID | Password | Role |
|------|------------|----------|------|
| **Melat Mamushet** | ADMIN001 | Admin@123 | Admin |

### Employees (Limited Access)
| Name | Employee ID | Password | Department |
|------|------------|----------|------------|
| **Abimael Getachew** | EMP001 | Employee@123 | Software Development |
| **Abel Tewodros** | EMP002 | Employee@123 | IT Infrastructure |
| **Hani Abesha** | EMP003 | Employee@123 | Human Resources |
| **Melkie Yilk** | EMP004 | Employee@123 | Quality Assurance |



## Steps

### Step 1: Clone the Repository
Step 2: Open the Project
Step 3: Restore NuGet Packages
dotnet restore
Step 4: Update Database Connection String
Open appsettings.json and update the connection string:

json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME\\SQLEXPRESS02;Database=AddisMesobKMSDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
Step 5: Create Database and Apply Migrations
Run these commands:
powershell
# Create migration
Add-Migration InitialCreate

# Create/Update database
Update-Database