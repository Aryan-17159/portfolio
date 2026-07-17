require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Skill = require('./models/Skill');

const projects = [
  {
    title: 'CareerAI Coach',
    slug: 'careerai-coach',
    summary: 'AI-powered career assistant for resume analysis, interview prep, and salary intelligence.',
    description: 'A single-file web app powered by the Claude API. Analyzes resumes against job descriptions, generates tailored interview Q&A, drafts cover letters, and surfaces salary benchmarks.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Claude API'],
    pipeline: ['Code', 'Build', 'Test', 'Deploy', 'Live'],
    status: 'live',
    repoUrl: '',
    liveUrl: '',
    featured: true,
    order: 1
  },
  {
    title: 'RD INFRO Android App',
    slug: 'rd-infro-android-app',
    summary: '8-module Android app built during internship covering auth, networking, and push notifications.',
    description: 'Kotlin app implementing Firebase authentication, RecyclerView lists, Retrofit networking, Firebase Cloud Messaging, and a signed release APK build pipeline.',
    stack: ['Kotlin', 'Firebase', 'Retrofit', 'Android Studio'],
    pipeline: ['Code', 'Build', 'Test', 'Sign APK', 'Release'],
    status: 'live',
    repoUrl: '',
    liveUrl: '',
    featured: true,
    order: 2
  },
  {
    title: 'AI Notes (React Clone)',
    slug: 'ai-notes-react-clone',
    summary: 'A React-based notes app clone with AI-assisted summarization.',
    description: 'Rebuilt a notes-taking product in React to practice component architecture, state management, and integrating an LLM for note summarization.',
    stack: ['React', 'Node.js', 'MongoDB'],
    pipeline: ['Code', 'Build', 'Test', 'Deploy'],
    status: 'in-progress',
    repoUrl: '',
    liveUrl: '',
    featured: true,
    order: 3
  }
];

const skills = [
  { name: 'Python', category: 'language', level: 85, order: 1 },
  { name: 'Kotlin', category: 'language', level: 75, order: 2 },
  { name: 'JavaScript', category: 'language', level: 80, order: 3 },
  { name: 'Node.js', category: 'framework', level: 75, order: 1 },
  { name: 'Express', category: 'framework', level: 75, order: 2 },
  { name: 'Scikit-learn', category: 'framework', level: 65, order: 3 },
  { name: 'MongoDB', category: 'database', level: 70, order: 1 },
  { name: 'MySQL', category: 'database', level: 70, order: 2 },
  { name: 'Firebase', category: 'database', level: 75, order: 3 },
  { name: 'Docker', category: 'infra', level: 60, order: 1 },
  { name: 'OCI DevOps', category: 'infra', level: 70, order: 2 },
  { name: 'Git/GitHub', category: 'tool', level: 85, order: 1 },
  { name: 'Android Studio', category: 'tool', level: 75, order: 2 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Seeding...');

    await Project.deleteMany({});
    await Skill.deleteMany({});

    await Project.insertMany(projects);
    await Skill.insertMany(skills);

    console.log(`Seeded ${projects.length} projects and ${skills.length} skills.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
