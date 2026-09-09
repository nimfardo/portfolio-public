import type { ProjectContent } from '../model/types';
import { artAnnanolli } from './art-annanolli';
import { arvus } from './arvus';
import { connectis } from './connectis';
import { medicalSoftware } from './medicalSoftware';
import { enterpriseIt } from './enterpriseIt';
import { logofolio } from './logofolio';
import { metest } from './metest';
import { defenceSystems } from './defenceSystems';
import { motion } from './motion';
import { socialVideo } from './socialVideo';
import { eLearning } from './eLearning';

/**
 * Slug -> full case-study content, for projects that have one written.
 * Most projects only have grid-card data (config/projects.ts) so far —
 * [slug].astro falls back to the No Content state for any slug missing
 * here. Typed against ProjectContent (not `typeof connectis`) since
 * feat-033: pages differ structurally, and every optional section renders
 * only when present.
 */
export const PROJECT_CONTENT: Record<string, ProjectContent> = {
  'art-annanolli': artAnnanolli,
  arvus,
  connectis,
  'medical-software': medicalSoftware,
  'enterprise-it': enterpriseIt,
  logofolio,
  metest,
  'military-systems': defenceSystems,
  motion,
  'social-media-app': socialVideo,
  'e-learning-platform': eLearning,
};
