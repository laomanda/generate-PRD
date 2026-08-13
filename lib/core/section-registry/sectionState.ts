/**
 * ============================================================================
 * SECTION STATE & USER LOCK PROTECTION SYSTEM
 * ============================================================================
 * Manages section states: 'generated' | 'edited' | 'locked' | 'approved' | 'deprecated'.
 * Preserves user modifications during regeneration.
 * ============================================================================
 */

export type SectionState = 'generated' | 'edited' | 'locked' | 'approved' | 'deprecated';

export interface UserSectionRecord {
  sectionId: string;
  documentId: string;
  state: SectionState;
  userContent?: string;
  lastModified?: string;
}

export class SectionLockProtectionManager {
  private userSections: Record<string, UserSectionRecord> = {};

  setSectionState(record: UserSectionRecord): void {
    const key = `${record.documentId}:${record.sectionId}`;
    this.userSections[key] = {
      ...record,
      lastModified: new Date().toISOString(),
    };
  }

  getSectionRecord(documentId: string, sectionId: string): UserSectionRecord | undefined {
    return this.userSections[`${documentId}:${sectionId}`];
  }

  /**
   * Safe Section Content Provider:
   * If a section is locked or edited, return the user version.
   * Otherwise, return the newly generated content.
   */
  resolveSectionContent(
    documentId: string,
    sectionId: string,
    generatedContent: string
  ): string {
    const record = this.getSectionRecord(documentId, sectionId);
    if (record) {
      if ((record.state === 'locked' || record.state === 'edited') && record.userContent) {
        return record.userContent;
      }
    }
    return generatedContent;
  }
}

export const sectionLockManager = new SectionLockProtectionManager();
