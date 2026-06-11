const STAGES = new Set(["triage", "review", "prove", "record", "resume"]);

const PROMPTS = {
  triage: {
    codex: "$loop-triage read loop-state.md and loop-contract.md, select one bounded task, name the proof command, and update Active Task.",
    claude: "/loop-triage read loop-state.md and loop-contract.md, select one bounded task, name the proof command, and update Active Task."
  },
  review: {
    codex: "$loop-review read loop-state.md, loop-contract.md, and the current diff. Report blocking findings before proof.",
    claude: "/loop-review read loop-state.md, loop-contract.md, and the current diff. Report blocking findings before proof."
  },
  prove: {
    codex: "$loop-prove run the proof command recorded in loop-state.md, read the output, and record the result.",
    claude: "/loop-prove run the proof command recorded in loop-state.md, read the output, and record the result."
  },
  record: {
    codex: "$loop-record update loop-state.md and loop-decisions.md with the result, residual risk, and next action.",
    claude: "/loop-record update loop-state.md and loop-decisions.md with the result, residual risk, and next action."
  },
  resume: {
    codex: "Read loop-state.md and loop-contract.md. If Active Task is empty, invoke $loop-triage. If a task is active, continue from the recorded stage and stop at the next gate.",
    claude: "Read loop-state.md and loop-contract.md. If Active Task is empty, invoke /loop-triage. If a task is active, continue from the recorded stage and stop at the next gate."
  }
};

function renderPrompt({ agent = "both", stage = "triage" }) {
  if (!STAGES.has(stage)) {
    throw new Error(`Invalid --stage value: ${stage}`);
  }

  const targets = agent === "both" ? ["codex", "claude"] : [agent];
  return targets
    .map((target) => `${labelFor(target)}:\n${PROMPTS[stage][target]}`)
    .join("\n\n");
}

function labelFor(agent) {
  return agent === "codex" ? "Codex" : "Claude";
}

module.exports = {
  PROMPTS,
  STAGES,
  renderPrompt
};
