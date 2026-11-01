/**
 * reactions.js
 * 
 * Playful Gen-Z Contextual Reaction Engine for KAL SE PAKKA.
 * Provides rotated witty, encouraging, and culturally resonant reactions
 * for task completion, postponement, creation, and milestones.
 */

const REACTIONS = {
  completed: [
    "ATE AND LEFT NO CRUMBS. 🔥",
    "MAIN CHARACTER ENERGY! 💅",
    "Bestie, you actually did it. Respect.",
    "NO NOTES. PURE EXCELLENCE. 🚀",
    "Bro cooked and delivered. 🍳",
    "Zero procrastination right here. Huge W.",
  ],
  postponed: [
    "Kal se pakka ka sequel aa gaya 💀",
    "The task has been rescheduled. Interesting.",
    "Procrastination tax applied. We see you. 👀",
    "Delay counter incremented. Academic anxiety loading...",
    'Ah yes, the classic "raat ko fresh dimaag se karenge".',
  ],
  overdue: [
    "The deadline waited. You didn't. 😭",
    "It's giving overdue anxiety. Time to lock in!",
    "The clock already won round 1. Finish it now!",
  ],
  approaching: [
    "Bestie, it's getting real. LOCK IN. 🔒",
    "Hours ticking down! Main character time.",
    "Radar pinging! Finish this before you say Kal Se Pakka.",
  ],
  allCompleted: [
    "PRODUCTIVITY GOD MODE UNLOCKED. 👑",
    "Zero backlog. Who even are you right now?!",
    "Queue cleared! You conquered the Max Heap today.",
  ],
  noTasks: [
    "Itna free time? Suspicious. 🤔",
    "Clean slate. Time to add your next academic quest.",
    "No tasks in queue. The silence is deafening.",
  ],
  created: [
    "Okay, let's get this bread. 🍞",
    "New quest accepted. Time to cook.",
    "Priority calculated by Max Heap. We are locked in.",
    "Scheduled! The algorithm is watching your progress.",
  ],
  deleted: [
    "Poof. Task banished to the shadow realm. 💨",
    "Archived in History. Gone but not forgotten.",
  ],
};

// Track last used indices to guarantee natural rotation without repetition
const lastIndices = {};

/**
 * Returns a rotated reaction string for a given event category.
 * 
 * @param {'completed' | 'postponed' | 'overdue' | 'approaching' | 'allCompleted' | 'noTasks' | 'created' | 'deleted'} category
 * @returns {string}
 */
export function getReaction(category) {
  const list = REACTIONS[category] || REACTIONS.created;
  const lastIdx = lastIndices[category] ?? -1;

  let nextIdx;
  if (list.length <= 1) {
    nextIdx = 0;
  } else {
    do {
      nextIdx = Math.floor(Math.random() * list.length);
    } while (nextIdx === lastIdx);
  }

  lastIndices[category] = nextIdx;
  return list[nextIdx];
}
