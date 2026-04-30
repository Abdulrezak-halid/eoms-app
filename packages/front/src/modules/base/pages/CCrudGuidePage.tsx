import { useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CMarkdown } from "@m/core/components/CMarkdown";
import { CMermaidDiagram } from "@m/core/components/CMermaidDiagram";

const relationshipDiagram = `flowchart TB
  IdentityAccess[Identity Access] --> Organization[Organization]
  IdentityAccess --> Configuration[Configuration]
  IdentityAccess --> Monitoring[Monitoring]
  IdentityAccess --> Communication[Communication]
  IdentityAccess --> Operations[Operations]

  Organization --> Departments[Departments]
  Organization --> Teams[Teams]
  Organization --> Hierarchy[Hierarchy]

  Configuration --> SystemSettings[System Settings]
  Configuration --> FeatureFlags[Feature Flags]
  Configuration --> Integrations[Integrations]
  Configuration --> ApiKeys[API Keys]

  Operations --> Requests[Requests]
  Operations --> Workflows[Workflows]
  Operations --> WorkflowTemplates[Workflow Templates]
  Operations --> Approvals[Approvals]
  Operations --> Escalations[Escalations]

  Requests --> TaskManagement[Task Management]
  TaskManagement --> Tasks[Tasks]
  TaskManagement --> TaskTemplates[Task Templates]
  TaskManagement --> Assignments[Assignments]
  TaskManagement --> TaskComments[Task Comments]

  Operations --> ResourceManagement[Resource Management]
  ResourceManagement --> Files[Files]
  ResourceManagement --> Attachments[Attachments]
  ResourceManagement --> Storage[Storage]
  ResourceManagement --> FileVersions[File Versions]

  Communication --> Notifications[Notifications]
  Communication --> Announcements[Announcements]
  Communication --> Messaging[Messaging]

  Monitoring --> AuditLogs[Audit Logs]
  Monitoring --> ActivityTracking[Activity Tracking]
  Monitoring --> SystemEvents[System Events]

  Operations --> Reporting[Reporting]
  Monitoring --> Reporting
  ResourceManagement --> Reporting
  Communication --> Reporting

  SystemControl[System Control] --> Backups[Backups]
  SystemControl --> RestorePoints[Restore Points]
  SystemControl --> SystemHealth[System Health]
  SystemControl --> Monitoring
`;

const pageFlowDiagram = `flowchart LR
  QuickNavigation[Quick Navigation] --> CrudGuide[CRUD Guide]
  CrudGuide --> ListPage[List Page]
  ListPage --> AddForm[Add Form]
  ListPage --> EditForm[Edit Form]
  AddForm --> ListPage
  EditForm --> ListPage
  ListPage --> DetailAction[View / Inspect]
  DetailAction --> ListPage
`;

export function CCrudGuidePage() {
  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: "CRUD" }],
    [],
  );

  const overviewContent = useMemo(
    () => `
# CRUD Guide

This page explains how the EOMS modules relate to each other and how the standard page flow works.

## Relationship rules

- Identity Access is the foundation for permissions, sessions, and secure access.
- Organization defines the structural context for users, departments, and teams.
- Configuration provides shared system settings, feature flags, integrations, and API keys.
- Operations coordinates requests, workflows, approvals, and escalations.
- Task Management, Resource Management, Communication, Monitoring, and Reporting consume data produced by operations and organizational context.
- System Control manages backups, restore points, and system health, and feeds the monitoring layer.

## CRUD page flow

- List pages are the entry point for browsing records.
- Add forms create a new record and return to the list.
- Edit forms update an existing record and return to the list.
- The CRUD guide stays read-only and exists only to document the relationships.
`,
    [],
  );

  return (
    <CBody
      breadcrumbs={breadcrumbs}
      title="CRUD Guide"
      markdownPanelContent={overviewContent}
      noFixedWidth
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <CMarkdown value={overviewContent} />
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Model relationship diagram</h2>
            <p>
              The graph below groups the project structure into the modules that
              share data, permissions, and operational context.
            </p>
          </div>
          <CMermaidDiagram value={relationshipDiagram} />
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Page relationship diagram</h2>
            <p>
              This flow shows the CRUD-only page next to the normal page flow so
              the navigation relationship stays obvious.
            </p>
          </div>
          <CMermaidDiagram value={pageFlowDiagram} />
        </section>
      </div>
    </CBody>
  );
}