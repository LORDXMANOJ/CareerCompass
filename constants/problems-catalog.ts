// =============================================================================
// CareerCompass — Curated Coding Problem Catalog
// =============================================================================
// Contains normalized problem entries from LeetCode (Blind 75 + extras) and
// Codeforces (curated Div2 A/B/C). Each entry has topic tags, role relevance,
// and company tags mapped to VERIFIED_COMPANIES IDs.
//
// This is a STATIC catalog. No scraping, no session cookies, no ToS violations.
// =============================================================================

import { CodingProblem } from "@/types/problems";

// ---------------------------------------------------------------------------
// Helper to build a LeetCode problem entry
// ---------------------------------------------------------------------------
function lc(
  id: string,
  externalId: string,
  title: string,
  slug: string,
  difficulty: CodingProblem["difficulty"],
  topic: CodingProblem["topic"],
  tags: string[],
  roleRelevance: Record<string, number>,
  companyTags: string[]
): CodingProblem {
  return {
    id: `lc-${id}`,
    provider: "leetcode",
    externalId,
    title,
    slug,
    difficulty,
    url: `https://leetcode.com/problems/${slug}/`,
    topic,
    tags,
    roleRelevance,
    companyTags,
  };
}

// ---------------------------------------------------------------------------
// Helper to build a Codeforces problem entry
// ---------------------------------------------------------------------------
function cf(
  id: string,
  externalId: string,
  title: string,
  slug: string,
  difficulty: CodingProblem["difficulty"],
  topic: CodingProblem["topic"],
  tags: string[],
  roleRelevance: Record<string, number>,
  companyTags: string[]
): CodingProblem {
  const [contestId, index] = [externalId.replace(/[A-Z]$/, ""), externalId.slice(-1)];
  return {
    id: `cf-${id}`,
    provider: "codeforces",
    externalId,
    title,
    slug,
    difficulty,
    url: `https://codeforces.com/problemset/problem/${contestId}/${index}`,
    topic,
    tags,
    roleRelevance,
    companyTags,
  };
}

// Shared role relevance profiles
const SWE_HEAVY: Record<string, number> = {
  "software-engineer": 1.0, "backend-developer": 0.9, "full-stack-engineer": 0.85,
  "frontend-developer": 0.5, "ai-engineer": 0.6, "devops-engineer": 0.4,
};
const BACKEND_HEAVY: Record<string, number> = {
  "backend-developer": 1.0, "software-engineer": 0.95, "full-stack-engineer": 0.8,
  "devops-engineer": 0.5, "cloud-engineer": 0.4,
};

const COMPETITIVE: Record<string, number> = {
  "software-engineer": 0.9, "backend-developer": 0.85, "ai-engineer": 0.7,
  "full-stack-engineer": 0.6,
};

// =============================================================================
// LEETCODE CATALOG — Blind 75 + Extras (~85 problems)
// =============================================================================
export const LEETCODE_PROBLEMS: CodingProblem[] = [
  // ---- Arrays & Hashing ----
  lc("001", "1", "Two Sum", "two-sum", "Easy", "Arrays",
    ["hash-map", "brute-force"], SWE_HEAVY, ["google", "amazon", "meta", "microsoft", "apple"]),
  lc("002", "217", "Contains Duplicate", "contains-duplicate", "Easy", "Arrays",
    ["hash-set", "sorting"], SWE_HEAVY, ["amazon", "google", "adobe"]),
  lc("003", "242", "Valid Anagram", "valid-anagram", "Easy", "Strings",
    ["hash-map", "sorting"], SWE_HEAVY, ["amazon", "microsoft", "uber"]),
  lc("004", "49", "Group Anagrams", "group-anagrams", "Medium", "Strings",
    ["hash-map", "sorting"], SWE_HEAVY, ["amazon", "meta", "google"]),
  lc("005", "347", "Top K Frequent Elements", "top-k-frequent-elements", "Medium", "Arrays",
    ["hash-map", "heap", "bucket-sort"], SWE_HEAVY, ["amazon", "meta", "google", "apple"]),
  lc("006", "238", "Product of Array Except Self", "product-of-array-except-self", "Medium", "Arrays",
    ["prefix-sum"], SWE_HEAVY, ["amazon", "meta", "microsoft", "apple"]),
  lc("007", "271", "Encode and Decode Strings", "encode-and-decode-strings", "Medium", "Strings",
    ["design"], BACKEND_HEAVY, ["google", "meta"]),
  lc("008", "128", "Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium", "Arrays",
    ["hash-set", "union-find"], SWE_HEAVY, ["google", "amazon", "meta"]),

  // ---- Two Pointers ----
  lc("009", "125", "Valid Palindrome", "valid-palindrome", "Easy", "Two Pointers",
    ["string", "two-pointers"], SWE_HEAVY, ["meta", "microsoft"]),
  lc("010", "15", "3Sum", "3sum", "Medium", "Two Pointers",
    ["sorting", "two-pointers"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft"]),
  lc("011", "11", "Container With Most Water", "container-with-most-water", "Medium", "Two Pointers",
    ["greedy", "two-pointers"], SWE_HEAVY, ["amazon", "google", "goldman-sachs"]),

  // ---- Sliding Window ----
  lc("012", "121", "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", "Sliding Window",
    ["dynamic-programming", "greedy"], SWE_HEAVY, ["amazon", "meta", "google", "goldman-sachs"]),
  lc("013", "3", "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", "Sliding Window",
    ["hash-map", "sliding-window"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft", "apple"]),
  lc("014", "424", "Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", "Sliding Window",
    ["sliding-window", "hash-map"], SWE_HEAVY, ["google", "amazon"]),
  lc("015", "76", "Minimum Window Substring", "minimum-window-substring", "Hard", "Sliding Window",
    ["sliding-window", "hash-map"], SWE_HEAVY, ["meta", "google", "amazon", "uber"]),

  // ---- Stack ----
  lc("016", "20", "Valid Parentheses", "valid-parentheses", "Easy", "Stack",
    ["stack", "string"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft"]),
  lc("017", "155", "Min Stack", "min-stack", "Medium", "Stack",
    ["stack", "design"], SWE_HEAVY, ["amazon", "microsoft"]),
  lc("018", "150", "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", "Stack",
    ["stack", "math"], SWE_HEAVY, ["amazon", "google"]),
  lc("019", "84", "Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", "Stack",
    ["stack", "monotonic-stack"], SWE_HEAVY, ["google", "amazon", "microsoft"]),

  // ---- Binary Search ----
  lc("020", "704", "Binary Search", "binary-search", "Easy", "Binary Search",
    ["binary-search"], SWE_HEAVY, ["google", "microsoft"]),
  lc("021", "33", "Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", "Binary Search",
    ["binary-search"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft"]),
  lc("022", "153", "Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", "Binary Search",
    ["binary-search"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("023", "4", "Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "Hard", "Binary Search",
    ["binary-search", "divide-and-conquer"], SWE_HEAVY, ["google", "amazon", "apple", "goldman-sachs"]),

  // ---- Linked List ----
  lc("024", "206", "Reverse Linked List", "reverse-linked-list", "Easy", "Linked List",
    ["linked-list", "recursion"], SWE_HEAVY, ["amazon", "microsoft", "apple"]),
  lc("025", "21", "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", "Linked List",
    ["linked-list", "recursion"], SWE_HEAVY, ["amazon", "microsoft", "google"]),
  lc("026", "141", "Linked List Cycle", "linked-list-cycle", "Easy", "Linked List",
    ["linked-list", "two-pointers"], SWE_HEAVY, ["amazon", "microsoft"]),
  lc("027", "143", "Reorder List", "reorder-list", "Medium", "Linked List",
    ["linked-list", "two-pointers", "stack"], SWE_HEAVY, ["amazon", "meta"]),
  lc("028", "23", "Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", "Linked List",
    ["linked-list", "heap", "divide-and-conquer"], SWE_HEAVY, ["amazon", "google", "meta", "microsoft"]),
  lc("029", "19", "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", "Linked List",
    ["linked-list", "two-pointers"], SWE_HEAVY, ["amazon", "meta"]),

  // ---- Trees ----
  lc("030", "226", "Invert Binary Tree", "invert-binary-tree", "Easy", "Trees",
    ["binary-tree", "dfs", "bfs"], SWE_HEAVY, ["google", "amazon"]),
  lc("031", "104", "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", "Trees",
    ["binary-tree", "dfs", "recursion"], SWE_HEAVY, ["amazon", "microsoft", "google"]),
  lc("032", "100", "Same Tree", "same-tree", "Easy", "Trees",
    ["binary-tree", "dfs"], SWE_HEAVY, ["amazon", "microsoft"]),
  lc("033", "572", "Subtree of Another Tree", "subtree-of-another-tree", "Easy", "Trees",
    ["binary-tree", "dfs", "string-matching"], SWE_HEAVY, ["amazon", "meta"]),
  lc("034", "235", "Lowest Common Ancestor of BST", "lowest-common-ancestor-of-a-binary-search-tree", "Medium", "Binary Search Trees",
    ["binary-search-tree", "dfs"], SWE_HEAVY, ["meta", "amazon", "microsoft"]),
  lc("035", "102", "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", "Trees",
    ["binary-tree", "bfs"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft"]),
  lc("036", "98", "Validate Binary Search Tree", "validate-binary-search-tree", "Medium", "Binary Search Trees",
    ["binary-search-tree", "dfs"], SWE_HEAVY, ["amazon", "meta", "google"]),
  lc("037", "230", "Kth Smallest Element in BST", "kth-smallest-element-in-a-bst", "Medium", "Binary Search Trees",
    ["binary-search-tree", "dfs", "inorder"], SWE_HEAVY, ["amazon", "meta"]),
  lc("038", "105", "Construct Binary Tree from Preorder and Inorder", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", "Trees",
    ["binary-tree", "recursion", "hash-map"], SWE_HEAVY, ["google", "microsoft", "amazon"]),
  lc("039", "124", "Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", "Trees",
    ["binary-tree", "dfs", "dynamic-programming"], SWE_HEAVY, ["google", "meta", "amazon"]),
  lc("040", "297", "Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "Hard", "Trees",
    ["binary-tree", "design", "bfs", "dfs"], BACKEND_HEAVY, ["google", "meta", "amazon", "uber"]),

  // ---- Heaps / Priority Queue ----
  lc("041", "295", "Find Median from Data Stream", "find-median-from-data-stream", "Hard", "Heaps",
    ["heap", "design", "sorting"], BACKEND_HEAVY, ["amazon", "google", "meta", "microsoft"]),
  lc("042", "703", "Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "Easy", "Heaps",
    ["heap", "design"], SWE_HEAVY, ["amazon"]),

  // ---- Graphs ----
  lc("043", "200", "Number of Islands", "number-of-islands", "Medium", "Graphs",
    ["bfs", "dfs", "union-find", "matrix"], SWE_HEAVY, ["amazon", "meta", "google", "microsoft"]),
  lc("044", "133", "Clone Graph", "clone-graph", "Medium", "Graphs",
    ["bfs", "dfs", "hash-map"], SWE_HEAVY, ["meta", "google", "amazon"]),
  lc("045", "417", "Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", "Graphs",
    ["bfs", "dfs", "matrix"], SWE_HEAVY, ["google", "amazon"]),
  lc("046", "207", "Course Schedule", "course-schedule", "Medium", "Graphs",
    ["topological-sort", "bfs", "dfs"], SWE_HEAVY, ["amazon", "meta", "google"]),
  lc("047", "323", "Number of Connected Components", "number-of-connected-components-in-an-undirected-graph", "Medium", "Graphs",
    ["union-find", "dfs", "bfs"], SWE_HEAVY, ["google", "amazon"]),
  lc("048", "261", "Graph Valid Tree", "graph-valid-tree", "Medium", "Graphs",
    ["union-find", "dfs", "bfs"], SWE_HEAVY, ["google", "amazon"]),

  // ---- Dynamic Programming ----
  lc("049", "70", "Climbing Stairs", "climbing-stairs", "Easy", "Dynamic Programming",
    ["dynamic-programming", "math"], SWE_HEAVY, ["amazon", "google", "apple"]),
  lc("050", "198", "House Robber", "house-robber", "Medium", "Dynamic Programming",
    ["dynamic-programming"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("051", "213", "House Robber II", "house-robber-ii", "Medium", "Dynamic Programming",
    ["dynamic-programming"], SWE_HEAVY, ["amazon", "google"]),
  lc("052", "5", "Longest Palindromic Substring", "longest-palindromic-substring", "Medium", "Dynamic Programming",
    ["dynamic-programming", "string"], SWE_HEAVY, ["amazon", "meta", "microsoft"]),
  lc("053", "647", "Palindromic Substrings", "palindromic-substrings", "Medium", "Dynamic Programming",
    ["dynamic-programming", "string"], SWE_HEAVY, ["meta", "amazon"]),
  lc("054", "91", "Decode Ways", "decode-ways", "Medium", "Dynamic Programming",
    ["dynamic-programming", "string"], SWE_HEAVY, ["meta", "amazon", "google"]),
  lc("055", "322", "Coin Change", "coin-change", "Medium", "Dynamic Programming",
    ["dynamic-programming", "bfs"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("056", "300", "Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", "Dynamic Programming",
    ["dynamic-programming", "binary-search"], SWE_HEAVY, ["amazon", "google", "meta"]),
  lc("057", "152", "Maximum Product Subarray", "maximum-product-subarray", "Medium", "Dynamic Programming",
    ["dynamic-programming"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("058", "139", "Word Break", "word-break", "Medium", "Dynamic Programming",
    ["dynamic-programming", "trie", "hash-set"], SWE_HEAVY, ["amazon", "meta", "google", "apple"]),
  lc("059", "377", "Combination Sum IV", "combination-sum-iv", "Medium", "Dynamic Programming",
    ["dynamic-programming"], SWE_HEAVY, ["google", "meta"]),
  lc("060", "62", "Unique Paths", "unique-paths", "Medium", "Dynamic Programming",
    ["dynamic-programming", "math"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("061", "1143", "Longest Common Subsequence", "longest-common-subsequence", "Medium", "Dynamic Programming",
    ["dynamic-programming"], SWE_HEAVY, ["amazon", "google"]),

  // ---- Greedy ----
  lc("062", "53", "Maximum Subarray", "maximum-subarray", "Medium", "Greedy",
    ["dynamic-programming", "greedy", "divide-and-conquer"], SWE_HEAVY, ["amazon", "google", "microsoft", "apple"]),
  lc("063", "55", "Jump Game", "jump-game", "Medium", "Greedy",
    ["greedy", "dynamic-programming"], SWE_HEAVY, ["amazon", "google"]),

  // ---- Intervals ----
  lc("064", "57", "Insert Interval", "insert-interval", "Medium", "Intervals",
    ["intervals", "sorting"], SWE_HEAVY, ["google", "meta", "amazon"]),
  lc("065", "56", "Merge Intervals", "merge-intervals", "Medium", "Intervals",
    ["intervals", "sorting"], SWE_HEAVY, ["google", "meta", "amazon", "microsoft"]),
  lc("066", "435", "Non-overlapping Intervals", "non-overlapping-intervals", "Medium", "Intervals",
    ["intervals", "greedy", "sorting"], SWE_HEAVY, ["google", "amazon"]),
  lc("067", "252", "Meeting Rooms", "meeting-rooms", "Easy", "Intervals",
    ["intervals", "sorting"], SWE_HEAVY, ["amazon", "meta"]),
  lc("068", "253", "Meeting Rooms II", "meeting-rooms-ii", "Medium", "Intervals",
    ["intervals", "heap", "sorting"], SWE_HEAVY, ["amazon", "meta", "google"]),

  // ---- Matrix ----
  lc("069", "73", "Set Matrix Zeroes", "set-matrix-zeroes", "Medium", "Matrix",
    ["matrix", "hash-set"], SWE_HEAVY, ["amazon", "microsoft", "meta"]),
  lc("070", "54", "Spiral Matrix", "spiral-matrix", "Medium", "Matrix",
    ["matrix", "simulation"], SWE_HEAVY, ["amazon", "google", "microsoft"]),
  lc("071", "48", "Rotate Image", "rotate-image", "Medium", "Matrix",
    ["matrix", "math"], SWE_HEAVY, ["amazon", "microsoft", "google", "apple"]),
  lc("072", "79", "Word Search", "word-search", "Medium", "Matrix",
    ["matrix", "backtracking", "dfs"], SWE_HEAVY, ["amazon", "microsoft", "meta"]),

  // ---- Bit Manipulation ----
  lc("073", "191", "Number of 1 Bits", "number-of-1-bits", "Easy", "Bit Manipulation",
    ["bit-manipulation"], SWE_HEAVY, ["apple", "microsoft"]),
  lc("074", "338", "Counting Bits", "counting-bits", "Easy", "Bit Manipulation",
    ["bit-manipulation", "dynamic-programming"], SWE_HEAVY, ["amazon", "google"]),
  lc("075", "268", "Missing Number", "missing-number", "Easy", "Bit Manipulation",
    ["bit-manipulation", "math", "hash-set"], SWE_HEAVY, ["amazon", "microsoft", "apple"]),
  lc("076", "190", "Reverse Bits", "reverse-bits", "Easy", "Bit Manipulation",
    ["bit-manipulation"], SWE_HEAVY, ["apple", "amazon"]),

  // ---- Trie ----
  lc("077", "208", "Implement Trie", "implement-trie-prefix-tree", "Medium", "Trie",
    ["trie", "design"], SWE_HEAVY, ["google", "amazon", "microsoft"]),
  lc("078", "211", "Design Add and Search Words", "design-add-and-search-words-data-structure", "Medium", "Trie",
    ["trie", "dfs", "design"], SWE_HEAVY, ["meta", "amazon"]),
  lc("079", "212", "Word Search II", "word-search-ii", "Hard", "Trie",
    ["trie", "backtracking", "dfs"], SWE_HEAVY, ["amazon", "google", "microsoft"]),

  // ---- Backtracking ----
  lc("080", "39", "Combination Sum", "combination-sum", "Medium", "Backtracking",
    ["backtracking", "recursion"], SWE_HEAVY, ["amazon", "meta"]),

  // ---- Extra Essential Problems ----
  lc("081", "146", "LRU Cache", "lru-cache", "Medium", "Hash Map",
    ["design", "hash-map", "linked-list"], BACKEND_HEAVY, ["amazon", "google", "meta", "microsoft", "uber"]),
  lc("082", "42", "Trapping Rain Water", "trapping-rain-water", "Hard", "Two Pointers",
    ["two-pointers", "stack", "dynamic-programming"], SWE_HEAVY, ["google", "amazon", "meta", "goldman-sachs"]),
  lc("083", "287", "Find the Duplicate Number", "find-the-duplicate-number", "Medium", "Binary Search",
    ["binary-search", "two-pointers", "bit-manipulation"], SWE_HEAVY, ["amazon", "google"]),
  lc("084", "36", "Valid Sudoku", "valid-sudoku", "Medium", "Matrix",
    ["matrix", "hash-set"], SWE_HEAVY, ["amazon", "microsoft", "uber"]),
  lc("085", "647", "Palindromic Substrings", "palindromic-substrings", "Medium", "Dynamic Programming",
    ["dynamic-programming", "string", "two-pointers"], SWE_HEAVY, ["meta", "amazon"]),
];

// =============================================================================
// CODEFORCES CATALOG — Curated Div2 A/B/C (~40 problems)
// =============================================================================
export const CODEFORCES_PROBLEMS: CodingProblem[] = [
  // ---- Div2 A (Easy / Warm-up) ----
  cf("001", "1A", "Theatre Square", "theatre-square", "Easy", "Math",
    ["math", "implementation"], COMPETITIVE, []),
  cf("002", "4A", "Watermelon", "watermelon", "Easy", "Math",
    ["math", "brute-force"], COMPETITIVE, []),
  cf("003", "71A", "Way Too Long Words", "way-too-long-words", "Easy", "Strings",
    ["strings", "implementation"], COMPETITIVE, []),
  cf("004", "158A", "Next Round", "next-round", "Easy", "Implementation",
    ["implementation", "sorting"], COMPETITIVE, []),
  cf("005", "231A", "Team", "team", "Easy", "Implementation",
    ["implementation", "greedy"], COMPETITIVE, []),
  cf("006", "282A", "Bit++", "bit-plus-plus", "Easy", "Implementation",
    ["implementation", "simulation"], COMPETITIVE, []),
  cf("007", "263A", "Beautiful Matrix", "beautiful-matrix", "Easy", "Implementation",
    ["implementation", "math"], COMPETITIVE, []),
  cf("008", "339A", "Helpful Maths", "helpful-maths", "Easy", "Sorting",
    ["sorting", "strings", "greedy"], COMPETITIVE, []),
  cf("009", "96A", "Football", "football", "Easy", "Strings",
    ["strings", "implementation"], COMPETITIVE, []),
  cf("010", "50A", "Domino Piling", "domino-piling", "Easy", "Math",
    ["math", "greedy"], COMPETITIVE, []),

  // ---- Div2 B (Easy-Medium) ----
  cf("011", "4B", "Before an Exam", "before-an-exam", "Medium", "Greedy",
    ["greedy", "constructive", "implementation"], COMPETITIVE, []),
  cf("012", "189A", "Cut Ribbon", "cut-ribbon", "Medium", "Dynamic Programming",
    ["dynamic-programming"], COMPETITIVE, []),
  cf("013", "546B", "Soldier and Badges", "soldier-and-badges", "Medium", "Sorting",
    ["sorting", "greedy", "implementation"], COMPETITIVE, []),
  cf("014", "230B", "T-primes", "t-primes", "Medium", "Math",
    ["math", "binary-search", "number-theory"], COMPETITIVE, []),
  cf("015", "466B", "Wonder Room", "wonder-room", "Medium", "Math",
    ["math", "brute-force"], COMPETITIVE, []),
  cf("016", "327A", "Flipping Game", "flipping-game", "Medium", "Arrays",
    ["arrays", "brute-force", "implementation"], COMPETITIVE, []),
  cf("017", "492B", "Vanya and Lanterns", "vanya-and-lanterns", "Medium", "Binary Search",
    ["binary-search", "sorting", "greedy"], COMPETITIVE, []),
  cf("018", "550A", "Two Substrings", "two-substrings", "Medium", "Strings",
    ["strings", "greedy", "implementation"], COMPETITIVE, []),
  cf("019", "518B", "Tanya and Postards", "tanya-and-postcards", "Medium", "Greedy",
    ["greedy", "hash-map", "strings"], COMPETITIVE, []),
  cf("020", "580A", "Kefa and First Steps", "kefa-and-first-steps", "Medium", "Arrays",
    ["arrays", "dynamic-programming", "implementation"], COMPETITIVE, []),

  // ---- Div2 C (Medium-Hard) ----
  cf("021", "1352C", "K-th Not Divisible by N", "k-th-not-divisible-by-n", "Medium", "Math",
    ["math", "binary-search"], COMPETITIVE, []),
  cf("022", "1183C", "Computer Game", "computer-game", "Medium", "Greedy",
    ["greedy", "implementation"], COMPETITIVE, []),
  cf("023", "1176C", "Lose it!", "lose-it", "Medium", "Greedy",
    ["greedy", "two-pointers", "implementation"], COMPETITIVE, []),
  cf("024", "1294C", "Product of Three Numbers", "product-of-three-numbers", "Medium", "Math",
    ["math", "number-theory", "brute-force"], COMPETITIVE, []),
  cf("025", "977C", "Less or Equal", "less-or-equal", "Medium", "Sorting",
    ["sorting", "implementation"], COMPETITIVE, []),
  cf("026", "1334C", "Circle of Monsters", "circle-of-monsters", "Medium", "Greedy",
    ["greedy", "math"], COMPETITIVE, []),
  cf("027", "1374C", "Move Brackets", "move-brackets", "Easy", "Stack",
    ["stack", "greedy", "strings"], COMPETITIVE, []),
  cf("028", "1353C", "Board Moves", "board-moves", "Medium", "Math",
    ["math", "greedy"], COMPETITIVE, []),
  cf("029", "1325C", "Ehab and Path-etic MEXs", "ehab-and-path-etic-mexs", "Medium", "Trees",
    ["trees", "greedy", "constructive"], COMPETITIVE, []),
  cf("030", "1296C", "Yet Another Walking Robot", "yet-another-walking-robot", "Medium", "Hash Map",
    ["hash-map", "implementation"], COMPETITIVE, []),

  // ---- Competitive DSA (Div2 C/D bridging) ----
  cf("031", "1200C", "Round Corridor", "round-corridor", "Medium", "Math",
    ["math", "number-theory", "gcd"], COMPETITIVE, []),
  cf("032", "1151C", "Problem for Nazar", "problem-for-nazar", "Medium", "Math",
    ["math", "binary-search", "implementation"], COMPETITIVE, []),
  cf("033", "1131C", "Birthday", "birthday", "Medium", "Sorting",
    ["sorting", "greedy", "constructive"], COMPETITIVE, []),
  cf("034", "1037C", "Equalize", "equalize", "Medium", "Greedy",
    ["greedy", "strings", "dynamic-programming"], COMPETITIVE, []),
  cf("035", "1006C", "Three Parts of the Array", "three-parts-of-the-array", "Medium", "Two Pointers",
    ["two-pointers", "binary-search"], COMPETITIVE, []),
  cf("036", "999C", "Alphabetic Removals", "alphabetic-removals", "Easy", "Strings",
    ["strings", "sorting", "implementation"], COMPETITIVE, []),
  cf("037", "985C", "Liebig's Barrel", "liebigs-barrel", "Hard", "Greedy",
    ["greedy", "sorting", "binary-search"], COMPETITIVE, []),
  cf("038", "978C", "Letters", "letters", "Easy", "Binary Search",
    ["binary-search", "implementation"], COMPETITIVE, []),
  cf("039", "961C", "Chessboard", "chessboard", "Medium", "Implementation",
    ["implementation", "brute-force", "math"], COMPETITIVE, []),
  cf("040", "950C", "Zebras", "zebras", "Medium", "Greedy",
    ["greedy", "constructive", "implementation"], COMPETITIVE, []),
];

// =============================================================================
// Combined Full Catalog
// =============================================================================
export const PROBLEMS_CATALOG: CodingProblem[] = [
  ...LEETCODE_PROBLEMS,
  ...CODEFORCES_PROBLEMS,
];

// =============================================================================
// Topic definitions for filter UI
// =============================================================================
export const DSA_TOPICS: CodingProblem["topic"][] = [
  "Arrays", "Strings", "Hash Map", "Two Pointers", "Sliding Window",
  "Binary Search", "Linked List", "Stack", "Queue", "Trees",
  "Binary Trees", "Binary Search Trees", "Heaps", "Graphs",
  "Dynamic Programming", "Greedy", "Backtracking", "Recursion",
  "Sorting", "Math", "Bit Manipulation", "Trie", "Union Find",
  "Intervals", "Matrix", "Implementation", "Constructive", "Brute Force",
];
