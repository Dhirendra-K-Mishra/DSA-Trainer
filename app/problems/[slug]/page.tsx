import SubmitBox from "./SubmitBox";

type Problem = {
  title: string;
  statement: string;
  difficulty: string;
  topic: {
    title: string;
    slug: string;
  };
  testcases: {
    input: string;
    output: string;
  }[];
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProblem(slug: string): Promise<Problem> {
  const res = await fetch(`http://localhost:3000/api/problems/${slug}`, {
    cache: "no-store",
  });

  const json = await res.json();
  return json.data;
}

export default async function ProblemPage({ params }: Props) {
    const {slug} = await params;
    const problem = await getProblem(slug);

  return (
    <main style={{ padding: "24px", maxWidth: "800px" }}>
      <h1>{problem.title}</h1>

      <p style={{ marginTop: "8px", color: "gray" }}>
        Difficulty: <strong>{problem.difficulty}</strong> · Topic:{" "}
        <strong>{problem.topic.title}</strong>
      </p>

      <hr style={{ margin: "16px 0" }} />

      <section>
        <h2>Problem Statement</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{problem.statement}</p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Sample Testcases</h2>

        {problem.testcases.length === 0 && <p>No sample testcases.</p>}

        {problem.testcases.map((tc, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginTop: "12px",
            }}
          >
            <p>
              <strong>Input:</strong>
            </p>
            <pre>{tc.input}</pre>

            <p>
              <strong>Output:</strong>
            </p>
            <pre>{tc.output}</pre>
          </div>
        ))}
      </section>
      <SubmitBox problemSlug={slug} />
    </main>
  );
}
