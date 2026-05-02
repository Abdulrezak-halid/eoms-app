# EOMS

Project Database Models and Modules

The following outline categorizes the final modules and their corresponding database models for the EOM system. This structure will serve as the reference for building the database schema.

## 1. Identity Access

- **User**: System users (moved/reused from configuration)
- **Role**: User roles and access groupings (New)
- **Permission**: Fine-grained access permissions
- **Session**: User sessions tracking

## 2. Organization (System Admin)

- **Department**: Organizational units
- **Team**: Sub-groups within departments
- **Hierarchy**: Reporting lines and structural hierarchy

## 3. Communication

- **Notification**: System and user notifications
- **Announcement**: Global or group-based broadcasts (New)
- **Message**: General messaging between users/groups (New)

## 4. Task Management

- **Task**: Actionable items (New)
- **Assignment**: Users assigned to specific tasks (New)

## 5. Operations

- **Request**: Operation requests (New)
- **Workflow**: Configurable state workflows (reused/adapted from internalAudit)
- **Approval**: Approval steps for requests/workflows (New)
- **Escalation**: Escalation triggers and logs for unhandled tasks (New)

## 6. Resource Management (Under Reports)

- **File**: Uploaded files and resources
- **Attachment**: Link between files and other entities
- **Storage**: Storage metadata and allocation limits
- **FileVersion**: Version history for updated files

## 7. Monitoring

- **AuditLog**: Detailed tracking of data mutations (New)
- **ActivityTracking**: User activity breadcrumbs (New)
- **SystemEvent**: System-level events or technical logs (New)

## 8. System Control (System Admin)

- **Backup**: Data backup records
- **RestorePoint**: Points in time for system restores
- **SystemHealth**: Periodic health check metrics

## 9. Configuration

- **SystemSetting**: Global application settings (New)
- **FeatureFlag**: Toggles for system features (New)
- **Integration**: External API/service configurations (from measurements)

## 10. Core Business Modules

The following core modules are retained for EOM. DB models for these are mostly predefined but will be extended as required:

- **Dashboard**: User and system analytics views
- **Measurement**: KPI and metric definitions (to be modified)
- **Analysis**: Analytical reports and processing (to be modified)
- **Commitment**: Kept as-is
- **Planning**: Kept as-is
- **Supporting Operations**: Kept as-is (with UI modifications)
- **Internal Audit**: Kept as-is
- **Report**: Kept as-is (with UI modifications)
- **Supply Chain**: Kept as-is (with UI modifications)

> **Note**: The **Document Management** module is excluded and will not be migrated/integrated.
