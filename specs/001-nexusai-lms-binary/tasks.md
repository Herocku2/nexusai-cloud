---
description: "Task list for Nexus AI LMS platform with binary MLM system implementation"
---

# Tasks: Nexus AI LMS Platform with Binary MLM System

**Input**: Design documents from `/specs/001-nexusai-lms-binary/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks for critical functionality

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3...)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`, `database/`
- Paths shown below follow the plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Laravel backend project with dependencies
- [ ] T003 Initialize Vite frontend project with minimal dependencies
- [ ] T004 [P] Configure ESLint and Prettier for frontend
- [ ] T005 [P] Configure PHP CS Fixer for backend
- [ ] T006 Setup Docker Compose configuration
- [ ] T007 [P] Configure environment files (.env.example, .env)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup PostgreSQL database with initial schema using database.sql
- [ ] T009 [P] Implement Laravel authentication framework with JWT
- [ ] T010 [P] Setup Laravel API routing and middleware structure
- [ ] T011 Create base Laravel models (User, BinaryPosition, Transaction, etc.)
- [ ] T012 Configure error handling and logging infrastructure
- [ ] T013 Setup Redis for caching and queue management
- [ ] T014 Configure Laravel Queues and Horizon
- [ ] T015 [P] Setup frontend routing and basic page structure
- [ ] T016 [P] Create frontend API utility functions
- [ ] T017 Create frontend authentication module

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Onboarding (Priority: P1) 🎯 MVP

**Goal**: New users can register for the platform, providing basic information and setting up their account

**Independent Test**: Complete registration flow with valid data and verify account creation with proper default settings

### Tests for User Story 1 ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Contract test for registration endpoint in backend/tests/Feature/AuthTest.php
- [ ] T019 [P] [US1] Integration test for registration flow in backend/tests/Feature/RegistrationFlowTest.php
- [ ] T020 [P] [US1] Frontend unit test for registration form validation in frontend/tests/unit/auth.test.js

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create User registration controller in backend/app/Http/Controllers/AuthController.php
- [ ] T022 [P] [US1] Create User registration request validation in backend/app/Http/Requests/RegisterRequest.php
- [ ] T023 [US1] Implement email verification service in backend/app/Services/EmailVerificationService.php
- [ ] T024 [US1] Create registration API endpoint in backend/routes/api.php
- [ ] T025 [P] [US1] Create registration form HTML in frontend/pages/auth/register.html
- [ ] T026 [P] [US1] Create registration JavaScript module in frontend/src/js/modules/auth.js
- [ ] T027 [P] [US1] Create registration form styles in frontend/src/scss/pages/auth.scss
- [ ] T028 [US1] Add form validation and error handling
- [ ] T029 [US1] Add logging for registration operations
- [ ] T030 [US1] Implement terms acceptance with IP tracking

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Binary Tree Management (Priority: P1) 🎯 MVP

**Goal**: Users can view their binary downline tree, track their referral network, and understand their position

**Independent Test**: Login as a user with referrals and verify the binary tree displays correctly with left/right positioning

### Tests for User Story 2 ⚠️

- [ ] T031 [P] [US2] Contract test for binary tree endpoints in backend/tests/Feature/BinaryTreeTest.php
- [ ] T032 [P] [US2] Integration test for binary tree placement in backend/tests/Feature/BinaryPlacementTest.php
- [ ] T033 [P] [US2] Frontend unit test for binary tree visualization in frontend/tests/unit/binary.test.js

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create BinaryPosition model in backend/app/Models/BinaryPosition.php
- [ ] T035 [P] [US2] Create Binary tree controller in backend/app/Http/Controllers/BinaryController.php
- [ ] T036 [US2] Implement Binary service in backend/app/Services/BinaryService.php (depends on T034)
- [ ] T037 [US2] Create binary tree API endpoints in backend/routes/api.php
- [ ] T038 [P] [US2] Create binary tree HTML page in frontend/pages/dashboard/binary.html
- [ ] T039 [P] [US2] Create binary tree JavaScript module in frontend/src/js/modules/binary.js
- [ ] T040 [P] [US2] Create binary tree visualization styles in frontend/src/scss/pages/binary.scss
- [ ] T041 [US2] Implement binary tree placement algorithm
- [ ] T042 [US2] Add volume calculation and display
- [ ] T043 [US2] Integrate with User Story 1 components (user registration creates binary position)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Academic Content Access (Priority: P1) 🎯 MVP

**Goal**: Active users can access LMS content, track their progress, and participate in educational activities

**Independent Test**: Login as an active user and access various content types, verify progress tracking works correctly

### Tests for User Story 3 ⚠️

- [ ] T044 [P] [US3] Contract test for content endpoints in backend/tests/Feature/ContentTest.php
- [ ] T045 [P] [US3] Integration test for content progress in backend/tests/Feature/ContentProgressTest.php
- [ ] T046 [P] [US3] Frontend unit test for content player in frontend/tests/unit/content.test.js

### Implementation for User Story 3

- [ ] T047 [P] [US3] Create Content model in backend/app/Models/Content.php
- [ ] T048 [P] [US3] Create ContentProgress model in backend/app/Models/ContentProgress.php
- [ ] T049 [US3] Implement Academy service in backend/app/Services/AcademyService.php
- [ ] T050 [US3] Create content API endpoints in backend/routes/api.php
- [ ] T051 [P] [US3] Create academy dashboard HTML in frontend/pages/academy/index.html
- [ ] T052 [P] [US3] Create content player HTML in frontend/pages/academy/course.html
- [ ] T053 [P] [US3] Create academy JavaScript module in frontend/src/js/modules/academy.js
- [ ] T054 [P] [US3] Create content player JavaScript in frontend/src/js/modules/video.js
- [ ] T055 [P] [US3] Create academy styles in frontend/src/scss/pages/academy.scss
- [ ] T056 [US3] Implement content access control based on membership status
- [ ] T057 [US3] Implement video progress tracking

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Cryptocurrency Deposits and Withdrawals (Priority: P1) 🎯 MVP

**Goal**: Users can deposit funds using USDT on Binance Smart Chain testnet and withdraw earnings

**Independent Test**: Process test transactions through the payment gateway and verify balance updates

### Tests for User Story 4 ⚠️

- [ ] T058 [P] [US4] Contract test for payment endpoints in backend/tests/Feature/PaymentTest.php
- [ ] T059 [P] [US4] Integration test for deposit flow in backend/tests/Feature/DepositFlowTest.php
- [ ] T060 [P] [US4] Frontend unit test for payment form in frontend/tests/unit/payments.test.js

### Implementation for User Story 4

- [ ] T061 [P] [US4] Create Transaction model in backend/app/Models/Transaction.php
- [ ] T062 [P] [US4] Create WithdrawalRequest model in backend/app/Models/WithdrawalRequest.php
- [ ] T063 [US4] Implement Payment service in backend/app/Services/PaymentService.php
- [ ] T064 [US4] Create payment API endpoints in backend/routes/api.php
- [ ] T065 [P] [US4] Create deposit page HTML in frontend/pages/payments/deposit.html
- [ ] T066 [P] [US4] Create withdrawal page HTML in frontend/pages/payments/withdraw.html
- [ ] T067 [P] [US4] Create payment JavaScript module in frontend/src/js/modules/payments.js
- [ ] T068 [P] [US4] Create payment styles in frontend/src/scss/pages/payments.scss
- [ ] T069 [US4] Implement QR code generation for deposits
- [ ] T070 [US4] Implement blockchain transaction monitoring
- [ ] T071 [US4] Add withdrawal processing with fee calculation

---

## Phase 7: User Story 5 - Commission Tracking and Payouts (Priority: P2)

**Goal**: Users can track their earnings from various compensation sources

**Independent Test**: Verify commission calculations match the compensation plan rules for various scenarios

### Tests for User Story 5 ⚠️

- [ ] T072 [P] [US5] Contract test for commission endpoints in backend/tests/Feature/CommissionTest.php
- [ ] T073 [P] [US5] Integration test for commission calculation in backend/tests/Feature/CommissionCalculationTest.php

### Implementation for User Story 5

- [ ] T074 [P] [US5] Create Commission model in backend/app/Models/Commission.php
- [ ] T075 [US5] Implement Commission service in backend/app/Services/CommissionService.php
- [ ] T076 [US5] Create commission calculation job in backend/app/Jobs/CalculateCommissions.php
- [ ] T077 [US5] Create commission API endpoints in backend/routes/api.php
- [ ] T078 [P] [US5] Create commission dashboard HTML in frontend/pages/dashboard/commissions.html
- [ ] T079 [P] [US5] Create commission JavaScript module in frontend/src/js/modules/commissions.js
- [ ] T080 [US5] Implement fast start bonus calculation
- [ ] T081 [US5] Implement binary commission calculation
- [ ] T082 [US5] Implement matching bonus calculation
- [ ] T083 [US5] Add commission history and reporting

---

## Phase 8: User Story 6 - Rank Achievement and Recognition (Priority: P2)

**Goal**: Users can track their progress toward rank advancement and receive notifications

**Independent Test**: Simulate PV accumulation for each rank and verify proper rank assignment

### Tests for User Story 6 ⚠️

- [ ] T084 [P] [US6] Contract test for rank endpoints in backend/tests/Feature/RankTest.php
- [ ] T085 [P] [US6] Integration test for rank advancement in backend/tests/Feature/RankAdvancementTest.php

### Implementation for User Story 6

- [ ] T086 [P] [US6] Create Rank model in backend/app/Models/Rank.php
- [ ] T087 [P] [US6] Create UserRank model in backend/app/Models/UserRank.php
- [ ] T088 [US6] Implement Rank service in backend/app/Services/RankService.php
- [ ] T089 [US6] Create rank advancement job in backend/app/Jobs/CheckRankAdvancement.php
- [ ] T090 [US6] Create rank API endpoints in backend/routes/api.php
- [ ] T091 [P] [US6] Create rank display components in frontend
- [ ] T092 [US6] Implement rank advancement logic
- [ ] T093 [US6] Add rank-based earning caps
- [ ] T094 [US6] Create rank achievement notifications

---

## Phase 9: User Story 7 - Social Media Integration (Priority: P3)

**Goal**: Users can link their social media accounts for enhanced verification and sharing

**Independent Test**: Connect social media accounts and verify the integration works correctly

### Tests for User Story 7 ⚠️

- [ ] T095 [P] [US7] Contract test for social auth endpoints in backend/tests/Feature/SocialAuthTest.php

### Implementation for User Story 7

- [ ] T096 [P] [US7] Implement OAuth controllers for social platforms
- [ ] T097 [US7] Create social account linking service
- [ ] T098 [US7] Create social auth API endpoints in backend/routes/api.php
- [ ] T099 [P] [US7] Create social linking HTML in frontend/pages/profile.html
- [ ] T100 [P] [US7] Create social JavaScript module in frontend/src/js/modules/social.js
- [ ] T101 [US7] Implement social sharing functionality

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T102 [P] Create admin dashboard for user management
- [ ] T103 [P] Create admin dashboard for content management
- [ ] T104 [P] Create admin dashboard for financial oversight
- [ ] T105 [P] Implement email notification system with SendGrid
- [ ] T106 [P] Add comprehensive logging and monitoring
- [ ] T107 [P] Implement rate limiting and security headers
- [ ] T108 [P] Add data export functionality for users
- [ ] T109 [P] Create comprehensive error pages
- [ ] T110 [P] Add loading states and transitions
- [ ] T111 [P] Optimize database queries and add caching
- [ ] T112 [P] Add comprehensive unit tests in backend/tests/Unit/
- [ ] T113 [P] Add frontend integration tests
- [ ] T114 Security hardening and audit
- [ ] T115 Performance optimization across all stories
- [ ] T116 Documentation updates in docs/
- [ ] T117 Run quickstart.md validation and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 for binary position creation
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for user authentication
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for user accounts
- **User Story 5 (P2)**: Can start after US1, US2, US4 - Requires users, binary structure, and transactions
- **User Story 6 (P2)**: Can start after US5 - Depends on commission calculations for rank advancement
- **User Story 7 (P3)**: Can start after US1 - Depends on user authentication

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all P1 user stories can start in parallel
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Binary Tree)
5. Complete Phase 5: User Story 3 (Academy)
6. Complete Phase 6: User Story 4 (Payments)
7. **STOP and VALIDATE**: Test all P1 stories work together
8. Deploy/demo MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Core MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Registration)
   - Developer B: User Story 2 (Binary Tree)
   - Developer C: User Story 3 (Academy)
   - Developer D: User Story 4 (Payments)
3. Stories complete and integrate independently
4. P2 stories can follow similar parallel approach

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Focus on minimal dependencies as specified in requirements
- Use vanilla JavaScript approach for frontend
- Laravel backend should follow best practices for security and performance