import { ProjectModel, DomainEntityModel } from '../project-model/schemas';
import { extractDomainKnowledge } from './domainKnowledge';

export function deriveDomainEntities(project: Pick<ProjectModel, 'features' | 'projectName'> & { domain: { domainName: string; primaryEntityNames: string[] } }): DomainEntityModel[] {
  const knowledge = extractDomainKnowledge({
    projectName: project.projectName,
    description: project.domain.domainName,
    features: project.features || [],
  });

  return knowledge.entities;
}
