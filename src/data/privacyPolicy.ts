/** Full GDPR/AVG privacy notice content, shown as an in-app page (see PrivacyPolicyScreen)
 * rather than a static file, so parents and coaches can read it from inside the app itself.
 *
 * Content reflects exactly what this app's schema actually stores today (see
 * sports-training-api's supabase/schema.sql) — no invented data categories. The two
 * `[placeholder]` fields are the only parts a real club must fill in themselves; Claude has
 * no authority to declare an organization's legal contact details on its behalf. Treat this
 * as a solid first draft, not a substitute for the club committee's own legal sign-off.
 */
export interface PolicySection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export function buildPrivacySections(clubName: string): PolicySection[] {
  return [
    {
      heading: '1. Who is responsible for this data',
      paragraphs: [
        `${clubName} ("the club") is the data controller for the information described in this notice. This app is a tool the club's trainers use to plan trainings and track training progress — it is not a public service and is not used to collect data for any purpose beyond running the club's youth basketball program.`,
        'Questions or requests about your data can be sent to: [the club\'s privacy contact — e.g. board@your-club.example].',
      ],
    },
    {
      heading: '2. What data this app stores',
      paragraphs: ['For each player in a group, the app stores:'],
      bullets: [
        'A nickname or first name, as entered by a trainer',
        'Jersey number and jersey colour (optional, for on-court identification)',
        'Per-training skill ratings (a simple 1-3 score per category, e.g. dribbling, passing) logged by a trainer after a session',
      ],
    },
    {
      heading: '3. What this app does not collect',
      paragraphs: ['To keep this clear: the app does not ask players or parents to create an account, log in, or provide an email address, phone number, date of birth, address, or photo. There is no player-facing login at all — only trainers unlock a group with a shared trainer passcode.'],
    },
    {
      heading: '4. Why this data is processed',
      paragraphs: [
        'The nickname, jersey details, and skill ratings exist so trainers can run organised, age-appropriate trainings and see how a group and its players are progressing over a season. This is a legitimate interest of the club in running its youth program — see the club for the specific legal basis it relies on for children\'s data, including whether it obtains parental consent before a child is added.',
      ],
    },
    {
      heading: '5. Who can see this data',
      paragraphs: [
        'Data for a group is visible to whoever holds that group\'s trainer passcode — normally the group\'s coaches. It is not visible to other groups, and there is no public-facing view of player names or ratings.',
      ],
    },
    {
      heading: '6. Where data is stored',
      paragraphs: [
        'Data is stored in a Supabase (PostgreSQL) database and the app itself is hosted on Netlify. [The club should confirm and state the hosting region here, e.g. "the EU", once known.]',
      ],
    },
    {
      heading: '7. How long data is kept',
      paragraphs: [
        'This app does not automatically delete player records at the end of a season. Retention is a decision for the club to make and apply — e.g. removing a player\'s record once they leave the club. A trainer can remove a player and their ratings from the Players tab at any time.',
      ],
    },
    {
      heading: '8. Your rights',
      paragraphs: [
        'A parent or guardian can ask the club to see, correct, or delete a child\'s data at any time, free of charge, by contacting the club at the address in section 1. The club will action a deletion request by removing the player from the app.',
      ],
    },
    {
      heading: '9. Children\'s data',
      paragraphs: [
        'The players in this app are minors. The club is responsible for obtaining any parental consent required before a child\'s nickname and ratings are entered, in line with its own club policy and applicable law.',
      ],
    },
  ]
}
