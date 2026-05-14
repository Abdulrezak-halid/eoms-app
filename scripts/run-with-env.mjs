import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");

if (separatorIndex === -1 || separatorIndex === args.length - 1) {
  console.error("Usage: node scripts/run-with-env.mjs KEY=value -- command [args...]");
  process.exit(1);
}

const env = { ...process.env };

for (const pair of args.slice(0, separatorIndex)) {
  const equalsIndex = pair.indexOf("=");

  if (equalsIndex <= 0) {
    console.error(`Invalid environment assignment: ${pair}`);
    process.exit(1);
  }

  env[pair.slice(0, equalsIndex)] = pair.slice(equalsIndex + 1);
}

const [command, ...commandArgs] = args.slice(separatorIndex + 1);
const child = spawn(command, commandArgs, {
  env,
  shell: true,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Command terminated with signal ${signal}`);
    process.exit(1);
  }

  process.exit(code ?? 0);
});
