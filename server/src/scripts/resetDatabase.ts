import "dotenv/config";
import mongoose from "mongoose";

import Skill, { type SkillDomain } from "../models/Skill.js";
import Topic from "../models/Topic.js";
import SkillDependency from "../models/SkillDependency.js";
import DSATopic from "../models/DSATopic.js";
import DSAProblem from "../models/DSAProblem.js";

const RESET_CONFIRMATION = "seed-fresh-data";

const skills: Array<{
  name: string;
  slug: string;
  domain: SkillDomain;
  icon: string;
  description: string;
}> = [
  { name: "Git & GitHub", slug: "git-github", domain: "development", icon: "G", description: "Track changes, collaborate safely, and ship work with a professional Git workflow." },
  { name: "HTML & CSS", slug: "html-css", domain: "development", icon: "H", description: "Build accessible, responsive interfaces with semantic HTML and modern CSS." },
  { name: "JavaScript", slug: "javascript", domain: "development", icon: "J", description: "Master the language behind interactive web applications." },
  { name: "TypeScript", slug: "typescript", domain: "development", icon: "T", description: "Write safer, more maintainable JavaScript with practical types." },
  { name: "React", slug: "react", domain: "development", icon: "R", description: "Create component-driven interfaces with state, effects, and reusable patterns." },
  { name: "Node.js & APIs", slug: "nodejs-apis", domain: "development", icon: "N", description: "Build dependable backend services, REST APIs, and authentication flows." },
  { name: "SQL & PostgreSQL", slug: "sql-postgresql", domain: "development", icon: "S", description: "Model data and write efficient queries for production applications." },
  { name: "Docker & Deployment", slug: "docker-deployment", domain: "development", icon: "D", description: "Package applications, manage environments, and deploy reliably." },
  { name: "Data Structures & Algorithms", slug: "data-structures-algorithms", domain: "dsa", icon: "A", description: "Develop problem-solving fluency with essential patterns and complexity analysis." },
  { name: "System Design", slug: "system-design", domain: "system-design", icon: "S", description: "Design scalable, resilient systems by making clear architecture tradeoffs." },
  { name: "Python", slug: "python", domain: "machine-learning", icon: "P", description: "Use Python confidently for automation, data work, and machine learning." },
  { name: "Machine Learning Foundations", slug: "machine-learning-foundations", domain: "machine-learning", icon: "M", description: "Understand supervised learning, evaluation, and how to deliver useful ML features." },
];

const topicSeeds: Array<{ skillSlug: string; name: string; slug: string; description: string }> = [
  { skillSlug: "git-github", name: "Repositories & commits", slug: "repositories-commits", description: "Initialize repositories, stage intentional changes, and write useful commit messages." },
  { skillSlug: "git-github", name: "Branches & pull requests", slug: "branches-pull-requests", description: "Use focused branches and review changes through pull requests." },
  { skillSlug: "git-github", name: "Merge conflicts", slug: "merge-conflicts", description: "Resolve conflicts with confidence and preserve both intended changes." },
  { skillSlug: "html-css", name: "Semantic HTML", slug: "semantic-html", description: "Structure pages with meaningful elements and accessible landmarks." },
  { skillSlug: "html-css", name: "Layout with Flexbox & Grid", slug: "flexbox-grid", description: "Create adaptable layouts for real product interfaces." },
  { skillSlug: "html-css", name: "Responsive & accessible UI", slug: "responsive-accessible-ui", description: "Design for different screens, keyboard users, and readable content." },
  { skillSlug: "javascript", name: "Core language", slug: "core-language", description: "Work with values, functions, arrays, objects, and modules." },
  { skillSlug: "javascript", name: "Async JavaScript", slug: "async-javascript", description: "Handle promises, async/await, network requests, and errors." },
  { skillSlug: "javascript", name: "DOM & browser APIs", slug: "dom-browser-apis", description: "Build interactive experiences with browser capabilities." },
  { skillSlug: "typescript", name: "Types & narrowing", slug: "types-narrowing", description: "Model data accurately and narrow unknown values safely." },
  { skillSlug: "typescript", name: "Interfaces & generics", slug: "interfaces-generics", description: "Create reusable APIs with expressive type contracts." },
  { skillSlug: "typescript", name: "Practical TypeScript", slug: "practical-typescript", description: "Apply strict TypeScript in a production frontend or backend." },
  { skillSlug: "react", name: "Components & props", slug: "components-props", description: "Compose interfaces from small, focused components." },
  { skillSlug: "react", name: "State & events", slug: "state-events", description: "Build predictable interactive UI with local state." },
  { skillSlug: "react", name: "Effects & data fetching", slug: "effects-data-fetching", description: "Synchronize with APIs and manage loading, errors, and caching." },
  { skillSlug: "nodejs-apis", name: "Express fundamentals", slug: "express-fundamentals", description: "Build routes, middleware, and consistent HTTP responses." },
  { skillSlug: "nodejs-apis", name: "Authentication & security", slug: "authentication-security", description: "Protect sessions, validate inputs, and apply secure defaults." },
  { skillSlug: "nodejs-apis", name: "API design", slug: "api-design", description: "Design clear resources, status codes, validation, and error handling." },
  { skillSlug: "sql-postgresql", name: "Relational modeling", slug: "relational-modeling", description: "Model entities, relationships, and constraints." },
  { skillSlug: "sql-postgresql", name: "Queries & joins", slug: "queries-joins", description: "Retrieve and combine data accurately and efficiently." },
  { skillSlug: "sql-postgresql", name: "Indexes & performance", slug: "indexes-performance", description: "Use indexes and query plans to keep applications responsive." },
  { skillSlug: "docker-deployment", name: "Containers", slug: "containers", description: "Build reproducible images and compose local services." },
  { skillSlug: "docker-deployment", name: "CI/CD basics", slug: "ci-cd-basics", description: "Automate quality checks and safe delivery." },
  { skillSlug: "docker-deployment", name: "Production operations", slug: "production-operations", description: "Handle configuration, observability, and dependable releases." },
  { skillSlug: "data-structures-algorithms", name: "Complexity analysis", slug: "complexity-analysis", description: "Choose approaches using time and space complexity." },
  { skillSlug: "data-structures-algorithms", name: "Core data structures", slug: "core-data-structures", description: "Use arrays, hash maps, trees, graphs, stacks, and queues." },
  { skillSlug: "data-structures-algorithms", name: "Problem-solving patterns", slug: "problem-solving-patterns", description: "Recognize two pointers, sliding window, binary search, and dynamic programming." },
  { skillSlug: "system-design", name: "Requirements & estimates", slug: "requirements-estimates", description: "Turn ambiguous product requirements into useful constraints." },
  { skillSlug: "system-design", name: "Scalability patterns", slug: "scalability-patterns", description: "Use caching, queues, partitioning, and replication appropriately." },
  { skillSlug: "system-design", name: "Reliability & tradeoffs", slug: "reliability-tradeoffs", description: "Design for failure, observability, and explicit tradeoffs." },
  { skillSlug: "python", name: "Python fundamentals", slug: "python-fundamentals", description: "Use functions, collections, modules, and virtual environments." },
  { skillSlug: "python", name: "Data analysis", slug: "data-analysis", description: "Explore, clean, and transform data with practical workflows." },
  { skillSlug: "python", name: "Automation", slug: "automation", description: "Automate repeatable tasks with files, APIs, and scripts." },
  { skillSlug: "machine-learning-foundations", name: "Data preparation", slug: "data-preparation", description: "Prepare trustworthy training data and avoid leakage." },
  { skillSlug: "machine-learning-foundations", name: "Supervised learning", slug: "supervised-learning", description: "Train regression and classification models for concrete tasks." },
  { skillSlug: "machine-learning-foundations", name: "Evaluation & deployment", slug: "evaluation-deployment", description: "Evaluate models fairly and integrate them responsibly." },
];

const dsaTopics = [
  { name: "Arrays & Hashing", slug: "arrays-hashing", description: "Hash maps, sets, frequency counting, and array transformations." },
  { name: "Two Pointers", slug: "two-pointers", description: "Use converging or parallel pointers to reduce search space." },
  { name: "Sliding Window", slug: "sliding-window", description: "Maintain a moving range for substring and subarray problems." },
  { name: "Stack", slug: "stack", description: "Track nested structure, monotonic constraints, and deferred work." },
  { name: "Binary Search", slug: "binary-search", description: "Search sorted spaces and monotonic answer ranges." },
  { name: "Linked List", slug: "linked-list", description: "Manipulate pointers, reverse lists, and detect cycles." },
  { name: "Trees", slug: "trees", description: "Traverse trees recursively and iteratively." },
  { name: "Graphs", slug: "graphs", description: "Traverse connected state with BFS, DFS, and topological ordering." },
  { name: "Dynamic Programming", slug: "dynamic-programming", description: "Build optimal solutions from overlapping subproblems." },
  { name: "Heap & Priority Queue", slug: "heap-priority-queue", description: "Maintain a changing best set efficiently." },
];

const dsaProblems: Array<{ title: string; slug: string; platform: "leetcode"; difficulty: "easy" | "medium" | "hard"; url: string; topics: string[]; description: string }> = [
  { title: "Two Sum", slug: "two-sum", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/two-sum/", topics: ["arrays-hashing"], description: "Find a pair of values that adds up to a target." },
  { title: "Contains Duplicate", slug: "contains-duplicate", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/contains-duplicate/", topics: ["arrays-hashing"], description: "Determine whether an array contains a repeated value." },
  { title: "Valid Anagram", slug: "valid-anagram", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/valid-anagram/", topics: ["arrays-hashing"], description: "Compare character frequencies efficiently." },
  { title: "Group Anagrams", slug: "group-anagrams", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/group-anagrams/", topics: ["arrays-hashing"], description: "Group words with equivalent character counts." },
  { title: "Top K Frequent Elements", slug: "top-k-frequent-elements", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/top-k-frequent-elements/", topics: ["arrays-hashing", "heap-priority-queue"], description: "Find the most frequent values without sorting everything." },
  { title: "Valid Palindrome", slug: "valid-palindrome", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/valid-palindrome/", topics: ["two-pointers"], description: "Compare a string from both ends while skipping punctuation." },
  { title: "3Sum", slug: "3sum", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/3sum/", topics: ["arrays-hashing", "two-pointers"], description: "Find unique triplets that sum to zero." },
  { title: "Container With Most Water", slug: "container-with-most-water", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/container-with-most-water/", topics: ["two-pointers"], description: "Maximize area using two converging pointers." },
  { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", topics: ["arrays-hashing", "sliding-window"], description: "Track the best purchase price while scanning once." },
  { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", topics: ["sliding-window", "arrays-hashing"], description: "Maintain a window of unique characters." },
  { title: "Valid Parentheses", slug: "valid-parentheses", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/valid-parentheses/", topics: ["stack"], description: "Validate nested opening and closing brackets." },
  { title: "Daily Temperatures", slug: "daily-temperatures", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/daily-temperatures/", topics: ["stack"], description: "Use a monotonic stack to find the next warmer day." },
  { title: "Binary Search", slug: "binary-search", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/binary-search/", topics: ["binary-search"], description: "Find a target in a sorted array." },
  { title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", topics: ["binary-search"], description: "Search a sorted array split at an unknown pivot." },
  { title: "Reverse Linked List", slug: "reverse-linked-list", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/reverse-linked-list/", topics: ["linked-list"], description: "Reverse a singly linked list in place." },
  { title: "Linked List Cycle", slug: "linked-list-cycle", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/linked-list-cycle/", topics: ["linked-list", "two-pointers"], description: "Detect a cycle using fast and slow pointers." },
  { title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", topics: ["trees"], description: "Measure depth with recursive or iterative traversal." },
  { title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", topics: ["trees", "graphs"], description: "Traverse a tree one level at a time." },
  { title: "Number of Islands", slug: "number-of-islands", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/number-of-islands/", topics: ["graphs"], description: "Count connected components in a grid." },
  { title: "Course Schedule", slug: "course-schedule", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/course-schedule/", topics: ["graphs"], description: "Check whether prerequisite relationships contain a cycle." },
  { title: "Climbing Stairs", slug: "climbing-stairs", platform: "leetcode", difficulty: "easy", url: "https://leetcode.com/problems/climbing-stairs/", topics: ["dynamic-programming"], description: "Build the Fibonacci-style recurrence for a simple count problem." },
  { title: "House Robber", slug: "house-robber", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/house-robber/", topics: ["dynamic-programming"], description: "Optimize a choice under an adjacency constraint." },
  { title: "Coin Change", slug: "coin-change", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/coin-change/", topics: ["dynamic-programming"], description: "Find the fewest coins needed for a target amount." },
  { title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", platform: "leetcode", difficulty: "medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", topics: ["heap-priority-queue"], description: "Maintain the kth largest value with a heap." },
];

function getId(ids: Map<string, mongoose.Types.ObjectId>, slug: string): mongoose.Types.ObjectId {
  const id = ids.get(slug);
  if (!id) throw new Error(`Missing seeded record for ${slug}`);
  return id;
}

async function resetDatabase(): Promise<void> {
  if (process.env.SKILLTRACK_RESET_CONFIRM !== RESET_CONFIRMATION) {
    throw new Error(`Refusing to reset the database. Set SKILLTRACK_RESET_CONFIRM=${RESET_CONFIRMATION} to continue.`);
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not configured.");

  await mongoose.connect(mongoUri);
  if (!mongoose.connection.db) throw new Error("Database connection is unavailable.");

  await mongoose.connection.db.dropDatabase();

  const createdSkills = await Skill.insertMany(skills);
  const skillIds = new Map<string, mongoose.Types.ObjectId>(
    createdSkills.map((skill) => [skill.slug, skill._id as mongoose.Types.ObjectId])
  );

  const createdTopics = await Topic.insertMany(topicSeeds.map((topic, orderBySeed) => ({
    skillId: getId(skillIds, topic.skillSlug),
    name: topic.name,
    slug: topic.slug,
    description: topic.description,
    order: topicSeeds.filter((entry, index) => index < orderBySeed && entry.skillSlug === topic.skillSlug).length,
  })));

  const dependencies: Array<[string, string]> = [
    ["git-github", "html-css"], ["html-css", "javascript"], ["javascript", "typescript"],
    ["javascript", "react"], ["javascript", "nodejs-apis"], ["nodejs-apis", "docker-deployment"],
    ["nodejs-apis", "system-design"], ["sql-postgresql", "system-design"], ["python", "machine-learning-foundations"],
  ];
  const createdDependencies = await SkillDependency.insertMany(dependencies.map(([prerequisite, dependent]) => ({
    prerequisiteSkillId: getId(skillIds, prerequisite),
    dependentSkillId: getId(skillIds, dependent),
  })));

  const createdDSATopics = await DSATopic.insertMany(dsaTopics);
  const dsaTopicIds = new Map<string, mongoose.Types.ObjectId>(
    createdDSATopics.map((topic) => [topic.slug, topic._id as mongoose.Types.ObjectId])
  );
  const createdProblems = await DSAProblem.insertMany(dsaProblems.map((problem) => ({
    title: problem.title,
    slug: problem.slug,
    platform: problem.platform,
    difficulty: problem.difficulty,
    problemUrl: problem.url,
    topics: problem.topics.map((topic) => getId(dsaTopicIds, topic)),
    description: problem.description,
  })));

  console.log(JSON.stringify({
    reset: true,
    skills: createdSkills.length,
    topics: createdTopics.length,
    dependencies: createdDependencies.length,
    dsaTopics: createdDSATopics.length,
    dsaProblems: createdProblems.length,
    users: 0,
    roadmaps: 0,
    progressRecords: 0,
  }));
}

resetDatabase()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Database reset failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
