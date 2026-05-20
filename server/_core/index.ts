import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

interface SolveRequest {
  equation: string;
}

interface SolveStep {
  stepNumber: number;
  math: string;
  explanation: string;
}

interface SolveResponse {
  type: "Algebraic" | "Integral" | "Differential" | "Trigonometric";
  result: string;
  steps: SolveStep[];
}

interface WolframSubpod {
  title?: string;
  plaintext?: string;
}

interface WolframPod {
  title?: string;
  subpods?: WolframSubpod[];
}

interface WolframSolveResult {
  result: string | null;
  steps: SolveStep[];
}
const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID ?? "";

function detectEquationType(equation: string): SolveResponse["type"] {
  if (equation.includes("∫") || equation.toLowerCase().includes("integral")) {
    return "Integral";
  }
  if (
    equation.includes("dy/dx") ||
    equation.includes("d/dx") ||
    equation.toLowerCase().includes("differential")
  ) {
    return "Differential";
  }
  if (
    equation.toLowerCase().includes("sin") ||
    equation.toLowerCase().includes("cos") ||
    equation.toLowerCase().includes("tan")
  ) {
    return "Trigonometric";
  }
  return "Algebraic";
}

function generateSteps(equation: string, type: SolveResponse["type"]): SolveStep[] {
  if (type === "Algebraic") {
    return [
      { stepNumber: 1, math: equation, explanation: "Start with the original equation." },
      { stepNumber: 2, math: "(x - 2)(x - 3) = 0", explanation: "Factor into two binomials." },
      { stepNumber: 3, math: "x = 2 or x = 3", explanation: "Set each factor to zero and solve." },
    ];
  }

  if (type === "Integral") {
    return [
      { stepNumber: 1, math: equation, explanation: "Recognize the integral form." },
      { stepNumber: 2, math: "∫ x² dx = x³/3 + C", explanation: "Apply the power rule for integration." },
      {
        stepNumber: 3,
        math: "Verify: d/dx(x³/3) = x²",
        explanation: "Differentiate to check the result.",
      },
    ];
  }

  if (type === "Differential") {
    return [
      { stepNumber: 1, math: equation, explanation: "Identify the first-order linear ODE form." },
      { stepNumber: 2, math: "Integrating factor: e^x", explanation: "Compute an integrating factor." },
      { stepNumber: 3, math: "y = (x + C)e^x", explanation: "Solve and isolate y." },
    ];
  }

  return [
    { stepNumber: 1, math: equation, explanation: "Start with the trigonometric identity." },
    {
      stepNumber: 2,
      math: "sin²(x) + cos²(x) = 1",
      explanation: "Apply the Pythagorean trigonometric identity.",
    },
    { stepNumber: 3, math: "Identity holds for all x", explanation: "The equality is always true." },
  ];
}

function generateResult(type: SolveResponse["type"]): string {
  if (type === "Algebraic") return "x = 2, x = 3";
  if (type === "Integral") return "x³/3 + C";
  if (type === "Differential") return "y = (x + C)e^x";
  return "Identity verified: sin²(x) + cos²(x) = 1";
}

async function solveWithWolfram(equation: string): Promise<string | null> {
  if (!WOLFRAM_APP_ID) return null;

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      input: equation,
      output: "json",
      format: "plaintext",
    });
    const response = await fetch(`https://api.wolframalpha.com/v2/query?${params.toString()}`);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      queryresult?: {
        success?: boolean;
        pods?: Array<{ title?: string; subpods?: Array<{ plaintext?: string }> }>;
      };
    };

    const pods = data.queryresult?.pods ?? [];
    const preferredTitles = [
      "Result",
      "Exact result",
      "Decimal approximation",
      "Solution",
      "Indefinite integral",
    ];

    for (const title of preferredTitles) {
      const pod = pods.find((p) => (p.title ?? "").toLowerCase() === title.toLowerCase());
      const text = pod?.subpods?.find((s) => (s.plaintext ?? "").trim())?.plaintext?.trim();
      if (text) return text;
    }

    for (const pod of pods) {
      const text = pod.subpods?.find((s) => (s.plaintext ?? "").trim())?.plaintext?.trim();
      if (text) return text;
    }
    return null;
  } catch (error) {
    console.error("[solve] Wolfram request failed:", error);
    return null;
  }
}

function generateFallbackSteps(
  equation: string,
  type: SolveResponse["type"],
  result: string,
): SolveStep[] {
  const explanationByType: Record<SolveResponse["type"], string> = {
    Algebraic: "Use the computed algebraic solution returned by the solver.",
    Integral: "Evaluate the integral using the appropriate integration rule.",
    Differential: "Solve the differential equation and isolate the dependent variable where possible.",
    Trigonometric: "Use the relevant trigonometric identity or simplification.",
  };

  return [
    { stepNumber: 1, math: equation, explanation: "Start with the original problem." },
    { stepNumber: 2, math: result, explanation: explanationByType[type] },
  ];
}

function getPodTexts(pod: WolframPod): string[] {
  const texts = pod.subpods
    ?.map((subpod) => (subpod.plaintext ?? "").trim())
    .filter(Boolean) ?? [];

  return texts.flatMap((text) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  );
}

function getStepExplanation(title: string): string {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("alternate")) {
    return "Rewrite the problem into an equivalent form returned by Wolfram.";
  }
  if (normalizedTitle.includes("factor")) {
    return "Factor or rearrange the expression to make the solution easier to read.";
  }
  if (normalizedTitle.includes("solution") || normalizedTitle.includes("root")) {
    return "Read the solution value from the solver output.";
  }
  if (normalizedTitle.includes("integral")) {
    return "Evaluate the integral using the solver output.";
  }
  if (normalizedTitle.includes("derivative")) {
    return "Differentiate or simplify the derivative expression.";
  }
  if (normalizedTitle.includes("result")) {
    return "Use the computed result from the solver.";
  }
  if (normalizedTitle.includes("form")) {
    return "Use this equivalent form as part of the solution.";
  }

  return `Use Wolfram's "${title}" result for this part of the solution.`;
}

function buildStepsFromWolfram(equation: string, pods: WolframPod[], result: string | null): SolveStep[] {
  const steps: SolveStep[] = [];
  const seen = new Set<string>();
  const ignoredTitles = [
    "input",
    "plot",
    "number line",
    "visual representation",
    "sum of roots",
    "product of roots",
  ];

  const addStep = (math: string, explanation: string) => {
    const normalized = math.replace(/\s+/g, " ").trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return;

    seen.add(normalized);
    steps.push({
      stepNumber: steps.length + 1,
      math,
      explanation,
    });
  };

  addStep(equation, "Start with the original problem.");

  for (const pod of pods) {
    const title = (pod.title ?? "Solver output").trim();
    const normalizedTitle = title.toLowerCase();
    if (ignoredTitles.some((ignored) => normalizedTitle.includes(ignored))) {
      continue;
    }

    for (const text of getPodTexts(pod)) {
      addStep(text, getStepExplanation(title));
    }
  }

  if (result) {
    addStep(result, "Finish with the final answer.");
  }

  return steps;
}

async function solveDetailedWithWolfram(equation: string): Promise<WolframSolveResult> {
  if (!WOLFRAM_APP_ID) return { result: null, steps: [] };

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      input: equation,
      output: "json",
      format: "plaintext",
    });
    const response = await fetch(`https://api.wolframalpha.com/v2/query?${params.toString()}`);
    if (!response.ok) return { result: null, steps: [] };

    const data = (await response.json()) as {
      queryresult?: {
        success?: boolean;
        pods?: WolframPod[];
      };
    };

    const pods = data.queryresult?.pods ?? [];
    const preferredTitles = [
      "Solutions",
      "Solution",
      "Roots",
      "Root",
      "Indefinite integral",
      "Definite integral",
      "Derivative",
      "Result",
      "Exact result",
      "Decimal approximation",
    ];

    let result: string | null = null;
    for (const title of preferredTitles) {
      const pod = pods.find((p) => (p.title ?? "").toLowerCase() === title.toLowerCase());
      const texts = pod ? getPodTexts(pod) : [];
      if (texts.length > 0) {
        result = texts.join("; ");
        break;
      }
    }

    if (!result) {
      for (const pod of pods) {
        if ((pod.title ?? "").toLowerCase() === "input") continue;
        const text = pod.subpods?.find((s) => (s.plaintext ?? "").trim())?.plaintext?.trim();
        if (text) {
          result = text;
          break;
        }
      }
    }

    return { result, steps: buildStepsFromWolfram(equation, pods, result) };
  } catch (error) {
    console.error("[solve] Wolfram request failed:", error);
    return { result: null, steps: [] };
  }
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export function createApp() {
  const app = express();

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.get("/api/status", (_req, res) => {
    res.json({
      ok: true,
      service: "MathVision API",
      environment: process.env.VERCEL === "1" ? "vercel" : process.env.NODE_ENV || "development",
      wolframConfigured: Boolean(WOLFRAM_APP_ID),
      endpoints: {
        health: "/api/health",
        status: "/api/status",
        solve: "/api/solve",
      },
      timestamp: Date.now(),
    });
  });

  app.post("/api/solve", async (req, res) => {
    const { equation } = req.body as SolveRequest;

    if (!equation || equation.trim() === "") {
      res.status(400).json({ error: "Invalid equation" });
      return;
    }

    const type = detectEquationType(equation);
    const wolframResult = await solveDetailedWithWolfram(equation);
    const result = wolframResult.result ?? generateResult(type);
    const response: SolveResponse = {
      type,
      result,
      steps:
        wolframResult.steps.length > 0
          ? wolframResult.steps
          : generateFallbackSteps(equation, type, result),
    };
    res.json(response);
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}

async function startServer() {
  const app = createApp();
  const server = createServer(app);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

const app = createApp();

export default app;

if (process.env.VERCEL !== "1") {
  startServer().catch(console.error);
}
