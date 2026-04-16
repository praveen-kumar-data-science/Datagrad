import { Component } from '@angular/core';
import { MergedCarouselComponent } from '../carousel/merged-carousel/merged-carousel.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [
    MergedCarouselComponent,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css',
})
export class HeroBannerComponent {
  isSmallScreen = false;
  contactForm: FormGroup;

  constructor(private breakpointObserver: BreakpointObserver, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  curriculumItems = [
  {
    title: 'SQL Training & Interview Prep (1 month)',
    details: [
      'SQL fundamentals (joins, aggregations, window functions)',
      'Advanced SQL for interviews',
      'Real-world datasets practice',
      'Interview question patterns'
    ]
  },
  {
    title: 'Python Training (1 month)',
    details: [
      'Core Python (loops, functions, OOP)',
      'Data handling with Pandas',
      'Problem solving for interviews',
      'Mini projects'
    ]
  },
  {
    title: 'Big Data - Spark Training in Databricks (1 month)',
    details: [
      'Spark fundamentals (RDD, DataFrames)',
      'Databricks workflows',
      'Performance optimization',
      'Real production use cases'
    ]
  },
  {
    title: 'PySpark Code Training (1 week project)',
    details: [
      'End-to-end project using PySpark',
      'Joins, transformations, aggregations',
      'Debugging and optimization',
      'Industry-style pipeline building'
    ]
  },
  {
    title: 'AI Training',
    details: [
      'Basics of Machine Learning',
      'Intro to LLMs and AI tools',
      'Real-world AI use cases',
      'Hands-on mini projects'
    ]
  },
  {
    title: 'Internship / Project',
    details: [
      'Work on real-world project',
      'Simulate industry environment',
      'Build portfolio-ready experience',
      'Guided mentorship'
    ]
  }
];

  jobPrepItems = [
    {
      title: 'Resume/CV Preparation (one-on-one)',
      detail: 'Personalized resume review and rewriting to highlight your data engineering and AI experience for US recruiters.'
    },
     {
      title: 'Industry level Mock Interviews with feedback',
      detail: 'Personalized resume review and rewriting to highlight your data engineering and AI experience for US recruiters.'
    },
    {
      title: 'Personal Portfolio Website',
      detail: 'Design and build a portfolio website that showcases your projects, skills, and technical story in a compelling way.'
    },
    {
      title: 'Linkedin Masterclass to make recruiters reach out to you',
      detail: 'Optimize your LinkedIn profile, network strategy, and outreach so recruiters contact you first.'
    },
    {
      title: 'Visa prep + University selection (if you are planning to study in the US)',
      detail: 'Career-focused guidance on US university options, degree pathways, and visa readiness for job-focused students.'
    },
    {
      title: 'Networking skills and Job board hacks',
      detail: 'Proven networking tactics, job board strategies, and employer targeting to speed up your job search.'
    }
  ];

  expandedIndex: number | null = null;

  toggleCurriculum(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
    emailjs.init('U5uIYArDWBCqC7Av0');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'datagradai@gmail.com'
      };
      emailjs.send('service_datagrad', 'template_datagrad', emailParams)
        .then(() => {
          alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
          this.contactForm.reset();
        })
        .catch((error: unknown) => {
          console.error('Email send failed:', error);
          alert('Sorry, there was an error sending your message. Please try again.');
        });
    }
  }
}

