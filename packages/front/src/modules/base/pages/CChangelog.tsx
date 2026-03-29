import { useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import { CMarkdown } from "@m/core/components/CMarkdown";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CChangelog() {
  const { t } = useTranslation();

  const changelogContent = useMemo(
    () => `
# Changelog

All notable changes to this project will be documented in this file.

---

## \`Version 2.5.0\` - 2026-01-25

### Added
- **New Dashboard Analytics**: Introduced advanced analytics widgets for energy consumption tracking
- **Export Functionality**: Users can now export reports in PDF and Excel formats
- **Dark Mode Support**: Complete dark theme implementation across all modules
- **Multi-language Support**: Added support for Turkish and English languages

### Changed
- **Improved Performance**: Optimized database queries resulting in 40% faster page loads
- **Enhanced UI/UX**: Redesigned navigation menu for better user experience
- **Updated Dependencies**: Upgraded to latest versions of React and other core libraries

### Fixed
- **Login Issue**: Resolved session timeout problems on slower connections
- **Chart Rendering**: Fixed data visualization bugs in regression analysis charts
- **Mobile Responsiveness**: Corrected layout issues on tablet devices

---

## \`Version 2.4.1\` - 2026-01-10

### Fixed
- **Critical Security Patch**: Addressed authentication vulnerability
- **Data Loss Prevention**: Fixed issue where unsaved changes could be lost during navigation
- **Email Notifications**: Resolved delivery issues for system notifications

---

## \`Version 2.4.0\` - 2025-12-15

### Added
- **Energy Performance Indicators**: New module for tracking and analyzing energy KPIs
- **Automated Reporting**: Schedule reports to be generated and sent automatically
- **User Activity Logs**: Admin can now view detailed user activity history

### Changed
- **Database Migration System**: Improved migration process for better stability
- **API Response Times**: Optimized API endpoints for faster data retrieval

### Removed
- **Legacy Dashboard**: Deprecated old dashboard in favor of new analytics module

---

## \`Version 2.3.0\` - 2025-11-20

### Added
- **Regression Analysis**: New advanced statistical analysis tools
- **Data Correlation Views**: Visual correlation matrix for exploratory analysis
- **Batch Operations**: Support for bulk actions on multiple records

### Changed
- **Search Functionality**: Enhanced search with fuzzy matching and better filtering
- **Form Validation**: Improved real-time validation feedback

---

## \`Version 2.2.0\` - 2025-10-30

### Added
- **Department Management**: New organizational structure features
- **Access Tokens**: API access token generation and management
- **Role-based Permissions**: Granular permission system for users

### Fixed
- **Memory Leaks**: Resolved memory management issues in long-running sessions
- **File Upload**: Fixed issues with large file uploads

---

## \`Version 2.1.0\` - 2025-09-25

### Added
- **Initial Release**: Core energy management system functionality
- **User Management**: Basic user and organization management
- **Data Measurement**: Measurement collection and visualization
- **Compliance Tracking**: Regulatory compliance obligation tracking

`,
    [],
  );

  return (
    <CBody title={t("changelog")}>
      <div className="p-3">
        <CMarkdown value={changelogContent} />
      </div>
    </CBody>
  );
}
