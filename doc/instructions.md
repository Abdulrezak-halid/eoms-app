# FINAL PROJECT DOCUMENT
## 1️⃣ Project Overview

```text
EOMS is a web-based system for managing internal business operations. It is built on a modern modular architecture and aims to centralize the management of users, requests, tasks, and operational processes within a single platform.
```

## 2️⃣ Problem Statement
Organizations face the following challenges:

- Lack of a unified operations management system
- Poor tracking of requests and approvals
- Data scattered across multiple tools
- Weak security and lack of a clear audit trail

## 3️⃣ Solution
Development of a centralized system based on:

- API-based architecture
- Role-based access control
- Workflow engine
- Real-time tracking
- Secure data handling

## 4️⃣ System Architecture

- Frontend: React + Vite + MatX
- Backend: Hono (Node.js)
- Database: PostgreSQL
- ORM: Drizzle
- API Contract: OpenAPI

## 5️⃣ Modules

- Auth & Users
- Roles & Permissions
- Requests & Workflow Engine
- Tasks Management
- File Management
- Notifications
- Audit Logging
- Backup System

## 6️⃣ Infrastructure

- Monorepo (npm workspaces)
- Shared types via common
- API schema auto-generated
- Docker-ready environment

## 7️⃣ Security

- JWT Authentication
- Role-based authorization
- Input validation (Zod)
- Encrypted storage
- Audit logging

## 8️⃣ Development Strategy

- Agile (Sprint-based)
- GitHub Projects
- Modular backend design
- API-first development
- swagger

---

# 🚀 Enterprise Operations Management System (EOMS) - Master Instructions

## ⚠️ ZERO RULE: DO NOT WRITE CODE BEFORE PLANNING
Read this document completely before generating any code. This project follows strict Senior-level architecture. Any deviation from these rules will result in technical debt and will be rejected. 

**Core Engineering Principles to follow strictly:**
- **Plan before you write code** (System Design first).
- **Project Structure** (Adhere strictly to the defined Monorepo Modular structure).
- **Naming & Readability** (Follow the strict prefix rules).
- **Clean Code & Best Practices** (No quick hacks).
- **Separation of Concerns** (Controllers, Services, Repositories, UI must be decoupled).
- **Accessibility (A11Y) & UI/UX** (Enterprise-grade interfaces).
- **Reusability** (Build generic components/services).
- **Performance** (Optimized renders, efficient DB queries).
- **Testing & Documentation** (Mandatory before delivery).

---

## 1. 🛠 Technology Stack & Infrastructure
- **Architecture:** Monorepo (npm workspaces: `packages/back`, `packages/front`, `packages/common`).
- **Backend:** Node.js, Hono, Drizzle ORM, PostgreSQL. *(Note: Strictly NO ASP.NET in this project)*.
- **Frontend:** React 19, Vite, TailwindCSS v4, MatX UI Template.
- **API Contract:** OpenAPI (Swagger) via Hono Zod OpenAPI.
- **Data Fetching:** `openapi-fetch` (Fully Type-Safe).

---

## 2. 🏛 System Design & Domain Model (MANDATORY STEP 1)
Before writing any module, the Domain Entities and their relationships must be respected.

### Core Entities:
`User`, `Role`, `Permission`, `Request`, `WorkflowStage`, `WorkflowAction`, `Task`, `File`, `Notification`, `AuditLog`, `BackupHistory`.

### Critical Relationships:
- `User` <-> `Role` (Many-to-Many)
- `Role` -> `Permission` (One-to-Many)
- `Request` -> `WorkflowStage` (Many-to-One)
- `Request` -> `CreatedBy` (User)
- `Task` -> `AssignedTo` (User)
- `File` -> `LinkedTo` (Polymorphic: Request | Task)
- `AuditLog` -> `User` (Many-to-One)

---

## 3. 📂 Project Structure (Modular Architecture)
The project strictly follows a Feature-Sliced/Modular design. Do not mix contexts.

### Backend Structure (`packages/back/src/modules/[moduleName]/`)
Every module (e.g., `auth`, `users`, `workflow`, `tasks`) MUST follow this internal structure:
```text
📂 [moduleName]
 ┣ 📂 interfaces   (Internal module interfaces)
 ┣ 📂 middlewares  (Module-specific logic)
 ┣ 📂 orm          (Drizzle schemas & relations specific to this module)
 ┣ 📂 routers      (Hono routes definition)
 ┣ 📂 schemas      (Zod validation schemas for OpenAPI)
 ┣ 📂 services     (Business logic)
 ┣ 📂 utils        (Helper functions)
 ┗ 📂 test         (Unit & Integration tests)
```
Frontend Structure (packages/front/src/modules/[moduleName]/)
Every frontend module MUST follow this internal structure:
```text
📂 [moduleName]
 ┣ 📂 api          (e.g., Api.ts - utilizing openapi-fetch)
 ┣ 📂 components   (Module-specific UI)
 ┣ 📂 constants    (Enums, static data)
 ┣ 📂 contexts     (React Context API if needed)
 ┣ 📂 hooks        (Custom hooks)
 ┣ 📂 interfaces   (Frontend specific types)
 ┣ 📂 layout       (Module-specific wrappers)
 ┣ 📂 pages        (Route entry points)
 ┗ 📂 utils        (Helper functions)
```

## 4. 🔗 The OpenAPI Flow (The Golden Rule)
API integration must follow this exact unidirectional flow. **DO NOT** manually write fetch requests or API types.

1. **Backend:** Define routes and schemas using `@hono/zod-openapi`.
2. **Backend Script:** Run `npm run build:api-json` to generate `openapi.json`.
3. **Common Script:** Run `npm run build:api-schema:file` in `packages/common` using `openapi-typescript` to generate the global TypeScript definitions (`build-api-schema.ts`).
4. **Frontend:** Consume the API strictly using `openapi-fetch` and the types exported from `packages/common`.

---

## 5. 🔤 Strict Naming Conventions
- **React Components:** MUST be prefixed with the letter **`C`** (e.g., `CButton.tsx`, `CUserTable.tsx`, `CLayout.tsx`).
- **Types & Interfaces:** MUST be prefixed with the letter **`I`** (e.g., `IUser`, `IAuthResponse`, `IWorkflowStage`).
- **Files/Folders:** Use `kebab-case` for folders and non-component files, `PascalCase` for React components.
- **ESLint:** Code must pass ESLint with 0 warnings. Run `npm run check:all` constantly.

---

## 6. 🚀 SPRINT 1: The Execution Plan
**DO NOT build dashboards, charts, or complex UI yet. We start with the foundation.**

### Step 1: Clean the Template
- Go to `packages/front`.
- Delete all demo data, mock APIs, and dummy charts from the MatX template.
- Reduce it to an "Empty State" layout.

### Step 2: Backend First (Sprint 1)
- Setup Database connection (PostgreSQL + Drizzle).
- Build the `auth` module (JWT Generation, Login route).
- Build the `users` and `roles` modules (CRUD operations).

### Step 3: Frontend Second (Sprint 1)
- Build the Login Page (`CLoginPage`).
- Setup JWT storage and Axios/Fetch interceptors.
- Build the Users Table (`CUsersTable`).
- Build Create/Edit User Modals/Forms.

---

## 7. 🧠 Mental Models & Diagrams to understand

### 1️⃣ System Architecture
```text
[ React Frontend (MatX) ] 
          ↓
[ OpenAPI Fetch Client ] 
          ↓
[ Hono REST API ] 
          ↓
[ Services/Business Logic ] 
          ↓
[ Drizzle ORM ] 
          ↓
[ PostgreSQL ]
```

### 2️⃣ Auth Flow
CLoginPage → Submit → Hono /auth/login → Validate Hash → Generate JWT → Return JWT → Frontend Stores in LocalStorage/Cookies → Attach to Headers via openapi-fetch middleware.

### 3️⃣ Workflow Engine (Future Sprint)
Request Created → Enters Stage 1 → Pending Role X Approval → Approved → Transitions to Stage 2 → ... → Done/Rejected.

## 8. 📘 FINAL PROJECT DOCUMENT OVERVIEW

Keep this core vision in mind while coding: 

- EOMS is a modular web system for managing internal corporate operations.
- Problem solved: Eliminates scattered tools, tracks requests/approvals efficiently, and secures company data.
- Core Modules: Auth/Users, Roles/Permissions, Workflow Engine, Tasks, Files, Notifications, Audit - - Logging, Automated Backups.
- Security: JWT, RBAC, Zod Validation, Encrypted DB fields, Audit trails.
- Development Strategy: Agile, API-first development, Component Reusability.