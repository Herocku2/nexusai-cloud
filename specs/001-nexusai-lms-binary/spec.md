# Feature Specification: Nexus AI LMS Platform with Binary MLM System

**Feature Branch**: `[001-nexusai-lms-binary]`  
**Created**: 2025-10-17  
**Status**: Draft  
**Input**: User description: "Lee a detalle y Crea una aplicacion de academia estilo Rocket LMS con un sistema binario como el que esta en los archivos .txt del folder raiz. Usa la plantilla de la carpeta llamada Frontend como base del proyecto en ella esta una excelente plantilla hecha en reacjs la cual servira para el desarrollo de la plataform llamada nexusai. La plataforma de sistema MLM (binario) con academia LMS es una plataforma que tendra inicio de ssion y registro de usaurios, un binario con su arbol de referidos , sistema de referencia, depositos con Qr en la red de tesnet de la red binance smart chain con un token mock (clon usdt) como medio de deposito y retiros tambien en usdt. debera tener validacion con redes sociales y envio de notificaciones con sengrip para envios de email. Debera tener su sistema con vite y su back end con python y django . Debe tener su base de datos con POstgrest y todas la psi hook, reddis y conexioenes con celery necesarios para el excelente fucnionamiento del proyecto. crea el archivo spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration and Onboarding (Priority: P1)

New users must be able to register for the platform, providing basic information and setting up their account to access the LMS academy and participate in the binary MLM system.

**Why this priority**: This is the entry point for all users and essential for platform adoption. Without proper registration, no other features can be utilized.

**Independent Test**: Can be fully tested by completing the registration flow with valid data and verifying account creation with proper default settings.

**Acceptance Scenarios**:

1. **Given** a new visitor accesses the platform, **When** they complete the registration form with valid information, **Then** they receive a confirmation email and their account is created with "inactive" status
2. **Given** a new user completes registration, **When** they make their initial $89 USD payment, **Then** their account status changes to "active" and they receive their binary position
3. **Given** a user registers with an invalid email, **When** they submit the form, **Then** they see an appropriate error message and the account is not created

---

### User Story 2 - Binary Tree Management (Priority: P1)

Users must be able to view their binary downline tree, track their referral network, and understand their position in the compensation structure.

**Why this priority**: The binary system is the core MLM functionality that drives user engagement and revenue generation.

**Independent Test**: Can be fully tested by logging in as a user with referrals and verifying the binary tree displays correctly with left/right positioning and volume calculations.

**Acceptance Scenarios**:

1. **Given** an active user with referrals, **When** they access their binary tree view, **Then** they see their complete downline structure with left and right legs clearly identified
2. **Given** a user with new referrals, **When** a new member registers under them, **Then** the binary tree updates in real-time showing the new member in the correct position
3. **Given** a user views their binary tree, **When** they check their volume indicators, **Then** they see accurate PV calculations for both legs

---

### User Story 3 - Academic Content Access (Priority: P1)

Active users must be able to access LMS content, track their progress, and participate in educational activities based on their membership level.

**Why this priority**: This is the core value proposition of the platform - providing AI education content to users.

**Independent Test**: Can be fully tested by logging in as an active user and accessing various content types, verifying progress tracking works correctly.

**Acceptance Scenarios**:

1. **Given** an active user, **When** they access the academy dashboard, **Then** they see content available to their membership level
2. **Given** a user watches a video lesson, **When** they complete it, **Then** their progress is tracked and marked as "completed"
3. **Given** an inactive user, **When** they try to access academy content, **Then** they are redirected to the payment page with appropriate messaging

---

### User Story 4 - Cryptocurrency Deposits and Withdrawals (Priority: P1)

Users must be able to deposit funds using USDT on Binance Smart Chain testnet and withdraw earnings using the same method.

**Why this priority**: Financial transactions are essential for the MLM compensation system to function.

**Independent Test**: Can be fully tested by processing test transactions through the payment gateway and verifying balance updates.

**Acceptance Scenarios**:

1. **Given** a user wants to deposit funds, **When** they scan the QR code and send USDT, **Then** their account balance updates after confirmation
2. **Given** a user with earnings, **When** they request a withdrawal of at least 20 USDT, **Then** the request is processed with a 3% fee deducted
3. **Given** a withdrawal request, **When** the transaction is processed, **Then** the user receives email notification and the transaction is recorded

---

### User Story 5 - Commission Tracking and Payouts (Priority: P2)

Users must be able to track their earnings from various compensation sources including binary bonuses, fast start bonuses, and matching bonuses.

**Why this priority**: Users need transparent visibility into their earnings to remain engaged with the platform.

**Independent Test**: Can be fully tested by verifying commission calculations match the compensation plan rules for various scenarios.

**Acceptance Scenarios**:

1. **Given** a user with active downline, **When** binary commissions are calculated, **Then** they receive the correct 50% of their weaker leg volume
2. **Given** a user who sponsors a new member, **When** the new member activates, **Then** the sponsor receives the $40 fast start bonus
3. **Given** a user with active direct referrals, **When** their referrals earn binary commissions, **Then** the user receives matching bonuses

---

### User Story 6 - Rank Achievement and Recognition (Priority: P2)

Users must be able to track their progress toward rank advancement and receive notifications when they achieve new ranks.

**Why this priority**: Rank advancement provides gamification and motivation for users to grow their network.

**Independent Test**: Can be fully tested by simulating the PV accumulation required for each rank and verifying proper rank assignment.

**Acceptance Scenarios**:

1. **Given** a user accumulates the required PV for a new rank, **When** the daily commission job runs, **Then** their rank is updated appropriately
2. **Given** a user achieves a new rank, **When** the rank is assigned, **Then** they receive an email notification and their profile reflects the new rank
3. **Given** a user views their rank progress, **When** they check their dashboard, **Then** they see their current rank and progress toward the next rank

---

### User Story 7 - Social Media Integration (Priority: P3)

Users must be able to link their social media accounts for enhanced verification and sharing capabilities.

**Why this priority**: Social integration builds trust and enables viral marketing through social sharing.

**Independent Test**: Can be fully tested by connecting social media accounts and verifying the integration works correctly.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they choose to connect their social media account, **Then** they are redirected to the appropriate OAuth flow
2. **Given** a user with connected social accounts, **When** they view their profile, **Then** their connected accounts are displayed
3. **Given** a user wants to share content, **When** they use the social sharing feature, **Then** the content is posted to their selected social media account

---

### Edge Cases

- What happens when a user's monthly payment fails during processing?
- How does system handle binary tree imbalances where one leg has significantly more volume than the other?
- What happens when cryptocurrency network congestion delays transaction confirmations?
- How does system handle users who try to create multiple accounts?
- What happens when a user disputes a transaction or withdrawal?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to register with email, password, and basic personal information
- **FR-002**: System MUST verify email addresses before account activation
- **FR-003**: System MUST support two-factor authentication via TOTP (Google Authenticator)
- **FR-004**: System MUST implement a binary MLM tree structure with left and right positioning
- **FR-005**: System MUST calculate and distribute fast start bonuses within 24 hours of new member activation
- **FR-006**: System MUST calculate binary commissions daily based on weaker leg volume
- **FR-007**: System MUST calculate matching bonuses for level 1 direct referrals
- **FR-008**: System MUST process cryptocurrency deposits via USDT on Binance Smart Chain testnet
- **FR-009**: System MUST process withdrawal requests with minimum 20 USDT and 3% fee
- **FR-010**: System MUST track video progress and completion status for educational content
- **FR-011**: System MUST send email notifications for key events (registration, payments, rank advancement)
- **FR-012**: System MUST enforce monthly membership fee of $29 USD for active status
- **FR-013**: System MUST display user rank based on accumulated PV and requirements
- **FR-014**: System MUST support social media OAuth integration for account verification
- **FR-015**: System MUST prevent duplicate accounts using same email or identification
- **FR-016**: System MUST provide transparent downline viewing for users
- **FR-017**: System MUST track and display commission history and earnings
- **FR-018**: System MUST enforce payment terms acceptance before initial purchase
- **FR-019**: System MUST support integration with Zoom for live meetings
- **FR-020**: System MUST maintain audit trail for all financial transactions

### Key Entities *(include if feature involves data)*

- **User**: Represents platform members with profile, authentication, and membership status
- **BinaryPosition**: Represents user position in binary tree with left/right relationships
- **Transaction**: Records all financial activities including deposits, withdrawals, and commissions
- **Membership**: Tracks user subscription status, payments, and activation periods
- **Content**: Educational materials including videos, documents, and courses
- **Progress**: Tracks user completion status for educational content
- **Commission**: Records calculated bonuses and earnings from various compensation sources
- **Rank**: Defines user achievement levels based on performance metrics
- **Notification**: System communications sent to users via email or in-app messaging

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration and initial deposit in under 5 minutes
- **SC-002**: System processes binary commission calculations for all users within 2 hours daily
- **SC-003**: 95% of cryptocurrency transactions are confirmed and reflected in user balances within 30 minutes
- **SC-004**: 90% of users successfully access educational content within 24 hours of account activation
- **SC-005**: System maintains 99.9% uptime during business hours
- **SC-006**: Commission calculations are 100% accurate according to compensation plan rules
- **SC-007**: 85% of users achieve their first rank advancement within 30 days of activation
- **SC-008**: Support tickets related to payment processing are reduced by 60% through automated notifications
- **SC-009**: User retention rate exceeds 80% after 90 days
- **SC-010**: System can handle 10,000 concurrent users without performance degradation
