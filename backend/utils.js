export const skillCatalog = [
  'react',
  'javascript',
  'typescript',
  'node',
  'node.js',
  'express',
  'mongodb',
  'sql',
  'api',
  'rest',
  'html',
  'css',
  'frontend',
  'backend',
  'python',
  'java',
  'communication',
  'leadership',
  'problem solving',
  'agile',
  'aws',
  'docker',
  'testing',
  'product thinking',
  'design systems',
  'stakeholder communication',
  'teamwork',
];

export const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const captureSkills = (text = '') => {
  const normalized = normalizeText(text);
  const found = [];

  for (const skill of skillCatalog) {
    if (normalized.includes(skill)) {
      found.push(skill);
    }
  }

  return found;
};

export const calculateComparison = (resumeText, jobDescription) => {
  const resumeSkills = captureSkills(resumeText);
  const jdSkills = captureSkills(jobDescription);
  const uniqueJdSkills = [...new Set(jdSkills)];
  const uniqueResumeSkills = [...new Set(resumeSkills)];
  const matchedSkills = uniqueJdSkills.filter((skill) => uniqueResumeSkills.includes(skill));
  const missingSkills = uniqueJdSkills.filter((skill) => !uniqueResumeSkills.includes(skill));

  const score = uniqueJdSkills.length
    ? Math.min(100, Math.round((matchedSkills.length / uniqueJdSkills.length) * 100))
    : 0;

  const summary =
    matchedSkills.length > 0
      ? `This resume matches ${matchedSkills.length} of ${uniqueJdSkills.length} key job requirements with a ${score}% fit score.`
      : `This resume does not yet cover the required skills for this role. The current fit score is ${score}%.`;

  return {
    score,
    matchedSkills,
    missingSkills,
    summary,
  };
};
