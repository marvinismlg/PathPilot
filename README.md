# PathPilot

![PathPilot Cover](https://raw.githubusercontent.com/marvinismlg/PathPilot/main/IMG_2066.png)

## Student Career Recommendation Engine

PathPilot is an interactive career exploration platform designed to help students identify career paths based on their academic background, major, interests, and professional preferences.

Originally developed with Loyola University Maryland students in mind, PathPilot combines structured career data with a weighted recommendation system to turn student inputs into personalized career suggestions, career profiles, and actionable development plans.

The application currently supports a database spanning **650+ careers, 20+ career categories, and 50+ majors**, giving students a much wider range of career options than a traditional career quiz.

### [Launch PathPilot](https://path-pilot-sable.vercel.app/home)

### [Explore the Full Application Overview](https://path-pilot-sable.vercel.app/features)

---

## Overview

PathPilot was built around a simple problem:

> Students often know their major, but not necessarily what they can do with it.

Instead of matching users to a small set of generic occupations, PathPilot evaluates multiple dimensions of a student's profile and compares them against a larger career database.

Users can move through several parts of the platform to:

* Complete a structured career assessment
* Build an academic and professional profile
* Receive weighted career recommendations
* Explore alternative career directions
* Review career-specific information
* Build personalized career development plans
* Save and revisit their results

The goal is not to tell students what career they *should* pursue, but to give them a structured starting point for exploring careers they may not have previously considered.

---

## Core Features

### Career Recommendation Engine

PathPilot uses a weighted recommendation system to compare student profile information against career characteristics.

The recommendation logic is separated from the user interface and stored within the project's [`lib`](https://github.com/marvinismlg/PathPilot/tree/main/lib) directory.

Key recommendation components include:

* Academic profile matching
* Major-based career alignment
* Interest and preference matching
* Career category scoring
* Weighted career ranking
* Career profile generation

Relevant files include:

* [`engine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/engine.ts) - core recommendation logic
* [`quizengine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizengine.ts) - quiz evaluation and matching logic
* [`quizjobs.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizjobs.ts) - career/job data used by the assessment
* [`quizprofiles.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizprofiles.ts) - profile structures used during recommendation generation
* [`answers.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/answers.ts) - assessment answer data
* [`databasetypes.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/databasetypes.ts) - shared TypeScript data structures

---

### Career Assessment

Students can complete an interactive assessment that collects information about their interests, academic background, and professional preferences.

The quiz system uses structured responses to generate personalized career matches rather than returning the same predefined result categories for every user.

[View the quiz application code](https://github.com/marvinismlg/PathPilot/tree/main/app/quiz)

---

### Student Profiles

PathPilot allows users to create a profile containing information that can be incorporated into career recommendations.

The application contains separate profile-building and profile-results workflows.

* [Profile](https://github.com/marvinismlg/PathPilot/tree/main/app/profile)
* [Profile Builder](https://github.com/marvinismlg/PathPilot/tree/main/app/profile_build)
* [Profile Results](https://github.com/marvinismlg/PathPilot/tree/main/app/profile_results)

---

### Career Planning

Career discovery is only the first part of PathPilot.

The platform also includes planning functionality designed to help students translate a career recommendation into concrete development steps.

* [Plan Builder](https://github.com/marvinismlg/PathPilot/tree/main/app/plan_build)
* [Plan Results](https://github.com/marvinismlg/PathPilot/tree/main/app/plan_results)

---

### Career Angles

Students are rarely limited to one obvious career path.

PathPilot includes a career-angle system designed to expose users to alternative directions that may connect with their academic background and interests.

[View Career Angles](https://github.com/marvinismlg/PathPilot/tree/main/app/career_angles)

---

### Academic Career Database

The application includes a dedicated academic database section used to organize and surface career-related academic information.

[View Academic Database](https://github.com/marvinismlg/PathPilot/tree/main/app/academic_database)

---

### Authentication

PathPilot includes user authentication functionality so students can create accounts and access personalized parts of the platform.

Authentication-related functionality includes:

* Student signup
* Login
* Email confirmation
* Google OAuth integration
* CAPTCHA integration
* User session support

Relevant application directories:

* [Authentication](https://github.com/marvinismlg/PathPilot/tree/main/app/auth)
* [Login](https://github.com/marvinismlg/PathPilot/tree/main/app/login)
* [Student Signup](https://github.com/marvinismlg/PathPilot/tree/main/app/studentsignup)
* [Email Confirmation](https://github.com/marvinismlg/PathPilot/tree/main/app/confirm_email)

---

## Technical Architecture

PathPilot separates the application interface from its career recommendation and data-processing logic.

```text
PathPilot/
│
├── app/
│   ├── academic_database/
│   ├── apphome/
│   ├── auth/
│   ├── career_angles/
│   ├── confirm_email/
│   ├── features/
│   ├── home/
│   ├── login/
│   ├── plan_build/
│   ├── plan_results/
│   ├── portal/
│   ├── profile/
│   ├── profile_build/
│   ├── profile_results/
│   ├── quiz/
│   ├── share/
│   ├── snapshot/
│   └── studentsignup/
│
├── lib/
│   ├── supabase/
│   ├── angles.ts
│   ├── answers.ts
│   ├── databasetypes.ts
│   ├── engine.ts
│   ├── quizengine.ts
│   ├── quizjobs.ts
│   └── quizprofiles.ts
│
└── README.md
```

The [`app`](https://github.com/marvinismlg/PathPilot/tree/main/app) directory contains the application's pages and user-facing workflows.

The [`lib`](https://github.com/marvinismlg/PathPilot/tree/main/lib) directory contains the recommendation logic, quiz engine, career data, type definitions, and supporting application logic.

---

## Technical Features

PathPilot incorporates several technologies and architectural concepts:

* **TypeScript / TSX** for strongly typed application logic and interface development
* **JavaScript** for application functionality
* **HTML / JSX-style component structure** for interface composition
* **Supabase** for backend and authentication infrastructure
* **Google OAuth** for account authentication
* **CAPTCHA** for login and signup protection
* **Weighted recommendation logic** for career matching
* **Structured career datasets** for recommendation generation
* **Reusable data models and TypeScript interfaces**
* **Separated recommendation engine and presentation layer**
* **Vercel** for production deployment

---

## Application Flow

A simplified PathPilot user journey looks like:

```text
Student
   ↓
Create Account / Login
   ↓
Build Profile
   ↓
Complete Career Assessment
   ↓
Recommendation Engine
   ↓
Career Matches
   ↓
Explore Career Profiles
   ↓
Build Career Plan
```

This structure allows the assessment system, career database, profile information, and planning functionality to work together as parts of a single career exploration platform.

---

## Project Scale

PathPilot currently includes:

* **650+ careers**
* **20+ career categories**
* **50+ academic majors**
* Multiple student profile dimensions
* Weighted career recommendation logic
* Authentication and account management
* Career exploration workflows
* Career development planning
* Deployed production application

The platform has also been used to provide career guidance to **20+ high school students**.

---

## Repository Navigation

### Application

[View the complete application source code](https://github.com/marvinismlg/PathPilot/tree/main/app)

### Recommendation & Data Logic

[View the `lib` directory](https://github.com/marvinismlg/PathPilot/tree/main/lib)

### Recommendation Engine

[View `engine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/engine.ts)

### Quiz Engine

[View `quizengine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizengine.ts)

### Career Dataset

[View `quizjobs.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizjobs.ts)

### Live Application

[Launch PathPilot](https://path-pilot-sable.vercel.app/home)

### Full Application Overview

[Explore PathPilot Features](https://path-pilot-sable.vercel.app/features)

---

## Purpose

PathPilot is both a software engineering project and an experiment in structured career decision support.

The project explores how academic information, interests, structured datasets, and weighted decision systems can be combined to help students answer a difficult question:

**What careers actually fit me, and what should I do next?**

PathPilot aims to make that question easier to explore by giving students more options, more structure, and a clearer path from career discovery to action.

---

## Links

| Resource              | Link                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Live Application      | [Launch PathPilot](https://path-pilot-sable.vercel.app/home)                                 |
| Application Overview  | [Explore Features](https://path-pilot-sable.vercel.app/features)                             |
| Application Source    | [View `app/`](https://github.com/marvinismlg/PathPilot/tree/main/app)                        |
| Recommendation Logic  | [View `lib/`](https://github.com/marvinismlg/PathPilot/tree/main/lib)                        |
| Recommendation Engine | [View `engine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/engine.ts)         |
| Quiz Engine           | [View `quizengine.ts`](https://github.com/marvinismlg/PathPilot/blob/main/lib/quizengine.ts) |
| Repository            | [PathPilot on GitHub](https://github.com/marvinismlg/PathPilot)                              |

---

Developed by **Marvin Tientcheu**
