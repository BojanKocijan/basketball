export interface Cue {
  nl: string
  en: string
}

export interface Segment {
  id: string
  start: number // minutes from session start
  end: number
  emoji: string
  title: string
  subtitle?: string
  goal: string
  steps: string[]
  cues?: Cue[]
  tip?: string
}

export const totalMinutes = 60

export const segments: Segment[] = [
  {
    id: 'welcome',
    start: 0,
    end: 5,
    emoji: '👋',
    title: 'Welcome circle',
    goal: 'Learn names, set the tone, agree on rules.',
    steps: [
      'Children place one foot on a ball, or hold it still.',
      'Say: "Welkom! Vandaag gaan we spelen, dribbelen, passen en schieten." / "Welcome! Today we’ll play, dribble, pass and shoot."',
      'Introduce both coaches.',
      'Each child says their name and their favourite animal.',
      'Explain three team rules: Stop signal (hand up, "Freeze! / Stop!"), Be kind ("We helpen elkaar."), Have fun (mistakes are allowed).',
      'Quick parent message: "Vandaag draait vooral om plezier, veiligheid en iedereen veel met de bal laten spelen. Aan het einde mogen jullie luid aanmoedigen!"',
    ],
    cues: [
      { nl: 'Welkom!', en: 'Welcome!' },
      { nl: 'Stop / bevries', en: 'Stop / freeze' },
      { nl: 'We helpen elkaar', en: 'We help each other' },
    ],
  },
  {
    id: 'wall-of-china',
    start: 5,
    end: 10,
    emoji: '🧱',
    title: 'Wall of china',
    goal: 'Warm up, run around, have fun as a group.',
    steps: [
      'Pick one child to be the "tagger" who tries to tag other players.',
      'When the tagger tags someone, they join hands and try to tag other players together.',
      'The wall gets longer and longer as more children are tagged.',
      'When the wall reaches 4 kids long, it splits into two separate walls.',
      'Keep playing until one kid is left untagged.',
    ],
  },
  {
    id: 'mario-jump-crab-cheetah',
    start: 10,
    end: 15,
    emoji: '🦘',
    title: 'Mario, Jump, Crab, Cheetah',
    subtitle: 'Corner-to-corner movement circuit',
    goal: 'Coordination, fun movement patterns, listening for the whistle.',
    steps: [
      'Start at corner 1.',
      'Corner 1 → middle line: run while jumping and punching the sky, like Mario.',
      'Middle line → corner 2: two small jumps, then one big jump.',
      'Corner 2 → corner 3: crab run (low squat).',
      'Corner 3 → corner 4: run as fast as you can, like a cheetah.',
      'Round 1: do the full circuit normally.',
      'Round 2: same circuit, but freeze completely when the whistle blows.',
    ],
  },
  {
    id: 'everybody-dribbles',
    start: 15,
    end: 20,
    emoji: '⛹️',
    title: 'Everybody dribbles',
    goal: 'Ball familiarity and dribbling control.',
    steps: [
      'Give every child a ball and define a safe playing area.',
      'Round 1 – Ball gevoel (ball feel): move the ball around the body without bouncing — left to right, around the tummy, throw and catch.',
      'Round 2 – Body challenges: call out Low/laag, High/hoog, Other hand/andere hand, Sit down and stand up, Turn around/draai rond.',
      'Round 3 – Traffic lights: dribble corner to corner around the court. Green/groen = dribble forwards, Orange/oranje = dribble backwards, Red/rood = stop the ball and freeze.',
    ],
    cues: [
      { nl: 'Laag', en: 'Low' },
      { nl: 'Hoog', en: 'High' },
      { nl: 'Andere hand', en: 'Other hand' },
      { nl: 'Groen', en: 'Green — forwards' },
      { nl: 'Oranje', en: 'Orange — backwards' },
      { nl: 'Rood', en: 'Red — stop & freeze' },
    ],
  },
  {
    id: 'break',
    start: 20,
    end: 22,
    emoji: '🥤',
    title: 'Water break',
    goal: 'Drink, breathe, reset.',
    steps: ['Send children to the drinking area.', 'Keep it short and calm before regrouping.'],
    cues: [{ nl: 'Drinkpauze', en: 'Water break' }],
  },
  {
    id: 'treasure-dribbling',
    start: 22,
    end: 30,
    emoji: '💎',
    title: 'Treasure dribbling',
    goal: 'Dribbling under light pressure, teamwork, weaker-hand practice.',
    steps: [
      'Put cones or bibs ("the treasure") in the centre. Split children between two home bases.',
      'One child at a time from each team dribbles to the centre, collects one treasure, dribbles back, and high-fives the next player.',
      'Play two or three short rounds. Use the weaker hand for the second round.',
      'Keep score unimportant, or finish with a tie.',
      'If waiting gets long, let two children from each team go at the same time.',
      'Challenge returning players to use their weaker hand. Let beginners carry the treasure while controlling the ball however they can.',
    ],
  },
  {
    id: 'passing-partners',
    start: 30,
    end: 40,
    emoji: '🤝',
    title: 'Passing partners',
    goal: 'Chest passing technique and cooperation.',
    steps: [
      'Pair children carefully — ideally a confident child with a newer child. Stand about two large steps apart.',
      'Teach: hands ready like a target, push the ball toward your partner, step toward your partner, call your partner’s name.',
      'Use chest passes first. Allow a bounce pass if it helps a beginner succeed.',
      'Progression: five successful passes → take one step farther apart → pass and move to a new cone.',
      'Challenge: how many good passes can the pair make in 30 seconds?',
      'Do not correct every technical detail — successful cooperation matters most.',
    ],
    cues: [
      { nl: 'Klaar?', en: 'Ready?' },
      { nl: 'Handen klaar', en: 'Hands ready' },
      { nl: 'Stap en duw', en: 'Step and push' },
      { nl: 'Kijk naar je maatje', en: 'Look at your teammate' },
      { nl: 'Goede pass!', en: 'Good pass!' },
    ],
  },
  {
    id: 'shooting-stations',
    start: 40,
    end: 50,
    emoji: '🏀',
    title: 'Shooting stations',
    goal: 'Everyone shoots, everyone scores, everyone is celebrated.',
    steps: [
      'Split into two groups of four or five. One coach leads each basket.',
      'Station routine: start close to the basket → shoot → collect your own ball → pass to the next child → join the back of the short line.',
      'Use floor markers so children know where to stand.',
      'Simple shooting cue: "Bend, look, push." / "Buig, kijk, duw."',
      'After a few minutes, add a challenge: beginners shoot very close, experienced children take one step back.',
      'Everyone tries to score one basket — celebrate each child’s first basket enthusiastically.',
      'Avoid demanding adult shooting form — success and confidence matter more at this age.',
    ],
    cues: [
      { nl: 'Buig, kijk, duw', en: 'Bend, look, push' },
    ],
  },
  {
    id: 'mini-game',
    start: 50,
    end: 57,
    emoji: '🎯',
    title: 'Mini-game: End-zone basketball',
    goal: 'Team play, everyone touches the ball.',
    steps: [
      'Play 4-v-4 or 5-v-5 across a small area, using two cone end zones instead of baskets.',
      'A team scores by passing to a teammate standing in the opposing end zone.',
      'Rules: no stealing the ball from someone’s hands; defenders give some space; after receiving the ball, stop and pass; everyone should touch the ball.',
      'Coaches can join in or act as helpers if a team needs support.',
      'Coach lightly — let the game flow. Do not keep a serious score; reset quickly after each point.',
    ],
    cues: [
      { nl: 'Vrij!', en: 'Open!' },
      { nl: 'Passen!', en: 'Pass!' },
      { nl: 'Kijk om je heen', en: 'Look around!' },
      { nl: 'Goed samengespeeld!', en: 'Nice teamwork!' },
      { nl: 'Geef ruimte', en: 'Give space!' },
    ],
  },
  {
    id: 'team-finish',
    start: 57,
    end: 60,
    emoji: '🎉',
    title: 'Team finish',
    goal: 'Reflect together and celebrate as a team.',
    steps: [
      'Gather in a circle, balls still on the floor.',
      'Ask: "Wat vond je leuk? / What did you enjoy?"',
      'Ask: "Wie heeft vandaag iets nieuws geprobeerd? / Who tried something new?"',
      'Finish with everyone putting one hand in: "Team on three! Eén, twee, drie — TEAM!"',
      'Invite the children to show parents one favourite move, or take a final group shot while parents cheer.',
    ],
  },
]

export const setupChecklist = [
  'One ball per child, if possible',
  'Two baskets at the lowest available height',
  'About 12 cones',
  'Two different-coloured sets of bibs',
  'A clear drinking area',
  'A small "home base" marked with cones where children gather',
]

export const coachRoles = [
  {
    role: 'Coach 1',
    description: 'Welcomes families, gives very short bilingual instructions.',
  },
  {
    role: 'Coach 2',
    description: 'Demonstrates every activity and runs one station.',
  },
]

export const coachingPrinciples = [
  'Demonstrate every activity physically',
  'Give no more than one or two instructions at once',
  'Use names as often as possible',
  'Keep queues to three children or fewer',
  'Never eliminate a child from a game',
  'Give beginners permission to simplify the task',
  'Give experienced children an extra challenge quietly',
  'Stop an activity while it is still fun',
  'Praise courage, kindness and effort — not only baskets',
  'Demonstrate first; speak second',
  'Use the same hand signals and key words in both languages',
]

export const vocabulary: Cue[] = [
  { nl: 'Luister en kijk', en: 'Listen and look' },
  { nl: 'Stop / bevries', en: 'Stop / freeze' },
  { nl: 'Bal stil', en: 'Ball still' },
  { nl: 'Dribbelen', en: 'Dribble' },
  { nl: 'Passen', en: 'Pass' },
  { nl: 'Schieten', en: 'Shoot' },
  { nl: 'Wisselen', en: 'Switch' },
  { nl: 'Andere hand', en: 'Other hand' },
  { nl: 'Zoek een maatje', en: 'Find a partner' },
  { nl: 'Kom bij elkaar', en: 'Come together' },
  { nl: 'Goed geprobeerd', en: 'Good try' },
  { nl: 'Goed samengespeeld', en: 'Nice teamwork' },
  { nl: 'Nog één keer', en: 'One more time' },
  { nl: 'Drinkpauze', en: 'Water break' },
]
