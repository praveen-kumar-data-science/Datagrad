import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface PortalLesson {
  title: string;
  topics: string[];
}

interface PortalSection {
  id: string;
  label: string;
  description: string;
  lessons: PortalLesson[];
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent implements OnInit {
  readonly trainingSections: PortalSection[] = [
    {
      id: 'sql',
      label: 'SQL',
      description: 'Foundational SQL through interview-grade analytics patterns and practice loops.',
      lessons: [
        { title: 'Basics', topics: ['SQL foundations', 'tables, rows, columns', 'query structure'] },
        { title: 'Select statements', topics: ['alias', 'new column expressions'] },
        { title: 'Filters', topics: ['operators', 'string filters', 'number ranges', 'LIKE', 'IN', 'EXCEPT', 'ALL'] },
        { title: 'Joins', topics: ['left join', 'right join', 'inner join', 'full join', 'cross join'] },
        { title: 'Aggregations', topics: ['GROUP BY', 'SUM', 'MIN', 'MAX'] },
        { title: 'Ordering', topics: ['ORDER BY ascending', 'ORDER BY descending'] },
        { title: 'Window functions', topics: ['PARTITION BY', 'RANK', 'ROW_NUMBER', 'DENSE_RANK', 'MIN', 'MAX', 'AVG', 'SUM', 'running total', '7-day average', 'constantly increasing/decreasing trends'] },
        { title: 'CTE and recursive CTE', topics: ['generate datasets', 'layered logic', 'recursive patterns'] },
        { title: 'Practice and evaluation', topics: ['LeetCode challenge', 'quiz and written test', 'interview preparation'] }
      ]
    },
    {
      id: 'pyspark',
      label: 'PySpark',
      description: 'Mirror core SQL logic in Spark to build hands-on distributed data engineering fluency.',
      lessons: [
        { title: 'Replicate the same SQL', topics: ['translate SQL logic into PySpark', 'DataFrame transformations', 'Spark equivalents for joins, filters, aggregations, and windows'] }
      ]
    },
    {
      id: 'python',
      label: 'Python',
      description: 'Interview-focused Python foundations, data structures, and applied algorithm patterns.',
      lessons: [
        { title: 'Variables', topics: ['types', 'assignment', 'basic operations'] },
        { title: 'Loops', topics: ['for loops', 'while loops'] },
        { title: 'Data structures', topics: ['list', 'dict', 'set', 'string', 'tuple', 'accessing elements', 'modifying elements'] },
        { title: 'Algorithms', topics: ['sliding window', 'binary search', 'linear search', 'cost optimization'] },
        { title: 'Practice and evaluation', topics: ['LeetCode challenge', 'quiz and written test', 'interview preparation'] }
      ]
    },
    {
      id: 'databricks',
      label: 'Databricks',
      description: 'Certification-aligned Databricks engineering, optimization, governance, workflows, and project delivery.',
      lessons: [
        { title: 'Certifications', topics: ['Data Engineer Associate', 'Data Engineer Advanced'] },
        { title: 'Associate-level optimization', topics: ['optimize command', 'ZORDER', 'partitions'] },
        { title: 'File types', topics: ['parquet pros and cons', 'avro pros and cons', 'csv pros and cons', 'json pros and cons', 'delta pros and cons'] },
        { title: 'Spark internals', topics: ['Spark architecture', 'Spark plans and DAGs', 'cost optimizer', 'AQE', 'ANALYZE TABLE command'] },
        { title: 'Data ingestion and quality', topics: ['ingestion patterns', 'Auto Loader', 'data quality checks'] },
        { title: 'Table engineering', topics: ['manual table creation', 'CRUD operations', 'managed vs external tables', 'Delta Lake', 'Delta tables', 'joins'] },
        { title: 'Platform architecture', topics: ['Medallion architecture', 'choosing clusters and storage', 'Spark UI'] },
        { title: 'Unity Catalog', topics: ['pros', 'permissions', 'row-based access', 'column-based access', 'auditing', 'lineage'] },
        { title: 'Optimizations', topics: ['storage optimization', 'compute optimization', 'query code optimization', 'liquid clustering', 'small files', 'spills', 'shuffles', 'skew', 'Photon', 'AQE'] },
        { title: 'Project buildout', topics: ['workflow', 'DLT', 'big data from Kaggle', 'ETL pipeline', 'all 3 tests'] },
        { title: 'DAB and sharing', topics: ['DAB', 'Delta Sharing cloud-to-cloud'] },
        { title: 'Streaming and CDC', topics: ['structured streaming', 'checkpointing', 'modes', 'read patterns', 'write patterns', 'MERGE INTO', 'delta log streaming', 'auto CDC'] },
        { title: 'Final delivery', topics: ['demo', 'documentation', 'video'] }
      ]
    },
    {
      id: 'ai',
      label: 'AI Projects',
      description: 'Databricks AI certification themes plus production-flavored retrieval, vector, and migration projects.',
      lessons: [
        { title: 'AI certification', topics: ['Databricks AI certification path'] },
        { title: 'RAG applications', topics: ['use RAGs', 'retrieval design', 'knowledge-grounded answers'] },
        { title: 'AI for Spark optimization', topics: ['use AI to optimize configs of big data Spark projects'] },
        { title: 'Pinecone operations', topics: ['CRUD in Pinecone'] },
        { title: 'Delta to Pinecone migration', topics: ['NLP pipeline', 'embeddings', 'migration design'] },
        { title: 'Project delivery', topics: ['demo', 'documentation', 'video'] }
      ]
    },
    {
      id: 'internship',
      label: 'Internship Projects',
      description: 'Group and industry-style project work that strengthens collaborative delivery proof.',
      lessons: [
        { title: 'Industry-specific project track', topics: ['internship-style execution', 'group projects', 'industry-specific scenarios'] }
      ]
    },
    {
      id: 'job',
      label: 'Job Readiness',
      description: 'Positioning, outreach, interview preparation, and execution systems for US big data engineering roles.',
      lessons: [
        { title: 'Resume', topics: ['one-page resume', 'ATS optimization', 'AI-based optimization', 'real examples'] },
        { title: 'GitHub profile', topics: ['monthly commits', 'project consistency'] },
        { title: 'LeetCode profile', topics: ['profile setup', 'consistent practice trail'] },
        { title: 'Personal website', topics: ['GitHub.io site'] },
        { title: 'LinkedIn masterclass', topics: ['profile visibility increase', 'role-specific tailoring', 'keyword optimization', 'regular posts', 'tags'] },
        { title: 'Application assets', topics: ['cover letter'] },
        { title: 'Mock interviews', topics: ['profile review tracker', 'industry-level feedback', 'SQL questions', 'PySpark questions', 'Python questions', 'Databricks project questions', 'architecture interview'] },
        { title: 'Networking strategy', topics: ['LinkedIn reach-out templates', 'email templates'] },
        { title: 'Job search system', topics: ['one job platform for US big data engineer roles', 'LinkedIn-based posts', 'email-based updates'] }
      ]
    },
    {
      id: 'behavioral',
      label: 'Behavioral',
      description: 'Behavioral interview preparation to complement the technical track.',
      lessons: [
        { title: 'Behavioral questions', topics: ['story framing', 'impact communication', 'ownership', 'conflict handling', 'leadership examples'] }
      ]
    },
    {
      id: 'optional-ms',
      label: 'Optional US MS Path',
      description: 'Extra support for candidates planning to study in the US before transitioning into the market.',
      lessons: [
        { title: 'University and visa support', topics: ['university selection', 'visa guidance'] },
        { title: 'Funding strategies', topics: ['internship planning', 'TA strategies', 'RA full funding strategies'] },
        { title: 'Outreach templates', topics: ['email templates'] }
      ]
    }
  ];
  selectedSectionId = this.trainingSections[0].id;
  selectedLessonId: string | null = null;
  completedLessons: Record<string, boolean> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProgress();

    const lastLessonId = this.lastViewedLessonId;
    if (lastLessonId) {
      this.focusLesson(lastLessonId);
      return;
    }

    const firstSection = this.trainingSections[0];
    const firstLesson = firstSection.lessons[0];
    this.selectedSectionId = firstSection.id;
    this.selectedLessonId = this.lessonId(firstSection.id, firstLesson.title);
  }

  get currentUser(): string | null {
    return this.authService.getCurrentUser();
  }

  get totalLessons(): number {
    return this.trainingSections.reduce((count, section) => count + section.lessons.length, 0);
  }

  get completedLessonCount(): number {
    return Object.values(this.completedLessons).filter(Boolean).length;
  }

  get overallProgressPercent(): number {
    return this.toPercent(this.completedLessonCount, this.totalLessons);
  }

  get continueLessonLabel(): string {
    const lesson = this.currentLesson;
    if (!lesson) {
      return 'Start the first lesson';
    }

    return `${this.selectedSection.label} - ${lesson.title}`;
  }

  get continueButtonLabel(): string {
    return this.currentLesson && !this.isLessonCompleted(this.selectedSection.id, this.currentLesson.title)
      ? 'Continue lesson'
      : 'Resume learning';
  }

  get currentLesson(): PortalLesson | null {
    if (!this.selectedLessonId) {
      return null;
    }

    return this.selectedSection.lessons.find(
      lesson => this.lessonId(this.selectedSection.id, lesson.title) === this.selectedLessonId
    ) ?? null;
  }

  get remainingLessonCount(): number {
    return this.totalLessons - this.completedLessonCount;
  }

  get lastViewedLessonId(): string | null {
    const currentUser = this.currentUser;

    if (!currentUser) {
      return null;
    }

    return localStorage.getItem(this.lastViewedStorageKey(currentUser));
  }

  get lastQuiz(): { sectionId: string; topicSlug: string; topic: string } | null {
    const currentUser = this.currentUser;

    if (!currentUser) {
      return null;
    }

    const lastQuizKey = `datagrad-last-quiz-${currentUser}`;
    const stored = localStorage.getItem(lastQuizKey);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  get selectedSection(): PortalSection {
    return this.trainingSections.find(section => section.id === this.selectedSectionId) ?? this.trainingSections[0];
  }

  selectSection(sectionId: string): void {
    this.selectedSectionId = sectionId;

    const selectedSection = this.selectedSection;
    if (!selectedSection.lessons.some(lesson => this.lessonId(sectionId, lesson.title) === this.selectedLessonId)) {
      const firstLesson = selectedSection.lessons[0];
      this.selectedLessonId = this.lessonId(sectionId, firstLesson.title);
      this.persistLastViewedLesson();
    }
  }

  selectLesson(sectionId: string, lessonTitle: string): void {
    this.selectedSectionId = sectionId;
    this.selectedLessonId = this.lessonId(sectionId, lessonTitle);
    this.persistLastViewedLesson();
  }

  topicQuizLink(sectionId: string, topic: string): string[] {
    return ['/portal/quiz', sectionId, this.topicSlug(topic)];
  }

  formatTopicLabel(topic: string): string {
    return topic
      .split(' ')
      .filter(Boolean)
      .map(part => {
        if (/^[a-z]{1,4}$/.test(part) && part.toLowerCase() !== 'into') {
          return part.toUpperCase();
        }

        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(' ')
      .replace('Cte', 'CTE')
      .replace('Aqe', 'AQE')
      .replace('Dlt', 'DLT')
      .replace('Rag', 'RAG')
      .replace('Nlp', 'NLP')
      .replace('Us', 'US');
  }

  continueFromLastLesson(): void {
    const lastLessonId = this.lastViewedLessonId;

    if (lastLessonId) {
      this.focusLesson(lastLessonId);
      return;
    }

    const firstSection = this.trainingSections[0];
    this.selectLesson(firstSection.id, firstSection.lessons[0].title);
  }

  resumeLastQuiz(): void {
    const lastQuiz = this.lastQuiz;

    if (!lastQuiz) {
      return;
    }

    this.router.navigate(['/portal/quiz', lastQuiz.sectionId, lastQuiz.topicSlug], {
      queryParams: { topic: lastQuiz.topic }
    });
  }

  toggleLessonCompletion(sectionId: string, lessonTitle: string): void {
    const lessonId = this.lessonId(sectionId, lessonTitle);
    const isCompleted = !!this.completedLessons[lessonId];

    this.completedLessons = {
      ...this.completedLessons,
      [lessonId]: !isCompleted
    };

    this.selectedSectionId = sectionId;
    this.selectedLessonId = lessonId;
    this.persistProgress();
    this.persistLastViewedLesson();
  }

  isLessonCompleted(sectionId: string, lessonTitle: string): boolean {
    return !!this.completedLessons[this.lessonId(sectionId, lessonTitle)];
  }

  isSelectedLesson(sectionId: string, lessonTitle: string): boolean {
    return this.selectedLessonId === this.lessonId(sectionId, lessonTitle);
  }

  completedLessonsForSection(section: PortalSection): number {
    return section.lessons.filter(lesson => this.isLessonCompleted(section.id, lesson.title)).length;
  }

  sectionProgressPercent(section: PortalSection): number {
    return this.toPercent(this.completedLessonsForSection(section), section.lessons.length);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }

  private focusLesson(lessonId: string): void {
    for (const section of this.trainingSections) {
      const lesson = section.lessons.find(candidate => this.lessonId(section.id, candidate.title) === lessonId);

      if (lesson) {
        this.selectedSectionId = section.id;
        this.selectedLessonId = lessonId;
        this.persistLastViewedLesson();
        return;
      }
    }
  }

  private loadProgress(): void {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.completedLessons = {};
      return;
    }

    const storedProgress = localStorage.getItem(this.progressStorageKey(currentUser));

    if (!storedProgress) {
      this.completedLessons = {};
      return;
    }

    try {
      this.completedLessons = JSON.parse(storedProgress) as Record<string, boolean>;
    } catch {
      this.completedLessons = {};
    }
  }

  private persistProgress(): void {
    const currentUser = this.currentUser;

    if (!currentUser) {
      return;
    }

    localStorage.setItem(this.progressStorageKey(currentUser), JSON.stringify(this.completedLessons));
  }

  private persistLastViewedLesson(): void {
    const currentUser = this.currentUser;

    if (!currentUser || !this.selectedLessonId) {
      return;
    }

    localStorage.setItem(this.lastViewedStorageKey(currentUser), this.selectedLessonId);
  }

  private progressStorageKey(userEmail: string): string {
    return `datagrad-progress-${userEmail}`;
  }

  private lastViewedStorageKey(userEmail: string): string {
    return `datagrad-last-lesson-${userEmail}`;
  }

  private lessonId(sectionId: string, lessonTitle: string): string {
    return `${sectionId}::${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  private topicSlug(topic: string): string {
    return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  private toPercent(value: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }
}