const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding started...");
    const topics = [
    { title: "Arrays", slug: "arrays", order: 1 },
    { title: "Linked Lists", slug: "linked-lists", order: 2 },
    { title: "Trees", slug: "trees", order: 3 },
    { title: "Dynamic Programming", slug: "dynamic-programming", order: 4 },
    { title: "Stack", slug: "stack", order: 5}
    ];

    for(const topic of topics) {
        console.log("Inserting:", topic.slug);
        await prisma.topic.upsert({
            where: { slug: topic.slug },
            update: {},
            create: topic
        });
    }
    console.log("✅ Topics seeded");
    const arraysTopic = await prisma.topic.findUnique({
        where: {slug: "arrays"}
    });
    console.log(arraysTopic);
    const problems = [
        {
            title: "Two Sum",
            slug: "two-sum",
            statement: "Given an array of integers, return indices of the two number such that they sum up to a specific target.",
            topicId: arraysTopic.id
        }
    ];
    for (const problem of problems) {
        await prisma.problem.upsert({
            where: { slug: problem.slug },
            update: {},
            create: problem
        });
    }
    console.log("Problems seeded");
    const twoSumProblem = await  prisma.problem.findUnique({
        where: {slug: "two-sum"}
    });
    if (!twoSumProblem){
        throw new Error("Two Sum problem not found");
    }
    const testcases = [
        {
            input: "[2,7,11,15]\n9",
            output: "[0,1]",
            isSample: true,
            problemId: twoSumProblem.id
        },
        {
            input: "[3,2,4]\n6",
            output: "[1,2]",
            isSample: false,
            problemId: twoSumProblem.id
        }
    ];
    await prisma.testcase.createMany({
        data: testcases,
        skipDuplicates: true
    });
    console.log("Testcase seeded");
}

main()
    .catch((e) =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () =>{
        await prisma.$disconnect();
    });
    
