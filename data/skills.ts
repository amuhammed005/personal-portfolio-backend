import type { Skill } from "@/lib/types";

// Web Development Skills
export const webDevSkills: Skill[] = [
  { name: "React", icon: "react", category: "web" },
  { name: "Next.js", icon: "nextjs", category: "web" },
  { name: "TypeScript", icon: "typescript", category: "web" },
  { name: "JavaScript", icon: "javascript", category: "web" },
  { name: "Node.js", icon: "nodejs", category: "web" },
  { name: "Tailwind CSS", icon: "tailwind", category: "web" },
  { name: "PostgreSQL", icon: "postgresql", category: "web" },
  { name: "MongoDB", icon: "mongodb", category: "web" },
  { name: "GraphQL", icon: "graphql", category: "web" },
  { name: "Docker", icon: "docker", category: "web" },
  { name: "AWS", icon: "aws", category: "web" },
  { name: "Git", icon: "git", category: "web" },
  { name: "Figma", icon: "figma", category: "web" },
  { name: "Vue.js", icon: "vue", category: "web" },
  { name: "Redux", icon: "redux", category: "web" },
];

// Machine Learning & Data Science Skills
export const mlSkills: Skill[] = [
  { name: "Python", icon: "python", category: "ml" },
  { name: "Pandas", icon: "pandas", category: "ml" },
  { name: "NumPy", icon: "numpy", category: "ml" },
  { name: "Scikit-learn", icon: "scikitlearn", category: "ml" },
  { name: "Matplotlib", icon: "matplotlib", category: "ml" },
  { name: "Seaborn", icon: "seaborn", category: "ml" },
  { name: "TensorFlow", icon: "tensorflow", category: "ml" },
  { name: "Jupyter", icon: "jupyter", category: "ml" },
  { name: "SQL", icon: "sql", category: "ml" },
  { name: "Statistics", icon: "statistics", category: "ml" },
  { name: "Data Cleaning", icon: "datacleaning", category: "ml" },
  { name: "Feature Engineering", icon: "featureeng", category: "ml" },
  { name: "Regression", icon: "regression", category: "ml" },
  { name: "Neural Networks", icon: "neuralnet", category: "ml" },
];

// export const skillLevels = [
//   { name: "React", level: 90, order: 1 },
//   { name: "Next.js", level: 85, order: 2 },
//   { name: "TypeScript", level: 80, order: 3 },
//   { name: "JavaScript", level: 95, order: 4 },
//   { name: "Node.js", level: 80, order: 5 },
//   { name: "Tailwind CSS", level: 90, order: 6 },
//   { name: "PostgreSQL", level: 70, order: 7 },
//   { name: "MongoDB", level: 75, order: 8 },
//   { name: "GraphQL", level: 65, order: 9 },
//   { name: "Docker", level: 60, order: 10 },
//   { name: "AWS", level: 55, order: 11 },
//   { name: "Git", level: 90, order: 12 },
//   { name: "Figma", level: 75, order: 13 },
//   { name: "Vue.js", level: 60, order: 14 },
//   { name: "Redux", level: 70, order: 15 },
//   // ML & Data Science Skills
//   { name: "Python", level: 90, order: 16 },
//   { name: "Pandas", level: 85, order: 17 },
//   { name: "NumPy", level: 85, order: 18 },
//   { name: "Scikit-learn", level: 80, order: 19 },
//   { name: "Matplotlib", level: 80, order: 20 },
//   { name: "Seaborn", level: 75, order: 21 },
//   { name: "TensorFlow", level: 70, order: 22 },
//   { name: "Jupyter", level: 90, order: 23 },
//   { name: "SQL", level: 80, order: 24 },
//   { name: "Statistics", level: 75, order: 25 },
//   { name: "Data Cleaning", level: 85, order: 26 },
//   { name: "Feature Engineering", level: 75, order: 27 },
//   { name: "Regression", level: 80, order: 28 },
//   { name: "Neural Networks", level: 70, order: 29 },
// ];
// Combined skills for backward compatibility
export const skills = [...webDevSkills, ...mlSkills];

// Flat list (optional, if you still use it elsewhere)
// export const skills = [...webDevSkills, ...mlSkills];

// Fallback that matches the API response
export const fallbackSkills = {
  skills,
  // skillLevels: [] as SkillLevel[],
};
// satisfies { skills: Skill[]; skillLevels: SkillLevel[] };
