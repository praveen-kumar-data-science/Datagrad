import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

type QuestionType = 'single' | 'multiple';
type Difficulty = 'Basic' | 'Complex' | 'Interview';

interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  type: QuestionType;
  difficulty: Difficulty;
}

interface QuestionAttemptState {
  selectedAnswers: number[];
  status: 'idle' | 'correct' | 'incorrect';
  attempts: number;
  locked: boolean;
  firstAttemptCorrect: boolean | null;
}

interface TopicStat {
  topic: string;
  total: number;
  firstAttemptCorrect: number;
  accuracy: number;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  sectionId = '';
  focusTopic = '';
  sectionLabel = 'Section';
  readonly totalQuestions = 40;
  questions: QuizQuestion[] = [];
  attemptsState: Record<string, QuestionAttemptState> = {};

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sectionId = this.route.snapshot.paramMap.get('sectionId') ?? 'sql';
    this.focusTopic = this.route.snapshot.queryParamMap.get('topic') ?? this.route.snapshot.paramMap.get('topicSlug') ?? 'Topic';
    this.sectionLabel = this.toTitleCase(this.sectionId.replace(/-/g, ' '));
    this.questions = this.buildQuestionBank(this.totalQuestions);
    this.attemptsState = this.questions.reduce((acc, question) => {
      acc[question.id] = {
        selectedAnswers: [],
        status: 'idle',
        attempts: 0,
        locked: false,
        firstAttemptCorrect: null
      };
      return acc;
    }, {} as Record<string, QuestionAttemptState>);
  }

  get solvedCount(): number {
    return this.questions.filter(question => this.attemptsState[question.id]?.locked).length;
  }

  get correctCount(): number {
    return this.questions.filter(question => this.attemptsState[question.id]?.status === 'correct').length;
  }

  get wrongCount(): number {
    return this.totalQuestions - this.correctCount;
  }

  get progressPercent(): number {
    return Math.round((this.correctCount / this.totalQuestions) * 100);
  }

  get strengths(): TopicStat[] {
    return this.topicStats.filter(stat => stat.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy);
  }

  get weaknesses(): TopicStat[] {
    return this.topicStats.filter(stat => stat.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);
  }

  private get topicStats(): TopicStat[] {
    const grouped = new Map<string, { total: number; firstAttemptCorrect: number }>();

    for (const question of this.questions) {
      const state = this.attemptsState[question.id];
      const existing = grouped.get(question.topic) ?? { total: 0, firstAttemptCorrect: 0 };
      existing.total += 1;

      if (state?.firstAttemptCorrect) {
        existing.firstAttemptCorrect += 1;
      }

      grouped.set(question.topic, existing);
    }

    return [...grouped.entries()].map(([topic, value]) => ({
      topic,
      total: value.total,
      firstAttemptCorrect: value.firstAttemptCorrect,
      accuracy: Math.round((value.firstAttemptCorrect / value.total) * 100)
    }));
  }

  selectSingle(questionId: string, optionIndex: number): void {
    const state = this.attemptsState[questionId];
    if (!state || state.locked) {
      return;
    }

    state.selectedAnswers = [optionIndex];
    state.status = 'idle';
  }

  toggleMultiple(questionId: string, optionIndex: number): void {
    const state = this.attemptsState[questionId];
    if (!state || state.locked) {
      return;
    }

    if (state.selectedAnswers.includes(optionIndex)) {
      state.selectedAnswers = state.selectedAnswers.filter(value => value !== optionIndex);
    } else {
      state.selectedAnswers = [...state.selectedAnswers, optionIndex].sort((a, b) => a - b);
    }

    state.status = 'idle';
  }

  isSelected(questionId: string, optionIndex: number): boolean {
    return this.attemptsState[questionId]?.selectedAnswers.includes(optionIndex) ?? false;
  }

  submitAnswer(question: QuizQuestion): void {
    const state = this.attemptsState[question.id];
    if (!state || state.locked || state.selectedAnswers.length === 0) {
      return;
    }

    state.attempts += 1;
    const isCorrect = this.matchesCorrectAnswer(state.selectedAnswers, question.correctAnswers);

    if (state.firstAttemptCorrect === null) {
      state.firstAttemptCorrect = isCorrect;
    }

    if (isCorrect) {
      state.status = 'correct';
      state.locked = true;
      return;
    }

    state.status = 'incorrect';
  }

  statusText(questionId: string): string {
    const status = this.attemptsState[questionId]?.status;

    if (status === 'correct') {
      return 'Correct!';
    }

    if (status === 'incorrect') {
      return 'Try once again.';
    }

    return '';
  }

  private buildQuestionBank(count: number): QuizQuestion[] {
    const normalizedFocusTopic = this.toTitleCase(this.focusTopic.replace(/-/g, ' '));
    const topicPool = this.createTopicPool(normalizedFocusTopic);

    const singleTemplates = [
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Which option best defines the core concept of ${topic} in a US data engineering interview?`,
        options: [
          `A concise explanation of ${topic} with practical trade-offs`,
          `A random list of unrelated buzzwords`,
          `Only UI-level features without data logic`,
          `Skipping implementation details completely`
        ],
        correctAnswers: [0]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): In a production pipeline discussion, what should you mention first for ${topic}?`,
        options: [
          `Data correctness and validation strategy`,
          `Logo color choices`,
          `Browser extensions`,
          `Keyboard shortcuts only`
        ],
        correctAnswers: [0]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Which answer is strongest for a 3-5 year experience interview question on ${topic}?`,
        options: [
          `Explain design decisions, failure handling, and performance impact`,
          `Say it depends and stop`,
          `Avoid mentioning metrics`,
          `Focus only on textbook definitions`
        ],
        correctAnswers: [0]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): What is the best way to show depth in ${topic}?`,
        options: [
          `Discuss real project constraints and optimization outcomes`,
          `Memorize one-liners only`,
          `Ignore edge cases`,
          `Avoid mentioning monitoring`
        ],
        correctAnswers: [0]
      })
    ];

    const multipleTemplates = [
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Select the points interviewers usually expect when evaluating ${topic}.`,
        options: [
          `Correctness and data quality`,
          `Scalability and performance`,
          `Cost awareness and operational reliability`,
          `Ignoring observability`
        ],
        correctAnswers: [0, 1, 2]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Which actions improve production readiness for ${topic}?`,
        options: [
          `Add tests and validation checks`,
          `Measure runtime and bottlenecks`,
          `Document assumptions and lineage`,
          `Ship without monitoring`
        ],
        correctAnswers: [0, 1, 2]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Pick the interview-strong responses for troubleshooting ${topic}.`,
        options: [
          `Explain how you isolate failures`,
          `Share rollback or recovery strategy`,
          `Mention alerting and on-call readiness`,
          `Say you never debug issues`
        ],
        correctAnswers: [0, 1, 2]
      }),
      (topic: string, difficulty: Difficulty) => ({
        question: `${difficulty} (${topic}): Select the architecture concerns that matter for ${topic}.`,
        options: [
          `Schema evolution handling`,
          `Data contract compatibility`,
          `Backward-safe deployments`,
          `Ignoring historical data`
        ],
        correctAnswers: [0, 1, 2]
      })
    ];

    const difficultyCycle: Difficulty[] = ['Basic', 'Complex', 'Interview'];
    const questions: QuizQuestion[] = [];

    for (let index = 0; index < count; index += 1) {
      const topic = topicPool[index % topicPool.length];
      const difficulty = difficultyCycle[index % difficultyCycle.length];
      const useMultiple = index % 3 === 0;

      const template = useMultiple
        ? multipleTemplates[index % multipleTemplates.length]
        : singleTemplates[index % singleTemplates.length];

      const definition = template(topic, difficulty);
      questions.push({
        id: `q-${index + 1}`,
        topic,
        question: definition.question,
        options: definition.options,
        correctAnswers: definition.correctAnswers,
        type: useMultiple ? 'multiple' : 'single',
        difficulty
      });
    }

    return questions;
  }

  private createTopicPool(focusTopic: string): string[] {
    const sectionTopicMap: Record<string, string[]> = {
      sql: ['Tables', 'Rows', 'Select', 'Aliases', 'Filters', 'Joins', 'Aggregations', 'Window Functions', 'CTE', 'Interview SQL'],
      pyspark: ['DataFrames', 'Transformations', 'Actions', 'Spark SQL', 'Joins in PySpark', 'Optimizations', 'Partitioning', 'Caching', 'Shuffle', 'Interview PySpark'],
      python: ['Variables', 'Loops', 'Lists', 'Dictionaries', 'Sets', 'Tuples', 'Algorithms', 'Binary Search', 'Sliding Window', 'Interview Python'],
      databricks: ['Delta Lake', 'Unity Catalog', 'Photon', 'AQE', 'ZORDER', 'Auto Loader', 'DLT', 'Workflows', 'Streaming', 'Interview Databricks'],
      ai: ['RAG', 'Embeddings', 'Vector Search', 'Pinecone', 'Prompt Design', 'Evaluation', 'Latency', 'Data Quality', 'Model Ops', 'Interview AI Projects'],
      internship: ['Team Collaboration', 'Sprint Delivery', 'Code Review', 'Documentation', 'Pipeline Ownership', 'Issue Triage', 'Communication', 'Testing', 'Release', 'Interview Projects'],
      job: ['Resume', 'LinkedIn', 'Portfolio', 'Mock Interview', 'System Design', 'Behavioral', 'Networking', 'Outreach', 'Job Platform', 'Interview Readiness'],
      behavioral: ['STAR Method', 'Conflict Resolution', 'Ownership', 'Stakeholder Communication', 'Mentoring', 'Failure Recovery', 'Prioritization', 'Ambiguity Handling', 'Leadership', 'Interview Behavioral'],
      'optional-ms': ['University Selection', 'Visa Strategy', 'TA/RA Outreach', 'Funding', 'Internship Planning', 'Academic Projects', 'Statement Prep', 'Timeline Planning', 'Email Templates', 'Interview US MS Path']
    };

    const baseTopics = sectionTopicMap[this.sectionId] ?? [this.toTitleCase(this.sectionId)];
    const normalizedFocus = this.toTitleCase(focusTopic);

    if (!baseTopics.includes(normalizedFocus)) {
      return [normalizedFocus, ...baseTopics];
    }

    return [normalizedFocus, ...baseTopics.filter(topic => topic !== normalizedFocus)];
  }

  private matchesCorrectAnswer(selectedAnswers: number[], correctAnswers: number[]): boolean {
    if (selectedAnswers.length !== correctAnswers.length) {
      return false;
    }

    const sortedSelected = [...selectedAnswers].sort((a, b) => a - b);
    const sortedCorrect = [...correctAnswers].sort((a, b) => a - b);
    return sortedSelected.every((value, index) => value === sortedCorrect[index]);
  }

  private toTitleCase(value: string): string {
    return value
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}