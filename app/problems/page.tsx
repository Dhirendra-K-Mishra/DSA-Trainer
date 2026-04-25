type Problem = {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    topic: {
        title: string;
        slug: string;
    };
};
async function getProblems(): Promise<Problem[]> {
    const res = await fetch("http://localhost:3000/api/problems", { cache: "no-store",});
    const json = await res.json();
    return json.data;
}
export default async function ProblemsPage() {
    const problems = await getProblems();

    return (
        <main style={{ padding: "24px" }}>
            <h1>Problems</h1>
            <ul style= {{marginTop: "16px"}}>
                {problems.map((problem) => (
                    <li key = {problem.id} style = {{ marginBottom: "12px"}}>
                        <a
                            href={`/problems/${problem.slug}`}
                            style={{ fontWeight: "bold", textDecoration: "none", color: "blue" }}
                        >
                        {problem.title}
                        </a>{" "}
                        <span>({problem.difficulty})</span>{" "}
                        <span>- {problem.topic.title}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}