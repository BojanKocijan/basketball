# Privacy

Last updated: 2026-09-14

This app plans youth basketball trainings. Here's exactly what data it stores, and what it deliberately does not.

## What is stored, and where

| Data | Where | Personal data? |
|---|---|---|
| Exercise library (drills, steps, cues) | Bundled in the app's code | No — static content |
| Training plans (a date + a group + which exercises) | Shared Supabase database | No — no name, no identifying info |
| Shared trainer passcode | Shared Supabase database, checked server-side, never sent to the browser | No — a team-wide code, not tied to any individual |
| "Kids liked it?" ratings (1–3 per exercise) | `localStorage`, on your own device only | No — anonymous, aggregate, device-local |
| Selected group / current plan / setup checklist | `localStorage`, on your own device only | No — a UI preference, device-local |

**No names, emails, phone numbers, photos, or any information about the children who attend training is collected, stored, or transmitted anywhere by this app.**

## Where the shared data lives

Training plans are stored in a Supabase (Postgres) project, hosted in an EU region (Frankfurt), so data residency stays inside the EU/EEA.

## Trainer access

Trainers share one passcode (set up by whoever runs the club's Supabase project) to unlock the ability to plan or remove trainings. This isn't a personal account — the app does not know or store *who* made a change, only *that* a change was made by someone who knew the code.

## localStorage

The parts of the app that remember things on your device (ratings, your last-picked group, your setup checklist) use your browser's `localStorage`. That data:
- never leaves your device or gets sent to any server,
- is cleared if you clear your browser's site data,
- is separate for every device/browser you use the app from.

## If this changes

If a future version of the app adds real trainer accounts, names, photos, or anything else that identifies a person, this document will be updated first, along with a proper lawful basis, a way to access/export/delete that data, and (if the app is ever sold or offered commercially) a data processing agreement with Supabase and a lawyer-reviewed policy. None of that exists today because none of it is needed today — the app simply doesn't collect anything personal yet.

## Questions

This is a small volunteer coaching tool, not a commercial product (yet). If you have questions about what it stores, ask whoever manages the club's Supabase project — they can show you the database directly, since nothing here is hidden or opaque.
