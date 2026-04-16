# 🏢 Addis Mesob Knowledge Management System (KMS) - Backend API

## 📋 Project Overview

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

## 👥 Team Members & Login Credentials

### 👑 Admin (Full Access)
| Name | Employee ID | Password | Role |
|------|------------|----------|------|
| **Melat Mamushet** | ADMIN001 | Admin@123 | Admin |

### 👥 Employees (Limited Access)
| Name | Employee ID | Password | Department |
|------|------------|----------|------------|
| **Abimael Getachew** | EMP001 | Employee@123 | Software Development |
| **Abel Tewodros** | EMP002 | Employee@123 | IT Infrastructure |
| **Hani Abesha** | EMP003 | Employee@123 | Human Resources |
| **Melkie Yilk** | EMP004 | Employee@123 | Quality Assurance |

---

## 🛠️ Prerequisites (What You Need to Install)

Before running this project, make sure you have:

### 1. **.NET 8 SDK**
- Download from: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
- Verify installation: `dotnet --version`

### 2. **SQL Server Express**
- Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Install SQL Server Express with default settings

### 3. **Visual Studio 2022 Community** (Recommended)
- Download: https://visualstudio.microsoft.com/vs/community/
- During installation, select:
  - ✅ ASP.NET and web development
  - ✅ .NET desktop development
  - ✅ Data storage and processing

### 4. **Git** (for cloning the repository)
- Download: https://git-scm.com/downloads

---

## 🚀 Getting Started - Step by Step

### Step 1: Clone the Repository

Open **Command Prompt** or **Git Bash**:

```bash
git clone <your-repository-url>
cd AddisMesobKMS
Step 2: Open the Project
Using Visual Studio:

Double-click AddisMesobKMS.sln file

Wait for project to load

Using VS Code:

bash
code .
Step 3: Restore NuGet Packages
In Visual Studio:

Right-click solution → Restore NuGet Packages

Or using command line:

bash
dotnet restore
Step 4: Update Database Connection String
Open appsettings.json and update the connection string:

json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME\\SQLEXPRESS02;Database=AddisMesobKMSDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
Step 5: Create Database and Apply Migrations
In Visual Studio Package Manager Console:

Tools → NuGet Package Manager → Package Manager Console

Run these commands:

powershell
# Create migration
Add-Migration InitialCreate

# Create/Update database
Update-Database
