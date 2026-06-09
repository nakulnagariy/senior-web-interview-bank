# Advanced Questions — Part 3: Data Structures & Algorithms
## Questions 61–100

> These are the most commonly asked DSA questions in frontend senior interviews.
> Focus on: time complexity, clean JS/TS implementation, and edge cases.

---

## 🔷 SECTION G — Arrays & Strings

---

### Q61 — Two Sum (most asked interview question)
**Given an array of numbers and a target, return the indices of two numbers that add up to the target.**

```javascript
twoSum([2, 7, 11, 15], 9);  // [0, 1] (2 + 7 = 9)
twoSum([3, 2, 4], 6);       // [1, 2]
twoSum([3, 3], 6);           // [0, 1]
```

<details>
<summary>✅ Answer — O(n) with HashMap</summary>

```javascript
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return []; // no solution
}
```

**Why HashMap:** Brute force is O(n²) — check every pair. HashMap makes complement lookup O(1), total O(n). Store `value → index` so we can return both indices.

**Edge case:** `[3, 3]` with target 6 — we check complement (3) before adding current index, so we don't use the same element twice.
</details>

---

### Q62 — Maximum subarray (Kadane's Algorithm)
**Find the contiguous subarray with the largest sum.**

```javascript
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // 6 ([4,-1,2,1])
maxSubArray([-1]);                               // -1
maxSubArray([5, 4, -1, 7, 8]);                  // 23
```

<details>
<summary>✅ Answer — O(n)</summary>

```javascript
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend current subarray or start fresh from current element
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

**Kadane's insight:** At each position, decide: "Is it better to extend the previous subarray, or start a new subarray here?" If `currentSum + nums[i] < nums[i]`, the previous subarray is dragging us down — start fresh.
</details>

---

### Q63 — Valid parentheses
**Given a string of brackets, return true if they are all properly opened and closed.**

```javascript
isValid('()[]{}');   // true
isValid('([)]');      // false
isValid('{[]}');      // true
isValid('(');         // false
```

<details>
<summary>✅ Answer — Stack O(n)</summary>

```javascript
function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }

  return stack.length === 0;
}
```

**Why stack:** Opening brackets push. Closing brackets must match the most recently opened (LIFO). If stack is empty on close, or final stack isn't empty, invalid.
</details>

---

### Q64 — Move zeroes
**Move all zeroes to the end while maintaining relative order of non-zero elements. In-place.**

```javascript
// Input:  [0, 1, 0, 3, 12]
// Output: [1, 3, 12, 0, 0]
```

<details>
<summary>✅ Answer — Two pointers O(n)</summary>

```javascript
function moveZeroes(nums) {
  let insertPos = 0;

  // Place all non-zero elements at the front
  for (const num of nums) {
    if (num !== 0) nums[insertPos++] = num;
  }

  // Fill remaining positions with zeroes
  while (insertPos < nums.length) {
    nums[insertPos++] = 0;
  }

  return nums;
}
```

**Two-pointer technique:** `insertPos` tracks where the next non-zero should go. After placing all non-zeros, fill the rest with zeros. Only 2 passes, O(1) extra space.
</details>

---

### Q65 — Product of array except self
**Return an array where each element is the product of all other elements. No division. O(n).**

```javascript
productExceptSelf([1, 2, 3, 4]); // [24, 12, 8, 6]
```

<details>
<summary>✅ Answer — Prefix + Suffix products O(n)</summary>

```javascript
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Build prefix products in result
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  // Multiply suffix products on the fly
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}

// Trace for [1,2,3,4]:
// Prefix pass: result = [1, 1, 2, 6]
// Suffix pass: result = [24, 12, 8, 6]
```
</details>

---

### Q66 — Anagram check
**Determine if two strings are anagrams of each other.**

```javascript
isAnagram('anagram', 'nagaram'); // true
isAnagram('rat', 'car');          // false
```

<details>
<summary>✅ Answer</summary>

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const count = {};
  for (const char of s) count[char] = (count[char] || 0) + 1;
  for (const char of t) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}

// Alternative — sorting (O(n log n) but cleaner):
const isAnagram2 = (s, t) =>
  s.split('').sort().join('') === t.split('').sort().join('');
```
</details>

---

### Q67 — Longest substring without repeating characters
**Find the length of the longest substring without repeating characters.**

```javascript
lengthOfLongestSubstring('abcabcbb'); // 3 ('abc')
lengthOfLongestSubstring('bbbbb');    // 1 ('b')
lengthOfLongestSubstring('pwwkew');   // 3 ('wke')
```

<details>
<summary>✅ Answer — Sliding window O(n)</summary>

```javascript
function lengthOfLongestSubstring(s) {
  const seen = new Map(); // char → last seen index
  let maxLen = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const char = s[end];

    // If char was seen INSIDE our current window, move start
    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }

    seen.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }

  return maxLen;
}
```

**Sliding window:** Maintain a window `[start, end]` with no duplicates. When a duplicate is found, shrink from the left to just past the previous occurrence. Map stores last index to avoid nested loops.
</details>

---

### Q68 — Rotate array
**Rotate an array to the right by k steps in-place.**

```javascript
// Input: [1,2,3,4,5,6,7], k=3
// Output: [5,6,7,1,2,3,4]
```

<details>
<summary>✅ Answer — Three reverses O(n) O(1) space</summary>

```javascript
function rotate(nums, k) {
  k = k % nums.length; // handle k > length
  if (k === 0) return;

  reverse(nums, 0, nums.length - 1); // reverse all
  reverse(nums, 0, k - 1);           // reverse first k
  reverse(nums, k, nums.length - 1); // reverse rest
}

function reverse(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// Trace [1,2,3,4,5,6,7] k=3:
// After reverse all:  [7,6,5,4,3,2,1]
// After reverse 0..2: [5,6,7,4,3,2,1]
// After reverse 3..6: [5,6,7,1,2,3,4] ✓
```
</details>

---

## 🔷 SECTION H — Linked Lists

---

### Q69 — Reverse a linked list
**Reverse a singly linked list iteratively and recursively.**

<details>
<summary>✅ Answer</summary>

```javascript
// Iterative — O(n) time, O(1) space
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next; // save next
    curr.next = prev;        // reverse pointer
    prev = curr;             // advance prev
    curr = next;             // advance curr
  }

  return prev; // new head
}

// Recursive — O(n) time, O(n) space (call stack)
function reverseListRecursive(head) {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

**Iterative trace:** Three pointers. At each step: save next, flip pointer backward, advance both pointers. `prev` becomes the new head.
</details>

---

### Q70 — Detect cycle in linked list (Floyd's algorithm)
**Detect if a linked list has a cycle. O(1) space.**

<details>
<summary>✅ Answer</summary>

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // 1 step
    fast = fast.next.next;  // 2 steps

    if (slow === fast) return true; // met inside cycle
  }

  return false;
}

// Find cycle start (where it begins):
function detectCycle(head) {
  let slow = head, fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Reset slow to head, advance both 1 step at a time
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow; // cycle start
    }
  }
  return null;
}
```

**Floyd's tortoise and hare:** Fast pointer catches slow pointer inside the cycle. Mathematical proof guarantees they meet. To find cycle start: distance from head to start = distance from meeting point to start.
</details>

---

### Q71 — Merge two sorted linked lists
**Merge two sorted linked lists into one sorted list.**

<details>
<summary>✅ Answer</summary>

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = { next: null }; // sentinel node avoids edge cases
  let curr = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  curr.next = l1 || l2; // attach remaining nodes
  return dummy.next;
}
```

**Dummy head pattern:** Avoids special-casing the head node. `curr` always points to the last merged node. At the end, one list may still have nodes — attach the remainder directly (they're already sorted).
</details>

---

## 🔷 SECTION I — Trees

---

### Q72 — Binary tree depth (BFS and DFS)
**Find the maximum depth of a binary tree.**

<details>
<summary>✅ Answer</summary>

```javascript
// DFS recursive — clean
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// BFS iterative — level by level
function maxDepthBFS(root) {
  if (!root) return 0;
  const queue = [root];
  let depth = 0;

  while (queue.length) {
    depth++;
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}
```

**DFS** naturally fits recursion. **BFS** counts levels — each while iteration = one level. `levelSize` captures the count at the start of each level to avoid counting new additions.
</details>

---

### Q73 — Binary tree traversals
**Implement inorder, preorder, and postorder traversals iteratively.**

<details>
<summary>✅ Answer</summary>

```javascript
// Inorder: Left → Root → Right (gives sorted order for BST)
function inorder(root) {
  const result = [], stack = [];
  let curr = root;

  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }

  return result;
}

// Preorder: Root → Left → Right
function preorder(root) {
  if (!root) return [];
  const result = [], stack = [root];

  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right); // right first (LIFO)
    if (node.left)  stack.push(node.left);
  }

  return result;
}
```
</details>

---

### Q74 — Validate BST
**Determine if a binary tree is a valid binary search tree.**

<details>
<summary>✅ Answer</summary>

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;

  if (root.val <= min || root.val >= max) return false;

  return isValidBST(root.left,  min, root.val) &&
         isValidBST(root.right, root.val, max);
}
```

**The key insight:** Each node must be within a valid range, not just greater than its immediate left child. Pass `(min, max)` bounds down — left subtree's max is the parent's value; right subtree's min is the parent's value.

**Common mistake:** Only comparing parent-child, missing that a right subtree node must be greater than ALL ancestors above it.
</details>

---

### Q75 — Level order traversal
**Return the level-order (BFS) traversal of a binary tree as nested arrays.**

```javascript
// Input tree:      Output: [[3], [9, 20], [15, 7]]
//     3
//    / \
//   9  20
//     /  \
//    15   7
```

<details>
<summary>✅ Answer</summary>

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length) {
    const level = [];
    const size = queue.length; // capture size before adding children

    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```
</details>

---

## 🔷 SECTION J — Dynamic Programming

---

### Q76 — Fibonacci with memoization
**Implement Fibonacci with O(n) time and O(1) space.**

<details>
<summary>✅ Answer</summary>

```javascript
// Naive recursion: O(2^n) — terrible
// Memoized: O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo));
}

// Bottom-up DP: O(n) time, O(n) space
function fibDP(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// Optimal: O(n) time, O(1) space
function fib(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
```
</details>

---

### Q77 — Climbing stairs
**You can climb 1 or 2 steps at a time. How many distinct ways to reach step n?**

```javascript
climbStairs(2); // 2 (1+1 or 2)
climbStairs(3); // 3 (1+1+1, 1+2, 2+1)
```

<details>
<summary>✅ Answer — Same as Fibonacci</summary>

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
```

`ways(n) = ways(n-1) + ways(n-2)` — from step n-1 you take 1 step, from n-2 you take 2. Identical recurrence to Fibonacci.
</details>

---

### Q78 — Coin change
**Given coins of certain denominations, find the minimum number of coins to make amount. Return -1 if impossible.**

```javascript
coinChange([1, 5, 11], 15); // 3 (11+3×1 = 4, but 5+5+5 = 3)
coinChange([2], 3);          // -1
```

<details>
<summary>✅ Answer — Bottom-up DP O(amount × coins)</summary>

```javascript
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 coins to make amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

`dp[i]` = minimum coins to make amount `i`. For each amount, try each coin. If using coin leaves a valid sub-problem (`dp[i - coin]`), update dp[i].
</details>

---

### Q79 — Longest common subsequence
**Find the length of the longest common subsequence of two strings.**

```javascript
lcs('abcde', 'ace'); // 3 ('ace')
lcs('abc', 'abc');    // 3
lcs('abc', 'def');    // 0
```

<details>
<summary>✅ Answer — 2D DP O(m×n)</summary>

```javascript
function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;     // chars match: extend
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); // take best
      }
    }
  }

  return dp[m][n];
}
```
</details>

---

## 🔷 SECTION K — Graphs & Search

---

### Q80 — BFS shortest path
**Find the shortest path (in steps) between two nodes in an unweighted graph.**

<details>
<summary>✅ Answer</summary>

```javascript
function bfsShortestPath(graph, start, end) {
  if (start === end) return 0;

  const visited = new Set([start]);
  const queue = [[start, 0]]; // [node, distance]

  while (queue.length) {
    const [node, dist] = queue.shift();

    for (const neighbor of graph[node] || []) {
      if (neighbor === end) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1; // no path
}

// Example
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C', 'E'],
  E: ['D'],
};
bfsShortestPath(graph, 'A', 'E'); // 3 (A→B→D→E or A→C→D→E)
```
</details>

---

### Q81 — Number of islands (DFS on grid)
**Count the number of islands in a 2D grid ('1' = land, '0' = water).**

<details>
<summary>✅ Answer</summary>

```javascript
function numIslands(grid) {
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= grid.length ||
        c < 0 || c >= grid[0].length ||
        grid[r][c] !== '1') return;

    grid[r][c] = '0'; // mark visited (sink the land)
    dfs(r+1, c); dfs(r-1, c);
    dfs(r, c+1); dfs(r, c-1);
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c); // flood fill connected land
      }
    }
  }

  return count;
}
```

**Flood fill:** When we find land, increment count and DFS to mark all connected land cells as visited ('0'). Time: O(m×n), Space: O(m×n) for call stack.
</details>

---

### Q82 — Course schedule (topological sort / cycle detection)
**Given course prerequisites, determine if you can finish all courses.**

<details>
<summary>✅ Answer</summary>

```javascript
function canFinish(numCourses, prerequisites) {
  // Build adjacency list
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
  }

  // 0=unvisited, 1=in-progress, 2=done
  const state = new Array(numCourses).fill(0);

  function hasCycle(node) {
    if (state[node] === 1) return true;  // back edge = cycle
    if (state[node] === 2) return false; // already processed

    state[node] = 1; // mark in-progress
    for (const neighbor of graph[node]) {
      if (hasCycle(neighbor)) return true;
    }
    state[node] = 2; // mark done
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }

  return true;
}
```
</details>

---

## 🔷 SECTION L — Sorting & Searching

---

### Q83 — Implement quicksort
**Implement quicksort. Explain average vs worst case.**

<details>
<summary>✅ Answer</summary>

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;

  const pivotIdx = partition(arr, low, high);
  quickSort(arr, low, pivotIdx - 1);
  quickSort(arr, pivotIdx + 1, high);
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high]; // last element as pivot
  let i = low - 1;         // index of smaller element

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}
```

**Complexity:**
- Average: O(n log n) — pivot splits array roughly in half
- Worst: O(n²) — sorted array with last element as pivot
- Space: O(log n) average (call stack)
- Mitigation: random pivot selection eliminates worst-case for sorted input
</details>

---

### Q84 — Merge sort
**Implement merge sort. Why is it preferred over quicksort for linked lists?**

<details>
<summary>✅ Answer</summary>

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else                      result.push(right[j++]);
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**Merge sort for linked lists:** Quicksort needs random access (index into middle) — O(n) for linked lists. Merge sort's split at midpoint only needs slow/fast pointer. Merge of two sorted lists is O(n). Merge sort is always O(n log n) — no worst-case degradation.
</details>

---

### Q85 — Binary search
**Implement binary search. Then implement "find first occurrence of target".**

<details>
<summary>✅ Answer</summary>

```javascript
// Standard binary search
function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if      (nums[mid] === target) return mid;
    else if (nums[mid] < target)   left  = mid + 1;
    else                           right = mid - 1;
  }

  return -1;
}

// First occurrence — don't stop at first match
function firstOccurrence(nums, target) {
  let left = 0, right = nums.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      result = mid;   // found it, but keep searching left
      right = mid - 1;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
```
</details>

---

## 🔷 SECTION M — Hash Maps & Sets

---

### Q86 — Subarray sum equals K
**Find the total number of subarrays that sum to K.**

```javascript
subarraySum([1, 1, 1], 2); // 2
subarraySum([1, 2, 3], 3); // 2
```

<details>
<summary>✅ Answer — Prefix sum + HashMap O(n)</summary>

```javascript
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]); // prefix sum → count
  let count = 0, sum = 0;

  for (const num of nums) {
    sum += num;
    // If (sum - k) exists, there are subarrays ending here summing to k
    count += (map.get(sum - k) || 0);
    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}
```

**Key insight:** `sum[i..j] = prefixSum[j] - prefixSum[i-1]`. If `prefixSum[j] - k` has been seen before, those prefix sums form valid subarrays. Initialise `{0:1}` to handle subarrays starting from index 0.
</details>

---

### Q87 — Top K frequent elements
**Return the k most frequent elements.**

```javascript
topKFrequent([1,1,1,2,2,3], 2); // [1, 2]
topKFrequent([1], 1);            // [1]
```

<details>
<summary>✅ Answer — Bucket sort O(n)</summary>

```javascript
function topKFrequent(nums, k) {
  // Count frequencies
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // Bucket by frequency (index = frequency)
  const buckets = new Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  // Collect from highest frequency down
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}
```

**Why bucket sort:** Frequency can be at most `nums.length`. Using frequency as the bucket index allows us to collect top-k in O(n) instead of O(n log n) sorting.
</details>

---

### Q88 — LRU Cache
**Implement an LRU (Least Recently Used) cache with O(1) get and put.**

<details>
<summary>✅ Answer — HashMap + Doubly Linked List</summary>

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key → node

    // Dummy head and tail
    this.head = { key: 0, val: 0, prev: null, next: null };
    this.tail = { key: 0, val: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this.remove(node);
    this.insertFront(node); // most recently used
    return node.val;
  }

  put(key, val) {
    if (this.map.has(key)) this.remove(this.map.get(key));

    const node = { key, val, prev: null, next: null };
    this.map.set(key, node);
    this.insertFront(node);

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev; // least recently used
      this.remove(lru);
      this.map.delete(lru.key);
    }
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
}
```

**Why HashMap + DLL:** HashMap gives O(1) lookup. DLL gives O(1) insert/remove anywhere. Together: O(1) for both get and put. Most recently used is near head; least recently used is near tail.
</details>

---

### Q89 — First non-repeating character
**Find the first non-repeating character in a string. Return its index or -1.**

```javascript
firstUniqChar('leetcode'); // 0 ('l')
firstUniqChar('loveleetcode'); // 2 ('v')
firstUniqChar('aabb'); // -1
```

<details>
<summary>✅ Answer</summary>

```javascript
function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}
```

Two passes: first builds frequency map, second finds first with count 1. O(n) time, O(1) space (at most 26 lowercase letters).
</details>

---

## 🔷 SECTION N — Recursion & Backtracking

---

### Q90 — Generate all permutations
**Generate all permutations of an array of distinct numbers.**

```javascript
permute([1, 2, 3]);
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

<details>
<summary>✅ Answer — Backtracking</summary>

```javascript
function permute(nums) {
  const result = [];

  function backtrack(current, remaining) {
    if (!remaining.length) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(
        current,
        [...remaining.slice(0, i), ...remaining.slice(i + 1)]
      );
      current.pop();
    }
  }

  backtrack([], nums);
  return result;
}
```

**Backtracking pattern:** Choose → Explore → Unchoose. At each step, pick an unused element, recurse with it removed from remaining, then remove it (backtrack). There are n! permutations.
</details>

---

### Q91 — Subsets (power set)
**Generate all possible subsets of a set of distinct integers.**

```javascript
subsets([1, 2, 3]);
// [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

<details>
<summary>✅ Answer</summary>

```javascript
function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    result.push([...current]); // add current subset (including empty)

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current); // only use elements after i
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

// Iterative bit manipulation approach:
function subsetsIterative(nums) {
  const result = [[]];
  for (const num of nums) {
    // For each existing subset, add current num to create a new subset
    const newSubsets = result.map(s => [...s, num]);
    result.push(...newSubsets);
  }
  return result;
}
```
</details>

---

### Q92 — Word search in grid
**Given a board of characters and a word, determine if the word exists in the grid.**

<details>
<summary>✅ Answer — DFS + Backtracking</summary>

```javascript
function exist(board, word) {
  const rows = board.length, cols = board[0].length;

  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] !== word[idx]) return false;

    const temp = board[r][c];
    board[r][c] = '#'; // mark visited

    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) ||
                  dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1);

    board[r][c] = temp; // restore (backtrack)
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
}
```
</details>

---

## 🔷 SECTION O — Frontend-Specific DSA

---

### Q93 — Flatten a deeply nested object
**Flatten `{ a: { b: { c: 1 } }, d: 2 }` → `{ 'a.b.c': 1, 'd': 2 }`**

<details>
<summary>✅ Answer</summary>

```javascript
function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey));
    } else {
      acc[fullKey] = val;
    }

    return acc;
  }, {});
}

// Test
flattenObject({ a: { b: { c: 1 } }, d: 2, e: [1, 2] });
// { 'a.b.c': 1, 'd': 2, 'e': [1, 2] }
```
</details>

---

### Q94 — Deep diff two objects
**Implement a function that returns the differences between two objects.**

<details>
<summary>✅ Answer</summary>

```javascript
function deepDiff(obj1, obj2, path = '') {
  const diffs = [];

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    const fullPath = path ? `${path}.${key}` : key;
    const v1 = obj1[key], v2 = obj2[key];

    if (!(key in obj1)) {
      diffs.push({ path: fullPath, type: 'added', value: v2 });
    } else if (!(key in obj2)) {
      diffs.push({ path: fullPath, type: 'removed', value: v1 });
    } else if (
      typeof v1 === 'object' && v1 !== null &&
      typeof v2 === 'object' && v2 !== null
    ) {
      diffs.push(...deepDiff(v1, v2, fullPath));
    } else if (v1 !== v2) {
      diffs.push({ path: fullPath, type: 'changed', from: v1, to: v2 });
    }
  }

  return diffs;
}
```
</details>

---

### Q95 — Implement `Object.assign` deep merge
**Implement `deepMerge(target, ...sources)` — like Object.assign but recursive.**

<details>
<summary>✅ Answer</summary>

```javascript
function deepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const srcVal = source[key];
      const tgtVal = target[key];

      if (
        srcVal !== null &&
        typeof srcVal === 'object' &&
        !Array.isArray(srcVal) &&
        tgtVal !== null &&
        typeof tgtVal === 'object' &&
        !Array.isArray(tgtVal)
      ) {
        // Both are plain objects — merge recursively
        deepMerge(tgtVal, srcVal);
      } else {
        target[key] = srcVal;
      }
    }
  }
  return target;
}

const a = { x: { y: 1, z: 2 }, arr: [1, 2] };
const b = { x: { y: 10, w: 3 }, arr: [3, 4] };
deepMerge(a, b);
// { x: { y: 10, z: 2, w: 3 }, arr: [3, 4] }
```
</details>

---

### Q96 — Implement `Promise.allSettled` from scratch
**Implement `myAllSettled(promises)` — never rejects, returns all results.**

<details>
<summary>✅ Answer</summary>

```javascript
function myAllSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p)
        .then(value  => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected',  reason }))
    )
  );
}

// Usage
myAllSettled([
  fetch('/api/users'),
  fetch('/api/missing'),
  Promise.resolve(42),
]).then(results => {
  results.forEach(r => {
    if (r.status === 'fulfilled') console.log('success', r.value);
    else                          console.log('failed',  r.reason);
  });
});
```

Each promise is wrapped to **always resolve** — either with `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`. `Promise.all` on these wrapped promises never rejects.
</details>

---

### Q97 — Implement a simple observable / reactive system
**Build a simple observable that notifies subscribers when a value changes.**

<details>
<summary>✅ Answer</summary>

```javascript
function createObservable(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get() { return value; },

    set(newValue) {
      if (newValue !== value) {
        value = newValue;
        subscribers.forEach(fn => fn(value));
      }
    },

    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn); // returns unsubscribe fn
    }
  };
}

// Usage
const count = createObservable(0);
const unsub = count.subscribe(v => console.log('count changed:', v));

count.set(1);  // logs: count changed: 1
count.set(2);  // logs: count changed: 2
unsub();
count.set(3);  // nothing logged
```

This is the foundation of Vue's reactivity, MobX observables, and Svelte stores.
</details>

---

### Q98 — Virtual DOM diff algorithm (simplified)
**Implement a simplified version of React's diffing — compare two virtual DOM trees and produce a list of patches.**

<details>
<summary>✅ Answer</summary>

```javascript
// Virtual DOM nodes: { type, props, children }

function diff(oldNode, newNode, patches = [], index = 0) {
  if (!oldNode) {
    patches.push({ type: 'CREATE', newNode, index });
  } else if (!newNode) {
    patches.push({ type: 'REMOVE', index });
  } else if (oldNode.type !== newNode.type) {
    patches.push({ type: 'REPLACE', newNode, index });
  } else {
    // Same type — check props
    const propChanges = diffProps(oldNode.props, newNode.props);
    if (propChanges.length) {
      patches.push({ type: 'UPDATE_PROPS', changes: propChanges, index });
    }

    // Recurse on children
    const maxLen = Math.max(
      (oldNode.children || []).length,
      (newNode.children || []).length
    );
    for (let i = 0; i < maxLen; i++) {
      diff(
        (oldNode.children || [])[i],
        (newNode.children || [])[i],
        patches,
        `${index}.${i}`
      );
    }
  }
  return patches;
}

function diffProps(oldProps = {}, newProps = {}) {
  const changes = [];
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
  for (const key of allKeys) {
    if (oldProps[key] !== newProps[key]) {
      changes.push({ key, from: oldProps[key], to: newProps[key] });
    }
  }
  return changes;
}
```
</details>

---

### Q99 — Implement `Array.prototype.flat` from scratch
**Implement `myFlat(arr, depth)` without using `.flat()`.**

<details>
<summary>✅ Answer</summary>

```javascript
Array.prototype.myFlat = function(depth = 1) {
  const result = [];

  function flatten(arr, currentDepth) {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  flatten(this, depth);
  return result;
};

// Tests
[1, [2, [3, [4]]]].myFlat();          // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].myFlat(2);         // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].myFlat(Infinity);  // [1, 2, 3, 4]
```
</details>

---

### Q100 — Design a rate limiter
**Implement a rate limiter that allows at most N requests per window (ms). Used in API call throttling.**

<details>
<summary>✅ Answer</summary>

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // clientId → [timestamp, ...]
  }

  isAllowed(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get and filter to only requests within the window
    const timestamps = (this.requests.get(clientId) || [])
      .filter(t => t > windowStart);

    if (timestamps.length >= this.maxRequests) {
      this.requests.set(clientId, timestamps);
      return false;
    }

    timestamps.push(now);
    this.requests.set(clientId, timestamps);
    return true;
  }
}

// Usage
const limiter = new RateLimiter(3, 1000); // 3 requests per second

console.log(limiter.isAllowed('user1')); // true
console.log(limiter.isAllowed('user1')); // true
console.log(limiter.isAllowed('user1')); // true
console.log(limiter.isAllowed('user1')); // false — exceeded
```

**Algorithm:** Sliding window counter. Keep timestamps of recent requests per client. On each request, remove timestamps outside the window, check if count < max, add current timestamp.

**Production alternatives:** Token bucket (allows burst up to bucket size), fixed window (simpler but allows double-rate at window edges).
</details>

---

## 📊 Complexity Quick Reference

| Algorithm | Time | Space | Key Pattern |
|---|---|---|---|
| Two Sum | O(n) | O(n) | HashMap |
| Max Subarray | O(n) | O(1) | Kadane's |
| Valid Parens | O(n) | O(n) | Stack |
| Sliding Window | O(n) | O(k) | Two pointers |
| Binary Search | O(log n) | O(1) | Divide & conquer |
| BFS | O(V+E) | O(V) | Queue |
| DFS | O(V+E) | O(V) | Stack/recursion |
| Quick Sort | O(n log n) avg | O(log n) | Partition |
| Merge Sort | O(n log n) | O(n) | Divide & merge |
| DP (1D) | O(n) | O(n) or O(1) | Recurrence |
| DP (2D) | O(m×n) | O(m×n) | Table |

---

*All 100 questions complete. Study in order: Part 1 (JS) → Part 2 (TS/React) → Part 3 (DSA)*
