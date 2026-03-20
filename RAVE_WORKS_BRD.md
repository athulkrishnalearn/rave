# RAVE Works — Business Requirements Document (BRD)
**Version:** 2.0  
**Date:** February 28, 2026  
**Platform:** Next.js Web App (Mobile-First)  
**Audience:** Designers, Engineers, Product Stakeholders

---

## 1. Executive Summary

**RAVE Works** is a social-first creative marketplace connecting **Rave Heads** (creators, freelancers, editors, musicians, models, sales agents) with **OG Vendors** (brands, agencies, labels). The platform blends a social feed with a professional work/campaign engine — think LinkedIn × Instagram for the creator economy.

### Core User Roles

| Role | Description |
|---|---|
| **Guest** | Read-only feed, public profiles, search |
| **Rave Head** | Creative talent — posts drops/services, applies to campaigns, delivers projects |
| **OG Vendor** | Brand/agency — posts campaigns, reviews applicants, hires creators |
| **Admin** | Platform operator — verifies identities, moderates content, resolves disputes |

---

## 2. System Architecture

```
[ Auth Layer ] ──► [ Feed (Social) ] ──► [ Campaign / Work System ] ──► [ Project Workspace ]
                          ▲                         ▲                          ▲
                    [ Explore ]              [ Applicants ]             [ Inbox / Chat ]
                    [ Hashtag ]              [ Agreement ]             [ Escrow / Payments ]
                    [ Search ]               [ Onboarding ]            [ Disputes ]
                    [ Profile ]              [ Admin Console ]
```

**Tech Stack:** Next.js 15, MongoDB (Mongoose), JWT Auth, Tailwind CSS  
**Design Language:** Clean minimal — `#F7F7F8` background, white cards, `#E8E8E8` borders, `#18181B` primary

---

## 3. Complete Screen List (V1 — 40 Screens)

| # | Screen | Route | Status |
|---|---|---|---|
| 1 | Public Feed / Home | `/` | ✅ |
| 2 | Explore | `/explore` | ✅ |
| 3 | Public Profile | `/profile/[username]` | ✅ |
| 4 | Drop Detail | `/drop/[id]` | ✅ |
| 5 | Sign Up | `/signup` | ✅ |
| 6 | Login | `/login` | ✅ |
| 7 | Rave Head Onboarding — Step 1: Username | `/onboarding/rave-head` | ✅ |
| 8 | Rave Head Onboarding — Step 2: Core Focus | `/onboarding/rave-head` | ✅ |
| 9 | Rave Head Onboarding — Step 3: Skills | `/onboarding/rave-head` | ✅ |
| 10 | Rave Head Onboarding — Step 4: Bio + Photo | `/onboarding/rave-head` | ✅ |
| 11 | Rave Head Onboarding — Step 5: Portfolio | `/onboarding/rave-head` | ✅ |
| 12 | Rave Head Onboarding — Step 6: ID Verify | `/onboarding/rave-head` | ✅ |
| 13 | Rave Head Onboarding — Step 7: First Drop | `/onboarding/rave-head` | ✅ |
| 14 | Company Onboarding — Step 1: Username | `/onboarding/company` | ✅ |
| 15 | Company Onboarding — Step 2: Company Info | `/onboarding/company` | ✅ |
| 16 | Company Onboarding — Step 3: Industry | `/onboarding/company` | ✅ |
| 17 | Company Onboarding — Step 4: Verification | `/onboarding/company` | ✅ |
| 18 | Company Onboarding — Step 5: First Requirement | `/onboarding/company` | ✅ |
| 19 | Logged-In Home Feed | `/` (auth) | ✅ |
| 20 | Create Drop | `/create/post` | ✅ |
| 21 | Create Campaign | `/create/campaign` | ✅ |
| 22 | Collaborate / Application | `/collaborate/[dropId]` | ✅ |
| 23 | Applicant Review | `/applicants/[dropId]` | ✅ |
| 24 | Application Detail | `/application/[id]` | ✅ |
| 25 | Project Agreement | `/agreement/[projectId]` | ✅ |
| 26 | Escrow Payment | `/escrow/[projectId]` | ✅ |
| 27 | Project Workspace | `/project/[id]` | ✅ |
| 28 | Inbox / Chat | `/inbox` | ✅ |
| 29 | My Collaborations | `/collaborations` | ✅ |
| 30 | Notifications | `/notifications` | ✅ |
| 31 | Settings — Account | `/settings` | ✅ |
| 32 | Settings — Payment | `/settings` (tab) | ✅ |
| 33 | Settings — Privacy | `/settings` (tab) | ✅ |
| 34 | Dashboard (Rave Head / Company) | `/dashboard` | ✅ |
| 35 | Admin — Overview | `/admin` | ✅ |
| 36 | Admin — User Management | `/admin` (tab) | ✅ |
| 37 | Admin — Content Moderation | `/admin` (tab) | ✅ |
| 38 | Admin — Verifications | `/admin` (tab) | ✅ |
| 39 | Admin — Disputes | `/admin` (tab) | ✅ |
| 40 | Hashtag Page | `/hashtag/[tag]` | ✅ |
| 41 | Search Results | `/search` | ✅ |
| F | Sales Rave Head Dashboard | TBD | 🚧 V2 |

---

## 4. Screen-by-Screen Specifications

### SCREEN 1 — Public Feed (/)
**Access:** Public (Guest + Auth)

#### Layout
- Top nav: Logo, Search, Explore, Login, Join (guests) OR Sidebar (auth)
- 3-column desktop: 260px left | 640px center | 300px right (max 1280px)
- Filter tabs: For You / Requirements / Services / Trending

#### Drop Card Elements
- Profile photo + username + verified badge + timestamp + type label
- Text content (4-line preview → See More)
- Media (4:5 ratio)
- Hashtags (max 3 visible + "+N")
- Budget (if requirement/service)
- Engagement: Like / Comment / Repost counts + buttons
- **Collaborate CTA** (36px height, zinc-900)

#### Right Sidebar
- Trending hashtags
- Featured Rave Heads
- Live collaboration counter
- Join CTA (guests)

---

### SCREEN 2 — Explore (/explore)
**Access:** Public

#### Elements
- Search bar (keyword)
- Filter: Role / Drop Type / Budget / Skills / Verified only
- Trending Hashtags grid (tag name + drop count)
- Featured Profiles (image, username, core focus)
- Featured Requirements (mini drop cards)
- Discovery grid (masonry-style)

---

### SCREEN 3 — Public Profile (/profile/[username])
**Access:** Public

#### Profile Header
- Banner image, profile photo, username, verified badge, role tag
- Follow + Collaborate/Message buttons

#### Profile Info
- Bio, Core Focus badges, Skill tags, Location, Joined date

#### Stats Row
- Followers / Following / Collaborations / Rating

#### Tabs
- Drops / Portfolio / Collaborations / About

---

### SCREEN 4 — Drop Detail (/drop/[id])
**Access:** Public

#### Elements
- Full expanded drop card
- Thread replies (nested, inline)
- Reply box (login required)
- Reposts section

---

### SCREENS 5–6 — Auth (Login / Signup)
See existing implementation. Post-signup redirects to `/onboarding/rave-head` or `/onboarding/company`.

---

### SCREENS 7–13 — Rave Head Onboarding (/onboarding/rave-head)
7-step multi-screen wizard:

| Step | Content |
|---|---|
| 1 | Username input + availability check |
| 2 | Core Focus multi-select (Editing, Programming, Content Creation, Design, Marketing, Video Production, 🚧 Sales) |
| 3 | Skills tag input + auto-suggest |
| 4 | Bio textarea + profile photo upload |
| 5 | Portfolio upload + title + description |
| 6 | ID verification document upload |
| 7 | Post first drop → redirect to Feed |

---

### SCREENS 14–18 — Company Onboarding (/onboarding/company)
5-step wizard:

| Step | Content |
|---|---|
| 1 | Username input |
| 2 | Company name, website, description |
| 3 | Industry selection |
| 4 | Business verification document upload |
| 5 | Post first requirement → redirect to Feed |

---

### SCREEN 20–21 — Create Drop / Campaign (/create/post, /create/campaign)
- Type selector: Normal / Service / Requirement
- Text area, media upload, hashtags, skill tags, budget (conditional)
- Publish → `/api/posts`

---

### SCREEN 22 — Collaborate Application (/collaborate/[dropId])
- Requirement summary card
- Proposal textarea
- Timeline input
- Budget confirmation
- Submit → `/api/collaborate`

---

### SCREEN 23 — Applicant Review (/applicants/[dropId])
- Applicant list
- Profile preview + proposal
- Accept / Reject buttons → `/api/application/[id]`

---

### SCREEN 25–26 — Agreement + Escrow
- Agreement: budget, timeline, terms, Confirm button
- Escrow: payment amount, platform fee, payment method, Fund button
- Status: Funded → In Progress → Delivered → Completed

---

### SCREEN 27 — Project Workspace (/project/[id])
- Brief + assets
- Submission box (URL + note + file upload)
- Revision notes
- Payment panel
- Inline chat
- **Mark as Delivered** button (creator)
- **Accept & Release / Request Revision** buttons (vendor)

---

### SCREEN 28 — Inbox (/inbox)
- Two-panel: conversation list + chat
- File upload in chat
- Delivery button inside chat
- Completion confirmation

---

### SCREEN 29 — My Collaborations (/collaborations)
- Tabs: Pending / Active / Completed / Disputes
- Each card: project name, budget, status, Open Chat, **Raise Dispute**

---

### SCREEN 35–39 — Admin Console (/admin)
- **Overview:** total users, active projects, revenue, disputes
- **User Management:** suspend, verify
- **Content Moderation:** delete posts
- **Verifications:** approve/reject ID
- **Disputes:** view chat logs, release/refund decision

---

### SCREEN 40 — Hashtag Page (/hashtag/[tag])
- Tag header (name + drop count)
- Filtered drop feed
- Related tags

---

### SCREEN 41 — Search Results (/search)
- Search input (preserved)
- Tabs: Drops / Profiles / Requirements
- Filter panel: Role / Budget / Verified

---

## 5. User Flows

### Guest Flows
**Flow 1 — Browse Feed:** `/` → scroll drops → click profile/hashtag/drop → login prompt on interaction  
**Flow 2 — Search:** Search bar → `/search` → tabs → click item → login prompt

### Auth Flows
**Flow 3 — Rave Head Signup:** `/signup` → select Rave Head → email/pass → `/onboarding/rave-head` (7 steps) → `/`  
**Flow 4 — Company Signup:** `/signup` → select Company → email/pass → `/onboarding/company` (5 steps) → `/`

### Rave Head Flows
**Flow 5 — Onboarding:** 7-step wizard → First Drop → Feed  
**Flow 6 — Create Drop:** `+` → type → write → hashtags → media → Publish → Feed  
**Flow 7 — Create Service:** `+` → Service → description → budget → skills → Publish  
**Flow 8 — Apply:** Feed → Requirement → Collaborate → `/collaborate/[id]` → Submit  
**Flow 9 — Accept Collab:** Notification → Agreement → Accept → Chat opens  
**Flow 10 — Deliver Work:** Active project → Upload files → Mark as Delivered  
**Flow 11 — Confirm Completion:** Company accepts → Escrow releases → Completed  
**Flow 12 — Repost:** Feed → Repost → Add caption → Publish

### Company Flows
**Flow 13 — Onboarding:** 5-step wizard → First Requirement → Feed  
**Flow 14 — Post Requirement:** `+` → Requirement → title/desc/skills/budget → Publish  
**Flow 15 — Review Applicants:** Notification → `/applicants/[dropId]` → Accept/Reject  
**Flow 16 — Fund Escrow:** Accept → Agreement → Confirm → `/escrow/[id]` → Fund  
**Flow 17 — Accept Delivery:** Notification → `/project/[id]` → Accept & Release / Revision

### Messaging Flows
**Flow 18 — DM:** Profile → Message → `/inbox`  
**Flow 19 — Project Chat:** Collab accepted → Auto chat created → files + delivery in chat

### Discovery Flows
**Flow 20 — Hashtag:** Click hashtag → `/hashtag/[tag]` → filter by role/budget/verified  
**Flow 21 — Skill Search:** Search "Figma" → `/search` → Rave Heads tab → profile → Collaborate

### Dispute Flows
**Flow 22 — Raise Dispute:** Active project → Raise Dispute → reason + evidence → Admin review  
**Flow 23 — Admin Resolution:** `/admin` Disputes tab → chat logs + evidence → Release/Refund

### Other Flows
**Flow 24 — Multi-Rave Head Collab:** Requirement → multiple applicants → separate agreements + escrow  
**Flow 25 — Sales Rave Head (V2):** Core Focus step → Sales (locked) → Notify Me

---

## 6. Navigation Structure

| Label | Route | Desktop | Mobile |
|---|---|---|---|
| Feed | `/` | Left sidebar | Bottom dock |
| Explore | `/explore` | Left sidebar | Bottom dock |
| Create | `/create` | Left sidebar (+ button) | Bottom dock |
| Collabs | `/collaborations` | Left sidebar | Bottom dock |
| Messages | `/inbox` | Left sidebar | Bottom dock |
| Alerts | `/notifications` | Left sidebar | — |
| Dashboard | `/dashboard` | Left sidebar | — |
| Profile | `/profile/[username]` | Left sidebar | Bottom dock |

---

## 7. Data Models

### User
| Field | Type | Notes |
|---|---|---|
| name, email | String | Required |
| role | Enum | rave_head / og_vendor / admin |
| username | String | Unique handle |
| interests, skills | String[] | Rave Head |
| brandName, vendorType | String/Enum | Vendor |
| verificationStatus | Enum | unverified/pending/verified/rejected |
| bio, profileImage, coverImage | String | |
| portfolio | Object[] | title, description, fileUrl |
| followers, following | ObjectId[] | |
| rating | Number | Computed |

### Post
| Field | Type | Notes |
|---|---|---|
| type | Enum | DROP / WORK / CAMPAIGN |
| author | ObjectId → User | |
| content.text, title, mediaUrl | String | |
| hashtags | String[] | |
| workDetails.tags | String[] | WORK |
| campaignDetails.requirements, budget | Mixed | CAMPAIGN |
| metrics.likes, comments, reposts | Number | |

### Application → Project → Escrow
Standard pipeline: Application (PENDING/ACCEPTED/REJECTED) → Project (ACTIVE/SUBMITTED/REVISION/COMPLETED) → Escrow (PENDING/HELD/RELEASED)

### Dispute
| Field | Type | Notes |
|---|---|---|
| project | ObjectId | |
| raisedBy | ObjectId → User | |
| reason | String | |
| evidence | String[] | file URLs |
| status | Enum | open / resolved |
| resolution | Enum | released / refunded |

---

## 8. API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login + JWT |
| PATCH | `/api/auth/onboarding` | Save onboarding data |
| GET | `/api/feed` | Feed with tab filter |
| GET | `/api/posts` | All posts |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/[id]` | Single drop |
| GET | `/api/feed/hashtag/[tag]` | Posts by hashtag |
| GET | `/api/search` | Search drops/profiles/requirements |
| GET | `/api/users/[username]` | Public profile |
| GET | `/api/dashboard` | Role-based dashboard |
| POST | `/api/collaborate` | Submit application |
| GET | `/api/applicants` | List applicants for drop |
| GET/PATCH | `/api/application/[id]` | Get/Accept/Reject application |
| POST | `/api/project/init` | Create project |
| POST | `/api/project/[id]/submit` | Submit deliverable |
| POST | `/api/project/[id]/complete` | Accept delivery + release escrow |
| POST | `/api/drops/[id]/like` | Like a drop |
| GET/POST | `/api/message` | Inbox + send |
| GET/POST/PATCH | `/api/notifications` | Notifications |
| GET/POST | `/api/dispute` | Raise/list disputes |
| PATCH | `/api/dispute/[id]` | Admin resolve |
| GET | `/api/admin/stats` | Overview stats |
| PATCH | `/api/admin/users` | Ban/verify user |
| DELETE | `/api/admin/content` | Delete post |
| POST | `/api/admin/verification` | Approve/Reject ID |

---

## 9. Design System

| Token | Value |
|---|---|
| Background | `#F7F7F8` |
| Card | `#FFFFFF` |
| Border | `#E8E8E8` |
| Primary | `#18181B` |
| Text | `#18181B` |
| Muted | `#71717A` |
| Accent (CTA) | `#18181B` (zinc-900) |
| Border Radius | `12px` cards, `full` avatars |
| Feed Width | 640px center, 260px left, 300px right |
| Card Padding | 12px × 16px |
| Gap between posts | 16px |

---

## 10. Out of Scope (V2)

- Sales Rave Head Dashboard (commission tracking, affiliate, leads)
- Push notifications (mobile)
- Payment gateway (Stripe / Razorpay)
- Video call / screen share
- Public API
- Subscription tiers
- Mobile native app
- Multi-language
