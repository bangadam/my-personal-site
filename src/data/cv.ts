import raw from "./cv.json";

export type CvRole = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets?: string[];
  tags?: string[];
};

export type CvSkillLevel = "Expert" | "Advanced";

export type CvSkillGroup = {
  title: string;
  icon: string;
  skills: Array<{ name: string; level: CvSkillLevel }>;
};

export type CvDetail = { label: string; value: string };

export type CvContact = { label: string; value: string; href: string };

export type CvDocument = {
  profile: {
    name: string;
    title: string;
    location: string;
    summary: string;
  };
  pdf: { href: string; file: string; label: string };
  contacts: CvContact[];
  details: CvDetail[];
  roles: CvRole[];
  skillGroups: CvSkillGroup[];
};

// Single source of truth for the site and the generated PDF (scripts/build-cv-pdf.mjs).
export const CV = raw as CvDocument;
