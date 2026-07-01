const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const demoUser = await prisma.user.upsert({
    where: {
      email: "demo@example.com",
    },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      password: "temp-password",
      role: "user",
    },
  });

  console.log("✅ Demo user seeded");
  console.log("User ID:", demoUser.id);
  console.log("Seeding started...");
  const topics = [
    { title: "Arrays", slug: "arrays", order: 1 },
    { title: "Linked Lists", slug: "linked-lists", order: 2 },
    { title: "Trees", slug: "trees", order: 3 },
    { title: "Dynamic Programming", slug: "dynamic-programming", order: 4 },
    { title: "Stack", slug: "stack", order: 5 },
  ];

  for (const topic of topics) {
    console.log("Inserting:", topic.slug);
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
  }
  console.log("✅ Topics seeded");
  const arraysTopic = await prisma.topic.findUnique({
    where: { slug: "arrays" },
  });
  const treesTopic = await prisma.topic.findUnique({
    where: { slug: "trees" },
  });
  console.log(arraysTopic);
  console.log(treesTopic);
  const problems = [
    {
      title: "Two Sum",
      slug: "two-sum",
      statement:
        "Given an array of integers, return indices of the two numbers such that they sum to a specific target.",
      topicId: arraysTopic.id,
    },
    {
      title: "Best Time to Buy and Sell Stock",
      slug: "best-time-to-buy-and-sell-stock",
      statement:
        "Given an array where prices[i] represents the price of a stock on the ith day, return the maximum profit that can be achieved by buying once and selling once.",
      topicId: arraysTopic.id,
    },
    {
      title: "Contains Duplicate",
      slug: "contains-duplicate",
      statement:
        "Given an integer array, return true if any value appears at least twice, otherwise return false.",
      topicId: arraysTopic.id,
    },
    {
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      statement:
        "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
      topicId: arraysTopic.id,
    },
    {
      title: "Maximum Depth of Binary Tree",
      slug: "maximum-depth-binary-tree",
      statement: "Given the root of a binary tree, return its maximum depth.",
      topicId: treesTopic.id,
    },
  ];
  for (const problem of problems) {
    console.log("Inserting problem:", problem.slug);

    try {
      await prisma.problem.upsert({
        where: { slug: problem.slug },
        update: {},
        create: problem,
      });

      console.log("✓ Inserted:", problem.slug);
    } catch (err) {
      console.error("✗ Failed:", problem.slug);
      console.error(err);
      throw err;
    }
  }
  console.log("Problems seeded");
  console.log(await prisma.problem.findMany());
  const twoSumProblem = await prisma.problem.findUnique({
    where: { slug: "two-sum" },
  });

  const stockProblem = await prisma.problem.findUnique({
    where: { slug: "best-time-to-buy-and-sell-stock" },
  });

  const duplicateProblem = await prisma.problem.findUnique({
    where: { slug: "contains-duplicate" },
  });

  const maxSubarrayProblem = await prisma.problem.findUnique({
    where: { slug: "maximum-subarray" },
  });

  const treeProblem = await prisma.problem.findUnique({
    where: { slug: "maximum-depth-binary-tree" },
  });

  if (
    !twoSumProblem ||
    !stockProblem ||
    !duplicateProblem ||
    !maxSubarrayProblem ||
    !treeProblem
  ) {
    throw new Error("One or more problems were not found.");
  }
  if (!twoSumProblem) {
    throw new Error("Two Sum problem not found");
  }
  const testcases = [
    // ==========================
    // Two Sum
    // ==========================
    {
      input: "[2,7,11,15]\n9",
      output: "[0,1]",
      isSample: true,
      problemId: twoSumProblem.id,
    },
    {
      input: "[3,2,4]\n6",
      output: "[1,2]",
      isSample: false,
      problemId: twoSumProblem.id,
    },
    {
      input: "[3,3]\n6",
      output: "[0,1]",
      isSample: false,
      problemId: twoSumProblem.id,
    },
    {
      input: "[1,5,8,10]\n9",
      output: "[0,2]",
      isSample: false,
      problemId: twoSumProblem.id,
    },
    {
      input: "[0,4,3,0]\n0",
      output: "[0,3]",
      isSample: false,
      problemId: twoSumProblem.id,
    },

    // ==========================
    // Best Time to Buy and Sell Stock
    // ==========================
    {
      input: "[7,1,5,3,6,4]",
      output: "5",
      isSample: true,
      problemId: stockProblem.id,
    },
    {
      input: "[7,6,4,3,1]",
      output: "0",
      isSample: false,
      problemId: stockProblem.id,
    },
    {
      input: "[1,2,3,4,5]",
      output: "4",
      isSample: false,
      problemId: stockProblem.id,
    },
    {
      input: "[2,4,1]",
      output: "2",
      isSample: false,
      problemId: stockProblem.id,
    },
    {
      input: "[3,2,6,5,0,3]",
      output: "4",
      isSample: false,
      problemId: stockProblem.id,
    },

    // ==========================
    // Contains Duplicate
    // ==========================
    {
      input: "[1,2,3,1]",
      output: "true",
      isSample: true,
      problemId: duplicateProblem.id,
    },
    {
      input: "[1,2,3,4]",
      output: "false",
      isSample: false,
      problemId: duplicateProblem.id,
    },
    {
      input: "[1,1,1,3,3,4]",
      output: "true",
      isSample: false,
      problemId: duplicateProblem.id,
    },
    {
      input: "[]",
      output: "false",
      isSample: false,
      problemId: duplicateProblem.id,
    },
    {
      input: "[-1,-1]",
      output: "true",
      isSample: false,
      problemId: duplicateProblem.id,
    },

    // ==========================
    // Maximum Subarray
    // ==========================
    {
      input: "[-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      isSample: true,
      problemId: maxSubarrayProblem.id,
    },
    {
      input: "[1]",
      output: "1",
      isSample: false,
      problemId: maxSubarrayProblem.id,
    },
    {
      input: "[5,4,-1,7,8]",
      output: "23",
      isSample: false,
      problemId: maxSubarrayProblem.id,
    },
    {
      input: "[-1,-2,-3]",
      output: "-1",
      isSample: false,
      problemId: maxSubarrayProblem.id,
    },
    {
      input: "[2,-1,2,3,4,-5]",
      output: "10",
      isSample: false,
      problemId: maxSubarrayProblem.id,
    },

    // ==========================
    // Maximum Depth of Binary Tree
    // ==========================
    {
      input: "[3,9,20,null,null,15,7]",
      output: "3",
      isSample: true,
      problemId: treeProblem.id,
    },
    {
      input: "[1,null,2]",
      output: "2",
      isSample: false,
      problemId: treeProblem.id,
    },
    {
      input: "[]",
      output: "0",
      isSample: false,
      problemId: treeProblem.id,
    },
    {
      input: "[1]",
      output: "1",
      isSample: false,
      problemId: treeProblem.id,
    },
    {
      input: "[1,2,3,4,5]",
      output: "3",
      isSample: false,
      problemId: treeProblem.id,
    },
  ];
  await prisma.testcase.createMany({
    data: testcases,
    skipDuplicates: true,
  });
  console.log("Testcase seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
