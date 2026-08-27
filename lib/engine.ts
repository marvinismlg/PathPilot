import repositoryJobInputsData from "../data/jobinputs.json";
import repositoryJobOutputsData from "../data/joboutputs.json";
import repositoryCategoryInputsData from "../data/categoryinputs.json";
import repositoryCategoryOutputsData from "../data/categoryoutputs.json";

const JOB_QUESTION_WEIGHTS = {
  desired_outcomes: 0.89,
  desired_field: 1,
  grad_or_no: 0.95,
  education_requirement: 0.90,
  major_interest: 0.97,
  hard_skills: 0.80,
  soft_skills: 0.70,
  employee_type: 0.62,
  work_environment: 0.56,
  solo_or_people: 0.50,
  work_locations: 0.44,
  salary_band: 0.38,
  work_intensity: 0.32,
  general_talents: 0.27,
};

const CATEGORY_QUESTION_WEIGHTS = {
  desired_field: 1.00,
  desired_outcomes: 0.95,
  major_interest: 0.97,
  hard_skills: 0.82,
  soft_skills: 0.72,
  employee_type: 0.64,
  work_environment: 0.57,
  solo_or_people: 0.51,
  work_locations: 0.45,
  education_requirement: 0.39,
  grad_or_no: 0.32,
  salary_band: 0.28,
  work_intensity: 0.24,
  general_talents: 0.20,
};

const SCORING_FIELDS = [
  "desired_outcomes",
  "desired_field",
  "grad_or_no",
  "education_requirement",
  "major_interest",
  "hard_skills",
  "soft_skills",
  "employee_type",
  "work_environment",
  "solo_or_people",
  "work_locations",
  "salary_band",
  "work_intensity",
  "general_talents",
] as const;

type ScoreScope = "jobs" | "categories";
type QuestionWeights = Record<ScoringField, number>;
type FlexibleAnswerValue = string | readonly string[] | null | undefined;
type InternalScoreMode = "jobs" | "categories";
type Severity = "warning" | "error";

const TEXT_MULTI_FIELDS = new Set<ScoringField>([
  "hard_skills",
  "soft_skills",
  "general_talents",
  "work_locations",
]);

const EXACT_TAXONOMY_FIELDS = new Set<ScoringField>([
  "desired_outcomes",
  "desired_field",
  "grad_or_no",
  "major_interest",
  "employee_type",
  "work_environment",
  "solo_or_people",
]);

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const EDUCATION_ORDER = new Map<string, number>([
  ["high school", 0],
  ["associate", 1],
  ["bachelors", 2],
  ["special religious schooling", 2.5],
  ["masters", 3],
  ["phd", 4],
]);

const SALARY_ORDER = new Map<string, number>([
  ["low", 0],
  ["medium", 1],
  ["medium high", 2],
  ["high", 3],
  ["very high", 4],
]);

const LINEAR_WORK_INTENSITY_ORDER = new Map<string, number>([
  ["standard moderate", 0],
  ["moderately demanding", 1],
  ["high intensity", 2],
  ["very high intensity", 3],
  ["extreme competitive intensity", 4],
]);

export type ScoringField = (typeof SCORING_FIELDS)[number];

export interface WeightedScoringValue {
  id: string;
  weight: number;
}

export type AssessmentAnswers = Partial<Record<ScoringField, FlexibleAnswerValue>> &
  Record<string, unknown>;

export interface JobInputRecord {
  id: string;
  major_interest?: WeightedScoringValue[];
  desired_field?: WeightedScoringValue[];
  soft_skills?: string[];
  hard_skills?: string[];
  general_talents?: string[];
  employee_type?: WeightedScoringValue[];
  solo_or_people?: WeightedScoringValue[];
  work_environment?: WeightedScoringValue[];
  work_locations?: string[];
  desired_outcomes?: WeightedScoringValue[];
  work_intensity?: WeightedScoringValue[];
  grad_or_no?: WeightedScoringValue[];
  education_requirement?: string;
  salary_band?: string;
  [key: string]: unknown;
}

export interface CategoryInputRecord {
  id: string;
  major_interest?: WeightedScoringValue[];
  desired_field?: WeightedScoringValue[];
  soft_skills?: WeightedScoringValue[];
  hard_skills?: WeightedScoringValue[];
  general_talents?: WeightedScoringValue[];
  employee_type?: WeightedScoringValue[];
  solo_or_people?: WeightedScoringValue[];
  work_environment?: WeightedScoringValue[];
  work_locations?: WeightedScoringValue[];
  desired_outcomes?: WeightedScoringValue[];
  work_intensity?: WeightedScoringValue[];
  grad_or_no?: WeightedScoringValue[];
  education_requirement?: WeightedScoringValue[];
  salary_band?: WeightedScoringValue[];
  [key: string]: unknown;
}

export interface OutputRecord {
  id: string;
  [key: string]: unknown;
}

export interface EngineIssue {
  scope: ScoreScope;
  code: string;
  severity: Severity;
  message: string;
  details?: unknown;
}

export interface QuestionContributionDebug {
  applicable: boolean;
  questionWeight: number;
  matchScore: number | null;
  contribution: number;
  userSelections: string[];
  reason: "matched" | "candidate-missing";
}

export interface CandidateDebug {
  weightedPointsEarned: number;
  totalApplicableQuestionWeight: number;
  rawScore: number;
  chosenVariantIndex: number;
  variantCount: number;
  contributions: Partial<Record<ScoringField, QuestionContributionDebug>>;
}

export type ScoredOutputRecord<TOutput extends OutputRecord> = TOutput & {
  score: number;
  rank: number;
  debug: CandidateDebug;
};

export interface ScoringRunMetadata {
  answeredFields: ScoringField[];
  totalInputRecords: number;
  distinctInputIds: number;
  distinctOutputIds: number;
  scoredCandidates: number;
  returnedResults: number;
  skippedForMissingOutput: number;
  unscorableOutputOnlyRecords: number;
}

export interface ScoringRunResult<TOutput extends OutputRecord> {
  results: Array<ScoredOutputRecord<TOutput>>;
  issues: EngineIssue[];
  metadata: ScoringRunMetadata;
}

export interface AssessmentDatasetBundle<
  TJobOutput extends OutputRecord = OutputRecord,
  TCategoryOutput extends OutputRecord = OutputRecord,
> {
  jobInputs?: readonly JobInputRecord[];
  jobOutputs?: readonly TJobOutput[];
  categoryInputs?: readonly CategoryInputRecord[];
  categoryOutputs?: readonly TCategoryOutput[];
}

export interface ScoreOptions {
  limit?: number;
  strict?: boolean;
}

export interface AssessmentScoringResult<
  TJobOutput extends OutputRecord = OutputRecord,
  TCategoryOutput extends OutputRecord = OutputRecord,
> {
  jobs: ScoringRunResult<TJobOutput>;
  categories: ScoringRunResult<TCategoryOutput>;
}

export type GeneratedMatchType = "High Match" | "Medium Match" | "Reach Match" | "No Match";

export type GeneratedMatch<TOutput extends OutputRecord = OutputRecord> = ScoredOutputRecord<TOutput> & {
  match_score: number;
  match_type: GeneratedMatchType;
};

interface PreparedTextValue {
  raw: string;
  normalized: string;
  tokens: string[];
}

interface PreparedWeightedValue extends PreparedTextValue {
  weight: number;
}

interface CandidateScoreBreakdown {
  score: number;
  debug: CandidateDebug;
}

const repositoryJobInputs = repositoryJobInputsData as unknown as readonly JobInputRecord[];
const repositoryJobOutputs = repositoryJobOutputsData as unknown as readonly OutputRecord[];

const repositoryCategoryInputs =
  repositoryCategoryInputsData as unknown as readonly CategoryInputRecord[];

const repositoryCategoryOutputs =
  repositoryCategoryOutputsData as unknown as readonly OutputRecord[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clamp01(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function clamp100(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_/&+-]+/g, " ")
    .replace(/[()'".,]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeMeaningfulText(value: string): string[] {
  const normalized = normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function prepareTextValue(value: string): PreparedTextValue | null {
  if (typeof value !== "string") {
    return null;
  }

  const raw = value.trim();

  if (!raw) {
    return null;
  }

  return {
    raw,
    normalized: normalizeText(raw),
    tokens: tokenizeMeaningfulText(raw),
  };
}

function dedupePreparedValues(values: PreparedTextValue[]): PreparedTextValue[] {
  const seen = new Set<string>();
  const deduped: PreparedTextValue[] = [];

  for (const value of values) {
    if (!value.normalized || seen.has(value.normalized)) {
      continue;
    }

    seen.add(value.normalized);
    deduped.push(value);
  }

  return deduped;
}

function textSimilarity(left: PreparedTextValue, right: PreparedTextValue): number {
  if (!left.normalized || !right.normalized) {
    return 0;
  }

  if (left.normalized === right.normalized) {
    return 1;
  }

  if (left.tokens.length === 0 || right.tokens.length === 0) {
    return 0;
  }

  const leftSet = new Set(left.tokens);
  const rightSet = new Set(right.tokens);
  let intersection = 0;

  for (const token of leftSet) {
    if (rightSet.has(token)) {
      intersection += 1;
    }
  }

  if (intersection === 0) {
    return 0;
  }

  const union = new Set([...leftSet, ...rightSet]).size;

  if (union === 0) {
    return 0;
  }

  return intersection / union;
}

function linearOrdinalCompatibility(
  leftValue: string,
  rightValue: string,
  order: ReadonlyMap<string, number>,
): number {
  const leftRank = order.get(normalizeText(leftValue));
  const rightRank = order.get(normalizeText(rightValue));

  if (leftRank === undefined || rightRank === undefined) {
    return normalizeText(leftValue) === normalizeText(rightValue) ? 1 : 0;
  }

  return clamp01(1 - Math.abs(leftRank - rightRank) * 0.25);
}

function educationCompatibility(leftValue: string, rightValue: string): number {
  return linearOrdinalCompatibility(leftValue, rightValue, EDUCATION_ORDER);
}

function salaryCompatibility(leftValue: string, rightValue: string): number {
  return linearOrdinalCompatibility(leftValue, rightValue, SALARY_ORDER);
}

function workIntensityCompatibility(leftValue: string, rightValue: string): number {
  const normalizedLeft = normalizeText(leftValue);
  const normalizedRight = normalizeText(rightValue);

  if (normalizedLeft === normalizedRight) {
    return 1;
  }

  const leftRank = LINEAR_WORK_INTENSITY_ORDER.get(normalizedLeft);
  const rightRank = LINEAR_WORK_INTENSITY_ORDER.get(normalizedRight);

  if (leftRank !== undefined && rightRank !== undefined) {
    return clamp01(1 - Math.abs(leftRank - rightRank) * 0.25);
  }

  const preparedLeft = prepareTextValue(leftValue);
  const preparedRight = prepareTextValue(rightValue);

  if (!preparedLeft || !preparedRight) {
    return 0;
  }

  return textSimilarity(preparedLeft, preparedRight);
}

function normalizeLimit(limit?: number): number | null {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return null;
  }

  if (limit <= 0) {
    return 0;
  }

  return Math.floor(limit);
}

function pushIssue(
  issues: EngineIssue[],
  scope: ScoreScope,
  code: string,
  severity: Severity,
  message: string,
  details?: unknown,
): void {
  issues.push({
    scope,
    code,
    severity,
    message,
    details,
  });
}

function maybeThrow(issues: EngineIssue[], strict?: boolean): void {
  if (!strict) {
    return;
  }

  const firstError = issues.find((issue) => issue.severity === "error");

  if (!firstError) {
    return;
  }

  throw new Error(`[${firstError.scope}] ${firstError.code}: ${firstError.message}`);
}

function toStringSelections(value: FlexibleAnswerValue): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function mapLegacyPeopleOrTask(value: string): string {
  const normalized = normalizeText(value);

  if (normalized.includes("people")) {
    return "people";
  }

  if (normalized.includes("task") || normalized.includes("solo")) {
    return "solo";
  }

  return value;
}

function mapNumericSalaryToBand(value: number): string {
  if (value >= 125000) {
    return "high";
  }

  if (value >= 75000) {
    return "medium_high";
  }

  return "medium";
}

function coerceAssessmentAnswers(rawAnswers: AssessmentAnswers): AssessmentAnswers {
  const source = isRecord(rawAnswers) ? rawAnswers : {};
  const answers: AssessmentAnswers = {};

  for (const field of SCORING_FIELDS) {
    const value = source[field];

    if (typeof value === "string" || Array.isArray(value)) {
      answers[field] = value;
    }
  }

  if (!answers.desired_outcomes && typeof source.desired_outcome === "string") {
    answers.desired_outcomes = source.desired_outcome;
  }

  if (!answers.major_interest) {
    const legacyMajor = source.major;

    if (typeof legacyMajor === "string" || Array.isArray(legacyMajor)) {
      answers.major_interest = legacyMajor as FlexibleAnswerValue;
    }
  }

  if (!answers.work_locations && typeof source.desired_location === "string") {
    answers.work_locations = source.desired_location;
  }

  if (!answers.solo_or_people && typeof source.people_or_task === "string") {
    answers.solo_or_people = mapLegacyPeopleOrTask(source.people_or_task);
  }

  if (!answers.grad_or_no) {
    if (typeof source.grad_school_interest === "boolean") {
      answers.grad_or_no = source.grad_school_interest ? "yes_grad" : "no_grad";
    } else if (typeof source.grad_school_career === "boolean") {
      answers.grad_or_no = source.grad_school_career ? "yes_grad" : "no_grad";
    }
  }

  if (!answers.salary_band && typeof source.target_salary === "number" && Number.isFinite(source.target_salary)) {
    answers.salary_band = mapNumericSalaryToBand(source.target_salary);
  }

  return answers;
}

function prepareUserAnswers(rawAnswers: AssessmentAnswers): Partial<Record<ScoringField, PreparedTextValue[]>> {
  const answers = coerceAssessmentAnswers(rawAnswers);
  const prepared: Partial<Record<ScoringField, PreparedTextValue[]>> = {};

  for (const field of SCORING_FIELDS) {
    const selections = toStringSelections(answers[field]);

    if (selections.length === 0) {
      continue;
    }

    const preparedSelections = dedupePreparedValues(
      selections
        .map((selection) => prepareTextValue(selection))
        .filter((selection): selection is PreparedTextValue => Boolean(selection)),
    );

    if (preparedSelections.length > 0) {
      prepared[field] = preparedSelections;
    }
  }

  return prepared;
}

function normalizeWeightedEntries(
  rawValue: unknown,
  scope: ScoreScope,
  field: ScoringField,
  candidateId: string,
  issues: EngineIssue[],
): PreparedWeightedValue[] | null {
  if (rawValue === undefined || rawValue === null) {
    return null;
  }

  if (!Array.isArray(rawValue)) {
    pushIssue(
      issues,
      scope,
      "unexpected-field-shape",
      "warning",
      `Expected ${field} on ${candidateId} to be an array of { id, weight } values.`,
      { candidateId, field, receivedType: typeof rawValue },
    );
    return null;
  }

  const bestByNormalizedId = new Map<string, PreparedWeightedValue>();

  for (const entry of rawValue) {
    if (!isRecord(entry) || typeof entry.id !== "string") {
      pushIssue(
        issues,
        scope,
        "invalid-weighted-entry",
        "warning",
        `Skipping malformed ${field} entry on ${candidateId}.`,
        { candidateId, field, entry },
      );
      continue;
    }

    if (typeof entry.weight !== "number" || !Number.isFinite(entry.weight) || entry.weight < 0 || entry.weight > 1) {
      pushIssue(
        issues,
        scope,
        "invalid-weight",
        "warning",
        `Skipping ${field} entry with invalid weight on ${candidateId}.`,
        { candidateId, field, entry },
      );
      continue;
    }

    const prepared = prepareTextValue(entry.id);

    if (!prepared) {
      continue;
    }

    const weightedValue: PreparedWeightedValue = {
      ...prepared,
      weight: entry.weight,
    };
    const existing = bestByNormalizedId.get(weightedValue.normalized);

    if (!existing || weightedValue.weight > existing.weight) {
      bestByNormalizedId.set(weightedValue.normalized, weightedValue);
    }
  }

  return bestByNormalizedId.size > 0 ? [...bestByNormalizedId.values()] : null;
}

function normalizeStringEntries(
  rawValue: unknown,
  scope: ScoreScope,
  field: ScoringField,
  candidateId: string,
  issues: EngineIssue[],
): PreparedWeightedValue[] | null {
  if (rawValue === undefined || rawValue === null) {
    return null;
  }

  if (!Array.isArray(rawValue)) {
    pushIssue(
      issues,
      scope,
      "unexpected-field-shape",
      "warning",
      `Expected ${field} on ${candidateId} to be an array of strings.`,
      { candidateId, field, receivedType: typeof rawValue },
    );
    return null;
  }

  const bestByNormalizedId = new Map<string, PreparedWeightedValue>();

  for (const entry of rawValue) {
    if (typeof entry !== "string") {
      pushIssue(
        issues,
        scope,
        "invalid-string-entry",
        "warning",
        `Skipping non-string ${field} entry on ${candidateId}.`,
        { candidateId, field, entry },
      );
      continue;
    }

    const prepared = prepareTextValue(entry);

    if (!prepared) {
      continue;
    }

    const weightedValue: PreparedWeightedValue = {
      ...prepared,
      weight: 1,
    };

    if (!bestByNormalizedId.has(weightedValue.normalized)) {
      bestByNormalizedId.set(weightedValue.normalized, weightedValue);
    }
  }

  return bestByNormalizedId.size > 0 ? [...bestByNormalizedId.values()] : null;
}

function normalizeScalarEntry(
  rawValue: unknown,
  scope: ScoreScope,
  field: ScoringField,
  candidateId: string,
  issues: EngineIssue[],
): PreparedTextValue | null {
  if (rawValue === undefined || rawValue === null) {
    return null;
  }

  if (typeof rawValue !== "string") {
    pushIssue(
      issues,
      scope,
      "unexpected-field-shape",
      "warning",
      `Expected ${field} on ${candidateId} to be a string.`,
      { candidateId, field, receivedType: typeof rawValue },
    );
    return null;
  }

  return prepareTextValue(rawValue);
}

function scoreExactTaxonomyField(
  userSelections: PreparedTextValue[],
  candidateValues: PreparedWeightedValue[] | null,
): number | null {
  if (!candidateValues || candidateValues.length === 0) {
    return null;
  }

  const weightById = new Map<string, number>();

  for (const candidateValue of candidateValues) {
    const existing = weightById.get(candidateValue.normalized) ?? 0;
    if (candidateValue.weight > existing) {
      weightById.set(candidateValue.normalized, candidateValue.weight);
    }
  }

  let total = 0;

  for (const userSelection of userSelections) {
    total += weightById.get(userSelection.normalized) ?? 0;
  }

  return total / userSelections.length;
}

function scoreTextMultiSelectField(
  userSelections: PreparedTextValue[],
  candidateValues: PreparedWeightedValue[] | null,
): number | null {
  if (!candidateValues || candidateValues.length === 0) {
    return null;
  }

  let total = 0;

  for (const userSelection of userSelections) {
    let bestMatchValue = 0;

    for (const candidateValue of candidateValues) {
      const candidateMatchValue = textSimilarity(userSelection, candidateValue) * candidateValue.weight;
      if (candidateMatchValue > bestMatchValue) {
        bestMatchValue = candidateMatchValue;
      }
    }

    total += bestMatchValue;
  }

  return total / userSelections.length;
}

function scoreWeightedOrdinalField(
  userSelections: PreparedTextValue[],
  candidateValues: PreparedWeightedValue[] | null,
  comparator: (leftValue: string, rightValue: string) => number,
): number | null {
  if (!candidateValues || candidateValues.length === 0) {
    return null;
  }

  let total = 0;

  for (const userSelection of userSelections) {
    let bestMatchValue = 0;

    for (const candidateValue of candidateValues) {
      const candidateMatchValue = comparator(userSelection.raw, candidateValue.raw) * candidateValue.weight;
      if (candidateMatchValue > bestMatchValue) {
        bestMatchValue = candidateMatchValue;
      }
    }

    total += bestMatchValue;
  }

  return total / userSelections.length;
}

function scoreScalarOrdinalField(
  userSelections: PreparedTextValue[],
  candidateValue: PreparedTextValue | null,
  comparator: (leftValue: string, rightValue: string) => number,
): number | null {
  if (!candidateValue) {
    return null;
  }

  let total = 0;

  for (const userSelection of userSelections) {
    total += comparator(userSelection.raw, candidateValue.raw);
  }

  return total / userSelections.length;
}

function scoreFieldMatch(
  mode: InternalScoreMode,
  field: ScoringField,
  userSelections: PreparedTextValue[],
  candidateRecord: Record<string, unknown>,
  issues: EngineIssue[],
  candidateId: string,
): number | null {
  const rawFieldValue = candidateRecord[field];

  if (field === "education_requirement") {
    if (mode === "jobs") {
      return scoreScalarOrdinalField(
        userSelections,
        normalizeScalarEntry(rawFieldValue, mode, field, candidateId, issues),
        educationCompatibility,
      );
    }

    return scoreWeightedOrdinalField(
      userSelections,
      normalizeWeightedEntries(rawFieldValue, mode, field, candidateId, issues),
      educationCompatibility,
    );
  }

  if (field === "salary_band") {
    if (mode === "jobs") {
      return scoreScalarOrdinalField(
        userSelections,
        normalizeScalarEntry(rawFieldValue, mode, field, candidateId, issues),
        salaryCompatibility,
      );
    }

    return scoreWeightedOrdinalField(
      userSelections,
      normalizeWeightedEntries(rawFieldValue, mode, field, candidateId, issues),
      salaryCompatibility,
    );
  }

  if (field === "work_intensity") {
    return scoreWeightedOrdinalField(
      userSelections,
      normalizeWeightedEntries(rawFieldValue, mode, field, candidateId, issues),
      workIntensityCompatibility,
    );
  }

  if (TEXT_MULTI_FIELDS.has(field)) {
    if (mode === "jobs") {
      return scoreTextMultiSelectField(
        userSelections,
        normalizeStringEntries(rawFieldValue, mode, field, candidateId, issues),
      );
    }

    return scoreTextMultiSelectField(
      userSelections,
      normalizeWeightedEntries(rawFieldValue, mode, field, candidateId, issues),
    );
  }

  if (EXACT_TAXONOMY_FIELDS.has(field)) {
    return scoreExactTaxonomyField(
      userSelections,
      normalizeWeightedEntries(rawFieldValue, mode, field, candidateId, issues),
    );
  }

  return null;
}

function scoreCandidateRecord(
  mode: InternalScoreMode,
  candidateId: string,
  candidateRecord: Record<string, unknown>,
  userAnswers: Partial<Record<ScoringField, PreparedTextValue[]>>,
  questionWeights: QuestionWeights,
  issues: EngineIssue[],
): CandidateScoreBreakdown {
  let weightedPointsEarned = 0;
  let totalApplicableQuestionWeight = 0;
  const contributions: Partial<Record<ScoringField, QuestionContributionDebug>> = {};

  for (const field of SCORING_FIELDS) {
    const userSelections = userAnswers[field];

    if (!userSelections || userSelections.length === 0) {
      continue;
    }

    const matchScore = scoreFieldMatch(mode, field, userSelections, candidateRecord, issues, candidateId);

    if (matchScore === null) {
      contributions[field] = {
        applicable: false,
        questionWeight: questionWeights[field],
        matchScore: null,
        contribution: 0,
        userSelections: userSelections.map((selection) => selection.raw),
        reason: "candidate-missing",
      };
      continue;
    }

    const clampedMatchScore = clamp01(matchScore);
    const contribution = clampedMatchScore * questionWeights[field];

    weightedPointsEarned += contribution;
    totalApplicableQuestionWeight += questionWeights[field];
    contributions[field] = {
      applicable: true,
      questionWeight: questionWeights[field],
      matchScore: clampedMatchScore,
      contribution,
      userSelections: userSelections.map((selection) => selection.raw),
      reason: "matched",
    };
  }

  const rawScore =
    totalApplicableQuestionWeight > 0
      ? clamp100((weightedPointsEarned / totalApplicableQuestionWeight) * 100)
      : 0;

  return {
    score: rawScore,
    debug: {
      weightedPointsEarned,
      totalApplicableQuestionWeight,
      rawScore,
      chosenVariantIndex: 0,
      variantCount: 1,
      contributions,
    },
  };
}

function groupInputRecords<TInput extends { id?: unknown }>(
  scope: ScoreScope,
  inputRecords: readonly TInput[],
  issues: EngineIssue[],
): Map<string, TInput[]> {
  const groups = new Map<string, TInput[]>();
  const duplicateIds = new Set<string>();
  const missingIds: number[] = [];

  inputRecords.forEach((record, index) => {
    if (typeof record.id !== "string" || !record.id.trim()) {
      missingIds.push(index);
      return;
    }

    const id = record.id;
    const group = groups.get(id);

    if (group) {
      group.push(record);
      duplicateIds.add(id);
    } else {
      groups.set(id, [record]);
    }
  });

  if (missingIds.length > 0) {
    pushIssue(
      issues,
      scope,
      "missing-input-id",
      "error",
      `Skipped ${missingIds.length} ${scope} input records without a valid id.`,
      { indexes: missingIds },
    );
  }

  if (duplicateIds.size > 0) {
    pushIssue(
      issues,
      scope,
      "duplicate-input-id",
      "warning",
      `Found ${duplicateIds.size} duplicate ${scope} input ids. The highest-scoring variant will be retained for each id.`,
      { ids: [...duplicateIds].sort() },
    );
  }

  return groups;
}

function buildOutputLookup<TOutput extends OutputRecord>(
  scope: ScoreScope,
  outputRecords: readonly TOutput[],
  issues: EngineIssue[],
): Map<string, TOutput> {
  const lookup = new Map<string, TOutput>();
  const duplicateIds = new Set<string>();
  const missingIds: number[] = [];

  outputRecords.forEach((record, index) => {
    if (!record || typeof record.id !== "string" || !record.id.trim()) {
      missingIds.push(index);
      return;
    }

    if (lookup.has(record.id)) {
      duplicateIds.add(record.id);
      return;
    }

    lookup.set(record.id, record);
  });

  if (missingIds.length > 0) {
    pushIssue(
      issues,
      scope,
      "missing-output-id",
      "error",
      `Skipped ${missingIds.length} ${scope} output records without a valid id.`,
      { indexes: missingIds },
    );
  }

  if (duplicateIds.size > 0) {
    pushIssue(
      issues,
      scope,
      "duplicate-output-id",
      "warning",
      `Found ${duplicateIds.size} duplicate ${scope} output ids. The first output record was retained for each duplicate id.`,
      { ids: [...duplicateIds].sort() },
    );
  }

  return lookup;
}

function scoreCandidateGroup<TInput extends { id: string }>(
  mode: InternalScoreMode,
  candidateId: string,
  candidateVariants: readonly TInput[],
  userAnswers: Partial<Record<ScoringField, PreparedTextValue[]>>,
  questionWeights: QuestionWeights,
  issues: EngineIssue[],
): CandidateScoreBreakdown {
  let bestVariant: CandidateScoreBreakdown | null = null;

  candidateVariants.forEach((candidateVariant, variantIndex) => {
    const variantScore = scoreCandidateRecord(
      mode,
      candidateId,
      candidateVariant as unknown as Record<string, unknown>,
      userAnswers,
      questionWeights,
      issues,
    );

    if (!bestVariant) {
      bestVariant = {
        score: variantScore.score,
        debug: {
          ...variantScore.debug,
          chosenVariantIndex: variantIndex,
          variantCount: candidateVariants.length,
        },
      };
      return;
    }

    const shouldReplace =
      variantScore.score > bestVariant.score ||
      (variantScore.score === bestVariant.score &&
        variantScore.debug.totalApplicableQuestionWeight > bestVariant.debug.totalApplicableQuestionWeight);

    if (shouldReplace) {
      bestVariant = {
        score: variantScore.score,
        debug: {
          ...variantScore.debug,
          chosenVariantIndex: variantIndex,
          variantCount: candidateVariants.length,
        },
      };
    }
  });

  return (
    bestVariant ?? {
      score: 0,
      debug: {
        weightedPointsEarned: 0,
        totalApplicableQuestionWeight: 0,
        rawScore: 0,
        chosenVariantIndex: 0,
        variantCount: candidateVariants.length,
        contributions: {},
      },
    }
  );
}

function sortResultsByScore<TOutput extends OutputRecord>(
  results: Array<ScoredOutputRecord<TOutput>>,
): Array<ScoredOutputRecord<TOutput>> {
  return [...results].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.id.localeCompare(right.id);
  });
}

function createEmptyRunResult<TOutput extends OutputRecord>(
  scope: ScoreScope,
  answeredFields: ScoringField[],
  issues: EngineIssue[],
  totalInputRecords: number,
  distinctInputIds: number,
  distinctOutputIds: number,
): ScoringRunResult<TOutput> {
  maybeThrow(issues, false);

  return {
    results: [],
    issues,
    metadata: {
      answeredFields,
      totalInputRecords,
      distinctInputIds,
      distinctOutputIds,
      scoredCandidates: 0,
      returnedResults: 0,
      skippedForMissingOutput: 0,
      unscorableOutputOnlyRecords: distinctOutputIds,
    },
  };
}

function scoreIndependentSystem<TInput extends { id?: unknown }, TOutput extends OutputRecord>(
  mode: InternalScoreMode,
  userAnswers: AssessmentAnswers,
  inputRecords: readonly TInput[],
  outputRecords: readonly TOutput[],
  questionWeights: QuestionWeights,
  options?: ScoreOptions,
): ScoringRunResult<TOutput> {
  const issues: EngineIssue[] = [];
  const preparedUserAnswers = prepareUserAnswers(userAnswers);
  const answeredFields = SCORING_FIELDS.filter((field) => (preparedUserAnswers[field] ?? []).length > 0);
  const groupedInputs = groupInputRecords(mode, inputRecords, issues);
  const outputLookup = buildOutputLookup(mode, outputRecords, issues);

  if (inputRecords.length === 0) {
    pushIssue(issues, mode, "empty-input-data", "warning", `No ${mode} input records were provided.`);
  }

  if (outputRecords.length === 0) {
    pushIssue(issues, mode, "empty-output-data", "warning", `No ${mode} output records were provided.`);
  }

  if (answeredFields.length === 0) {
    pushIssue(
      issues,
      mode,
      "no-user-answers",
      "warning",
      `No supported ${mode} scoring answers were provided, so no ranking was generated.`,
    );
    maybeThrow(issues, options?.strict);
    return createEmptyRunResult(
      mode,
      answeredFields,
      issues,
      inputRecords.length,
      groupedInputs.size,
      outputLookup.size,
    );
  }

  const missingOutputIds: string[] = [];
  const scoredResults: Array<ScoredOutputRecord<TOutput>> = [];

  for (const [candidateId, candidateVariants] of groupedInputs.entries()) {
    const outputRecord = outputLookup.get(candidateId);

    if (!outputRecord) {
      missingOutputIds.push(candidateId);
      continue;
    }

    const candidateScore = scoreCandidateGroup(
      mode,
      candidateId,
      candidateVariants as Array<TInput & { id: string }>,
      preparedUserAnswers,
      questionWeights,
      issues,
    );

    scoredResults.push({
      ...outputRecord,
      score: roundTo(candidateScore.score, 2),
      rank: 0,
      debug: candidateScore.debug,
    });
  }

  if (missingOutputIds.length > 0) {
    pushIssue(
      issues,
      mode,
      "missing-output-join",
      "warning",
      `${missingOutputIds.length} ${mode} input ids could not be joined to an output record and were skipped.`,
      { ids: missingOutputIds.sort() },
    );
  }

  const outputOnlyIds = [...outputLookup.keys()].filter((outputId) => !groupedInputs.has(outputId));

  if (outputOnlyIds.length > 0) {
    pushIssue(
      issues,
      mode,
      "unscorable-output-only-records",
      "warning",
      `${outputOnlyIds.length} ${mode} output ids have no matching input scoring record and were not ranked.`,
      { ids: outputOnlyIds.sort() },
    );
  }

  const limit = normalizeLimit(options?.limit);
  const rankedResults = sortResultsByScore(scoredResults)
    .slice(0, limit ?? scoredResults.length)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));

  maybeThrow(issues, options?.strict);

  return {
    results: rankedResults,
    issues,
    metadata: {
      answeredFields,
      totalInputRecords: inputRecords.length,
      distinctInputIds: groupedInputs.size,
      distinctOutputIds: outputLookup.size,
      scoredCandidates: scoredResults.length,
      returnedResults: rankedResults.length,
      skippedForMissingOutput: missingOutputIds.length,
      unscorableOutputOnlyRecords: outputOnlyIds.length,
    },
  };
}

export function scoreJobs<TOutput extends OutputRecord = OutputRecord>(
  userAnswers: AssessmentAnswers,
  jobInputs: readonly JobInputRecord[] = repositoryJobInputs,
  jobOutputs: readonly TOutput[] = repositoryJobOutputs as readonly TOutput[],
  options?: ScoreOptions,
): ScoringRunResult<TOutput> {
  return scoreIndependentSystem("jobs", userAnswers, jobInputs, jobOutputs, JOB_QUESTION_WEIGHTS, options);
}

export function scoreCategories<TOutput extends OutputRecord = OutputRecord>(
  userAnswers: AssessmentAnswers,
categoryInputs: readonly CategoryInputRecord[] = repositoryCategoryInputs,
categoryOutputs: readonly TOutput[] =
  repositoryCategoryOutputs as readonly TOutput[],
  options?: ScoreOptions,
): ScoringRunResult<TOutput> {
  return scoreIndependentSystem(
    "categories",
    userAnswers,
    categoryInputs,
    categoryOutputs,
    CATEGORY_QUESTION_WEIGHTS,
    options,
  );
}

export function scoreAssessment<
  TJobOutput extends OutputRecord = OutputRecord,
  TCategoryOutput extends OutputRecord = OutputRecord,
>(
  userAnswers: AssessmentAnswers,
  datasets: AssessmentDatasetBundle<TJobOutput, TCategoryOutput> = {},
  options?: ScoreOptions,
): AssessmentScoringResult<TJobOutput, TCategoryOutput> {
  return {
    jobs: scoreJobs(
      userAnswers,
      datasets.jobInputs ?? repositoryJobInputs,
      datasets.jobOutputs ?? (repositoryJobOutputs as readonly TJobOutput[]),
      options,
    ),
categories: scoreCategories(
  userAnswers,
  datasets.categoryInputs ?? repositoryCategoryInputs,
  datasets.categoryOutputs ??
    (repositoryCategoryOutputs as readonly TCategoryOutput[]),
  options,
),
  };
}

export function getMatchType(score: number): GeneratedMatchType {
  if (score >= 85) {
    return "High Match";
  }

  if (score >= 60) {
    return "Medium Match";
  }

  if (score >= 50) {
    return "Reach Match";
  }

  return "No Match";
}

export function generateMatches<TOutput extends OutputRecord = OutputRecord>(
  userAnswers: AssessmentAnswers,
  options?: ScoreOptions,
): Array<GeneratedMatch<TOutput>> {
  return scoreJobs<TOutput>(userAnswers, repositoryJobInputs, repositoryJobOutputs as readonly TOutput[], options)
    .results
    .map((result) => ({
      ...result,
      match_score: result.score,
      match_type: getMatchType(result.score),
    }));
}