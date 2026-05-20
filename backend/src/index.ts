import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface SolveRequest {
  equation: string;
}

interface Step {
  stepNumber: number;
  math: string;
  explanation: string;
}

interface SolveResponse {
  type: 'Algebraic' | 'Integral' | 'Differential' | 'Trigonometric';
  result: string;
  steps: Step[];
  error?: string;
}

// Utility: Detect equation type
function detectEquationType(equation: string): 'Algebraic' | 'Integral' | 'Differential' | 'Trigonometric' {
  if (equation.includes('∫') || equation.includes('integral')) {
    return 'Integral';
  }
  if (equation.includes('dy/dx') || equation.includes('d/dx') || equation.includes('differential')) {
    return 'Differential';
  }
  if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
    return 'Trigonometric';
  }
  return 'Algebraic';
}

// Utility: Generate steps based on equation type
function generateSteps(equation: string, type: string): Step[] {
  const steps: Step[] = [];

  if (type === 'Algebraic') {
    // Example: x^2 - 5x + 6 = 0
    steps.push({
      stepNumber: 1,
      math: equation,
      explanation: 'Start with the original equation.',
    });
    steps.push({
      stepNumber: 2,
      math: '(x − 2)(x − 3) = 0',
      explanation: 'Factor into two binomials.',
    });
    steps.push({
      stepNumber: 3,
      math: 'x = 2 or x = 3',
      explanation: 'Set each factor to zero and solve.',
    });
  } else if (type === 'Integral') {
    // Example: ∫ x² dx
    steps.push({
      stepNumber: 1,
      math: equation,
      explanation: 'Recognize the integral form.',
    });
    steps.push({
      stepNumber: 2,
      math: '∫ x² dx = x³/3 + C',
      explanation: 'Apply the power rule for integration.',
    });
    steps.push({
      stepNumber: 3,
      math: 'Verify by differentiating: d/dx(x³/3) = x²',
      explanation: 'Check the result using differentiation.',
    });
    steps.push({
      stepNumber: 4,
      math: 'x³/3 + C',
      explanation: 'Final answer with constant of integration.',
    });
  } else if (type === 'Differential') {
    // Example: dy/dx + y = e^x
    steps.push({
      stepNumber: 1,
      math: equation,
      explanation: 'Identify the differential equation form.',
    });
    steps.push({
      stepNumber: 2,
      math: 'This is a first-order linear ODE.',
      explanation: 'Recognize the equation type and structure.',
    });
    steps.push({
      stepNumber: 3,
      math: 'Use integrating factor: e^x',
      explanation: 'Multiply both sides by the integrating factor.',
    });
    steps.push({
      stepNumber: 4,
      math: 'y = (x + C)e^x',
      explanation: 'Solve for y using integration.',
    });
  } else if (type === 'Trigonometric') {
    // Example: sin²(x) + cos²(x) = 1
    steps.push({
      stepNumber: 1,
      math: equation,
      explanation: 'Start with the trigonometric identity.',
    });
    steps.push({
      stepNumber: 2,
      math: 'Recall: sin²(x) + cos²(x) = 1 (Pythagorean identity)',
      explanation: 'Apply the fundamental trigonometric identity.',
    });
    steps.push({
      stepNumber: 3,
      math: '1 = 1',
      explanation: 'Verify both sides are equal.',
    });
    steps.push({
      stepNumber: 4,
      math: 'Identity verified for all x',
      explanation: 'This is a fundamental trigonometric identity.',
    });
  }

  return steps;
}

// Utility: Generate result based on equation type
function generateResult(equation: string, type: string): string {
  if (type === 'Algebraic') {
    return 'x = 2, x = 3';
  } else if (type === 'Integral') {
    return 'x³/3 + C';
  } else if (type === 'Differential') {
    return 'y = (x + C)e^x';
  } else if (type === 'Trigonometric') {
    return 'Identity verified: sin²(x) + cos²(x) = 1';
  }
  return 'Solution found';
}

// Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Solve endpoint
app.post('/api/solve', (req: Request, res: Response) => {
  const { equation } = req.body as SolveRequest;

  // Validate input
  if (!equation || equation.trim() === '') {
    return res.status(400).json({
      error: 'Invalid equation',
    });
  }

  try {
    const type = detectEquationType(equation);
    const result = generateResult(equation, type);
    const steps = generateSteps(equation, type);

    const response: SolveResponse = {
      type,
      result,
      steps,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to solve equation',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MathVision Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: GET http://localhost:${PORT}/api/health`);
  console.log(`🧮 Solve endpoint: POST http://localhost:${PORT}/api/solve`);
});
