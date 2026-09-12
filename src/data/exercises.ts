import type { CategoryId } from './categories'

export interface Cue {
  nl: string
  en: string
}

export interface Exercise {
  id: string
  emoji: string
  title: string
  subtitle?: string
  /** What this exercise trains — used to build a focused training around a theme. */
  categories: CategoryId[]
  /** Suggested duration in minutes when run at its default pace. */
  durationMinutes: number
  goal: string
  steps: string[]
  cues?: Cue[]
  /** A break isn't a "graded" exercise — hidden from rating/library filtering by default. */
  isBreak?: boolean
}

export const exercises: Exercise[] = [
  {
    id: 'welcome',
    emoji: '👋',
    title: 'Welcome circle',
    categories: ['warmup'],
    durationMinutes: 5,
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
    emoji: '🧱',
    title: 'Wall of china',
    categories: ['warmup', 'agility'],
    durationMinutes: 5,
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
    emoji: '🦘',
    title: 'Mario, Jump, Crab, Cheetah',
    subtitle: 'Corner-to-corner movement circuit',
    categories: ['agility', 'warmup'],
    durationMinutes: 5,
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
    emoji: '⛹️',
    title: 'Everybody dribbles',
    categories: ['dribbling', 'agility'],
    durationMinutes: 5,
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
    emoji: '🥤',
    title: 'Water break',
    categories: [],
    durationMinutes: 2,
    goal: 'Drink, breathe, reset.',
    steps: ['Send children to the drinking area.', 'Keep it short and calm before regrouping.'],
    cues: [{ nl: 'Drinkpauze', en: 'Water break' }],
    isBreak: true,
  },
  {
    id: 'treasure-dribbling',
    emoji: '💎',
    title: 'Treasure dribbling',
    categories: ['dribbling', 'teamplay'],
    durationMinutes: 8,
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
    emoji: '🤝',
    title: 'Passing partners',
    categories: ['passing'],
    durationMinutes: 10,
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
    emoji: '🏀',
    title: 'Shooting stations',
    categories: ['shooting'],
    durationMinutes: 10,
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
    cues: [{ nl: 'Buig, kijk, duw', en: 'Bend, look, push' }],
  },
  {
    id: 'mini-game',
    emoji: '🎯',
    title: 'Mini-game: End-zone basketball',
    categories: ['teamplay', 'defense', 'passing', 'shooting'],
    durationMinutes: 7,
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
    emoji: '🎉',
    title: 'Team finish',
    categories: ['teamplay', 'warmup'],
    durationMinutes: 3,
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

export function findExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id)
}
