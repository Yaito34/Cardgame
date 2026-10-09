# Travel Book (source)

Edit the spreads below. Open **TravelBook.html** (pages) or **TravelMap.html** (cluster map) through `npm run serve:travel`, then refresh after you save. Fallback: `npm run build:travel`.

Design: **`docs/travel-book-design.md`**. Transitions: **`discovery-book.md`**.

**Playtest:** every transition is already discovered. **Discover Difficulty** = that exit’s Travel Difficulty.

One **cluster**, one map. **Old Forest** deck on the Mouten woods; **Ruined Castle** deck inside the keep. **Ch.** on each Path is that destination’s printed number (still open to tune). Further from both settlements: more **Challenge Resistance**, better wrecks. **Courtyard** is the keep farm. **Gate House** is the Skeleton Knight boss. Chapel wing is the better cost/reward road; **Cellar · Great Hall** is the short Climb leak from the woods (hidden, hard to find).

Prefer **at most 4** **Paths** on an Area. After you arrive at a new Area you may go **Back to** the previous Area for free until you start a path.

```text
                         (2,0) A12 Mouten Village 0 [Settlement]
                         (2,1) A13 Wooded Mouten 4
            (1,2) A14 Woods I 3              (3,2) A15 Woods II 3
                         (2,3) A8 Ruined Castle Woods 2 [Dangerous Camp]
            (2,4) A1 Gate House 4                              …Climb to A16
(0,5) A6 Intact Tower 4 [Camp]  (1,5) A2 Wall Walk 3  (2,5) A3 Courtyard 3  (3,5) A7 Great Hall 2  (4,5) A16 Cellar · Great Hall 1
                         (1,6) A4 Castle Buildings 2           (3,6) A9 Chapel 1
                         (1,7) A5 Cellar · Buildings 1  (2,7) A10 Chapel Cellar 0 [Settlement]
```

---

+++
id: 0
kind: map
name: Mouten
zone: Mouten
+++

+++
id: 12
kind: area
name: Mouten Village
zone: Old Forest
setting: outdoor
tag: Settlement
page: A12
map_x: 2
map_y: 0
difficulty: 0
+++

The village at the forest edge. Carts, a well, a hall that still has a roof. Runs start and end here.

### Available Actions
- Trade, store Spirit, buy supplies
- Heal Damaged body slots / Repair Damaged Garb (settlement)

### Paths
- Ch.: 9 > D1 Road leads to [A13] Wooded Mouten

+++
id: 13
kind: area
name: Wooded Mouten
zone: Old Forest
setting: outdoor
page: A13
map_x: 2
map_y: 1
difficulty: 4
+++

The first close timber north of the village. Trails split. Harder than the green around the ruin — a forest gate.

### In this Area
- +1 Challenge Resistance on all challenges
- Finds use a richer table

### Paths
- Ch.: 9 > D1 Road leads to [A12] Mouten Village
- Ch.: 8 > D2 Track leads to [A14] Woods I (hidden)
- Ch.: 8 > D3 Track leads to [A15] Woods II (hidden)

+++
id: 14
kind: area
name: Woods I
zone: Old Forest
setting: outdoor
page: A14
map_x: 1
map_y: 2
difficulty: 3
+++

West wood toward the ruin. Trails and cover. (Forest challenges and leftover job still open.)

### Paths
- Ch.: 9 > D2 Track leads to [A13] Wooded Mouten
- Ch.: 7 > D4 Path leads to [A8] Ruined Castle Woods (hidden)

+++
id: 15
kind: area
name: Woods II
zone: Old Forest
setting: outdoor
page: A15
map_x: 3
map_y: 2
difficulty: 3
+++

East wood toward the ruin. Different ground from Woods I. (Forest challenges and leftover job still open.)

### Paths
- Ch.: 9 > D3 Track leads to [A13] Wooded Mouten
- Ch.: 7 > D5 Path leads to [A8] Ruined Castle Woods (hidden)

+++
id: 8
kind: area
name: Ruined Castle Woods
zone: Old Forest
setting: outdoor
tag: Dangerous Camp
page: A8
map_x: 2
map_y: 3
difficulty: 2
+++

The woods against the curtain. The wall looks mostly intact; three corner towers are stubs. The gatehouse still stands tall. The old moat is earth and thicket.

### Available Actions
- Dangerous Camp 1
- [A] 3 Watch the Approach : Scout 1

### Sees
- [A1] Gate House
- [A2] Wall Walk
- [A6] Intact Castle Tower

### Paths
- Ch.: 8 > D4 Path leads to [A14] Woods I
- Ch.: 8 > D5 Path leads to [A15] Woods II
- Ch.: 8 > D6 Breached Gate leads to [A3] Courtyard
- Ch.: 6 > D7 Ground Hole leads to [A16] Cellar · Great Hall (hidden) ([T] Climb 3)

+++
id: 1
kind: area
name: Gate House
zone: Ruined Castle
page: A1
map_x: 2
map_y: 4
difficulty: 4
+++

The whole front block and both drums. This is the Skeleton Knight’s ground — the boss of the keep’s mouth.

### Available Actions
- [A] 3 Watch the Approach : Scout 1

### In this Area
- +1 Count on Skeleton Knight
- +1 Challenge Resistance on Skeleton Knight
- Finds use a richer table

### Paths
- Ch.: 8 > D8 Door leads to [A2] Wall Walk
- Ch.: 8 > D9 Door leads to [A3] Courtyard

### Sees
- [A8] Ruined Castle Woods
- [A3] Courtyard

+++
id: 2
kind: area
name: Wall Walk
zone: Ruined Castle
page: A2
map_x: 1
map_y: 5
difficulty: 3
+++

The circuit on the curtain. Yard on one side, woods on the other. The intact tower and the gatehouse drums still rise.

### Available Actions
- [A] 3 Watch the Wood : Scout 1

### In this Area
- +1 Count on Skeleton Archers
- +1 Count on Falling Stone
- −1 Materials found from Craft outcomes

### Paths
- Ch.: 9 > D8 Door leads to [A1] Gate House
- Ch.: 9 > D10 Stairs lead to [A6] Intact Castle Tower
- Ch.: 7 > D11 Stairs lead to [A4] Castle Buildings (hidden)

### Sees
- [A3] Courtyard
- [A8] Ruined Castle Woods

+++
id: 6
kind: area
name: Intact Castle Tower
zone: Ruined Castle
tag: Camp
page: A6
map_x: 0
map_y: 5
difficulty: 4
+++

The only corner drum that still has its upper floors. Far from both settlements; a hard camp, not a town.

### Available Actions
- Camp: Recover 5 Stamina per Ration spent
- [A] 3 Watch the Wood : Scout 1

### Paths
- Ch.: 8 > D10 Stairs lead to [A2] Wall Walk

### Sees
- [A1] Gate House
- [A8] Ruined Castle Woods

+++
id: 3
kind: area
name: Courtyard
zone: Ruined Castle
page: A3
map_x: 2
map_y: 5
difficulty: 3
+++

The open heart of the keep. Fallen stone from the walk. The hall’s windows look down. The keep’s reliable skeleton farm.

### Available Actions
- [A] 4 Scan the Ranges : Scout 1

### In this Area
- +1 Vision
- +1 Count on Skeletons
- +1 Challenge Resistance on Skeletons
- −1 Difficulty to Decaying
- Skeletons here do not gain ! Danger (open yard — easy to flee)

### Paths
- Ch.: 9 > D9 Door leads to [A1] Gate House
- Ch.: 7 > D6 Breached Gate leads into the [A8] Old Forest
- Ch.: 7 > D12 Door leads to [A4] Castle Buildings
- Ch.: 7 > D13 Door leads to [A7] Great Hall

### Sees
- [A2] Wall Walk
- [A6] Intact Castle Tower

+++
id: 4
kind: area
name: Castle Buildings
zone: Ruined Castle
page: A4
map_x: 1
map_y: 6
difficulty: 2
+++

Kitchens and stores along the yard. Inner doors jammed with fallen floors. The well still sits in a corner.

### Available Actions
- [C] 4 Draw from the Well : Rations 1

### In this Area
- −1 Vision
- +1 Count on Jammed Door
- +1 Materials found from clearing Blocked Path challenges

### Paths
- Ch.: 8 > D11 Stairs lead to [A2] Wall Walk (hidden)
- Ch.: 8 > D12 Yard Door leads to [A3] Courtyard
- Ch.: 6 > D16 Stairs lead to [A5] Cellar · Buildings (hidden)

+++
id: 5
kind: area
name: Cellar · Buildings
zone: Ruined Castle
page: A5
map_x: 1
map_y: 7
difficulty: 1
+++

Vaults under the ranges, close to the cellar settlement. Wet stone; not the drowned peak.

### Available Actions
- [C] 4 Shore the Landing : Materials 1

### In this Area
- −1 Vision
- +1 Count on Decaying

### Paths
- Ch.: 7 > D16 Stairs lead to [A4] Castle Buildings (hidden)
- Ch.: 5 > D17 Passage leads to [A10] Chapel Cellar (hidden)

+++
id: 7
kind: area
name: Great Hall
zone: Ruined Castle
page: A7
map_x: 3
map_y: 5
difficulty: 2
+++

The keep’s long room, still roofed in places. The chapel wing’s better wrecks start here — longer than the Climb leak, better pay.

### Available Actions
- [A] 4 Read the High Table : Scout 1
- [C] 5 Mend the Benches : Materials 1

### In this Area
- +1 Count on Rotting Arch
- Finds use a richer table

### Paths
- Ch.: 8 > D13 Yard Door leads to [A3] Courtyard
- Ch.: 6 > D14 Arch leads to [A9] Chapel (hidden)
- Ch.: 6 > D15 Stairs lead to [A16] Cellar · Great Hall (hidden)

+++
id: 9
kind: area
name: Chapel
zone: Ruined Castle
page: A9
map_x: 3
map_y: 6
difficulty: 1
+++

A small chamber still whole over the hall. The altar stands. Better cost/reward than the Great Hall cellar Climb — not the short way.

### Available Actions
- [A] 4 Offer a Quiet Watch : Recovery 1
- [C] 5 Mend the Altar : Find Discovery T06

### In this Area
- Skeletons here do not gain ! Danger (consecrated)
- Finds use a richer table

### Paths
- Ch.: 7 > D14 Arch leads to [A7] Great Hall (hidden)
- Ch.: 5 > D18 Stairs lead to [A10] Chapel Cellar (hidden)

+++
id: 16
kind: area
name: Cellar · Great Hall
zone: Ruined Castle
page: A16
map_x: 4
map_y: 5
difficulty: 1
+++

Vault under the hall’s dais end. The short way: a Climb through the moat into the woods — hidden, hard to find at first, worse pay than the chapel wing.

### In this Area
- −1 Vision
- +1 Difficulty to Traverse challenges

### Paths
- Ch.: 7 > D15 Stairs lead to [A7] Great Hall (hidden)
- Ch.: 5 > D19 Passage leads to [A10] Chapel Cellar (hidden)
- Ch.: 7 > D7 Ground Hole leads into the [A8] Old Forest (hidden) ([T] Climb 3)

+++
id: 10
kind: area
name: Chapel Cellar
zone: Ruined Castle
tag: Settlement
page: A10
map_x: 2
map_y: 7
difficulty: 0
+++

The chapel’s vault. Skeletons here still have some consciousness and reason. They will heal you and trade. A settlement under the keep — not a drowned farm.

### Available Actions
- Trade, store Spirit, buy supplies
- Heal Damaged body slots / Repair Damaged Garb (settlement)

### Paths
- Ch.: 6 > D18 Stairs lead to [A9] Chapel (hidden)
- Ch.: 6 > D17 Passage leads to [A5] Cellar · Buildings (hidden)
- Ch.: 6 > D19 Passage leads to [A16] Cellar · Great Hall (hidden)
