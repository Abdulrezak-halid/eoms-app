Currently, the following modules exist in the project:

## dashboard

## measurements 
(leave them as is; they will need to be modified later)

## analyses 
(leave them as is; they will need to be modified later)

## commitment 
-> We need this for the EOM project; it should be left as is.

## planning 
-> We need this for the EOM project; it should be left as is.

## supportingOperations 
-> We need this for the EOM project; it should be left as is (we will modify some aspects later on certain pages).

## internalAudit 
-> We need this for the EOM project; it should be left as is.

## report 
-> We need this for the EOM project; it should be left as is (we will modify some aspects later on certain pages).

## documentManagement 
-> We don't need this.

## supplyChain 
-> We need this for the EOM project; it should be left as is (we will modify some aspects later on certain pages).

## configuration 
-> We need this for the EOM project; it should be left as is. Keep it as is (we will make some adjustments later on some pages)

---
In addition to those modules and pages, we will add these modules:
## Identity Access
- users (already existing in configuration)
- roles (must be created)
- permissions (already existing within users)
- sessions (existing)

## Operations
- requests (must be created)
- workflows (already existing within internalAudit)
- approvals (must be created)
- escalations (must be created)

## Task Management (must be created)
- tasks (must be created)
- assignments (must be created)

## Resource Management (must be placed under the Reports module)
- files
- attachments
- storage
- fileVersions

## Communication (must be created)
- notifications (already existing in CBodyHeader)
- announcements (must be created)
- messaging (must be created) Create it

## Monitoring -> Must be created
- auditLogs -> Must be created
- activityTracking -> Must be created
- systemEvents -> Must be created

## System Control -> Exists in sysadmin
- backups
- restorePoints
- systemHealth

## Organization -> Exists in sysadmin
- departments
- teams
- hierarchy

## Configuration -> Exists; missing pages must be added
- systemSettings -> Must be created
- featureFlags -> Must be created
- integrations -> Exists in the measurements module