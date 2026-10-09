# Discovery Book (source)

Add one **page** per `+++` block. Run `npm run build:discovery` to refresh `discovery-book-data.js`.

**Playtest:** Mouten cluster treats every transition as already copied into `TravelBook.md`. These pages show what a find would have told you. **Discover Difficulty** = Travel Difficulty = **Ch.**

Visible / expected architecture (village road, yard doors, gatehouse onto the walk) is **not** a secret. The **Ground Hole** (woods ↔ Cellar · Great Hall) is hidden: Climb, hard to find at first.

**Return path:** once you have used a connection, going back the way you came is Difficulty **at most 2** (see `docs/travel-book-design.md`). Discover Difficulty still uses the printed Travel Difficulty of that search.

---

+++
id: 1
kind: transition
discovery_number: 1
zone: Old Forest
from_area: Mouten Village
from_page: A12
discover_difficulty: 4
transition_name: Road
to_page: A13
to_area: Wooded Mouten
there_name: Mouten Village
left_note: Village road into Wooded Mouten. Ch. 4 both ways.
+++

+++
id: 2
kind: transition
discovery_number: 2
zone: Old Forest
from_area: Wooded Mouten
from_page: A13
discover_difficulty: 3
transition_name: Track
to_page: A14
to_area: Woods I
there_name: Wooded Mouten
left_note: West track. Ch. 3 into Woods I; Ch. 4 back to Wooded Mouten.
+++

+++
id: 3
kind: transition
discovery_number: 3
zone: Old Forest
from_area: Wooded Mouten
from_page: A13
discover_difficulty: 3
transition_name: Track
to_page: A15
to_area: Woods II
there_name: Wooded Mouten
left_note: East track. Ch. 3 into Woods II; Ch. 4 back to Wooded Mouten.
+++

+++
id: 4
kind: transition
discovery_number: 4
zone: Old Forest
from_area: Woods I
from_page: A14
discover_difficulty: 2
transition_name: Path
to_page: A8
to_area: Ruined Castle Woods
there_name: Woods I
left_note: West path onto the castle woods. Ch. 2 toward the ruin; Ch. 3 back into Woods I.
+++

+++
id: 5
kind: transition
discovery_number: 5
zone: Old Forest
from_area: Woods II
from_page: A15
discover_difficulty: 2
transition_name: Path
to_page: A8
to_area: Ruined Castle Woods
there_name: Woods II
left_note: East path onto the castle woods. Ch. 2 toward the ruin; Ch. 3 back into Woods II.
+++

+++
id: 6
kind: transition
discovery_number: 6
zone: Old Forest
from_area: Ruined Castle Woods
from_page: A8
discover_difficulty: 3
transition_name: Breached Gate
to_page: A3
to_area: Courtyard
there_name: Ruined Castle Woods
left_note: Breach into the yard, not the Gate House. Ch. 3 into the Courtyard; Ch. 2 back into the woods. Zone crossing.
+++

+++
id: 7
kind: transition
discovery_number: 7
zone: Old Forest
from_area: Ruined Castle Woods
from_page: A8
discover_difficulty: 1
transition_name: Ground Hole
to_page: A16
to_area: Cellar · Great Hall
there_name: Ruined Castle Woods
left_note: Hidden Climb through the moat. Short way (Ch. 1 into the cellar, Ch. 2 back to the woods) plus [T] Climb 3. Hard to find at first. Worse wrecks than the chapel wing. Return path max 2 on the Ch. if you just used it; still Climb.
+++

+++
id: 8
kind: transition
discovery_number: 8
zone: Ruined Castle
from_area: Gate House
from_page: A1
discover_difficulty: 3
transition_name: Door
to_page: A2
to_area: Wall Walk
there_name: Gate House
left_note: Door onto the wall-walk. Ch. 3 onto the walk; Ch. 4 back into the Gate House.
+++

+++
id: 9
kind: transition
discovery_number: 9
zone: Ruined Castle
from_area: Gate House
from_page: A1
discover_difficulty: 3
transition_name: Door
to_page: A3
to_area: Courtyard
there_name: Gate House
left_note: Door onto the yard. Ch. 3 into the Courtyard; Ch. 4 back into the Gate House.
+++

+++
id: 10
kind: transition
discovery_number: 10
zone: Ruined Castle
from_area: Wall Walk
from_page: A2
discover_difficulty: 4
transition_name: Stairs
to_page: A6
to_area: Intact Castle Tower
there_name: Wall Walk
left_note: Stairs into the intact tower camp. Ch. 4 into the tower; Ch. 3 back onto the walk.
+++

+++
id: 11
kind: transition
discovery_number: 11
zone: Ruined Castle
from_area: Wall Walk
from_page: A2
discover_difficulty: 2
transition_name: Stairs
to_page: A4
to_area: Castle Buildings
there_name: Wall Walk
left_note: Down into the ranges. Ch. 2 into Castle Buildings; Ch. 3 back onto the walk.
+++

+++
id: 12
kind: transition
discovery_number: 12
zone: Ruined Castle
from_area: Courtyard
from_page: A3
discover_difficulty: 2
transition_name: Door
to_page: A4
to_area: Castle Buildings
there_name: Courtyard
left_note: Yard door into the ranges. Ch. 2 into Castle Buildings; Ch. 3 back onto the yard.
+++

+++
id: 13
kind: transition
discovery_number: 13
zone: Ruined Castle
from_area: Courtyard
from_page: A3
discover_difficulty: 2
transition_name: Door
to_page: A7
to_area: Great Hall
there_name: Courtyard
left_note: Yard door into the hall. Ch. 2 into the Great Hall; Ch. 3 back onto the yard.
+++

+++
id: 14
kind: transition
discovery_number: 14
zone: Ruined Castle
from_area: Great Hall
from_page: A7
discover_difficulty: 1
transition_name: Arch
to_page: A9
to_area: Chapel
there_name: Great Hall
left_note: Arch into the chapel. Better wrecks than the Climb leak. Ch. 1 into the chapel; Ch. 2 back into the hall.
+++

+++
id: 15
kind: transition
discovery_number: 15
zone: Ruined Castle
from_area: Great Hall
from_page: A7
discover_difficulty: 1
transition_name: Stairs
to_page: A16
to_area: Cellar · Great Hall
there_name: Great Hall
left_note: Down under the dais. Ch. 1 into Cellar · Great Hall; Ch. 2 back up.
+++

+++
id: 16
kind: transition
discovery_number: 16
zone: Ruined Castle
from_area: Castle Buildings
from_page: A4
discover_difficulty: 1
transition_name: Stairs
to_page: A5
to_area: Cellar · Buildings
there_name: Castle Buildings
left_note: Down under the ranges. Ch. 1 into Cellar · Buildings; Ch. 2 back up.
+++

+++
id: 17
kind: transition
discovery_number: 17
zone: Ruined Castle
from_area: Cellar · Buildings
from_page: A5
discover_difficulty: 0
transition_name: Passage
to_page: A10
to_area: Chapel Cellar
there_name: Cellar · Buildings
left_note: Into the skeleton settlement. Ch. 0 into Chapel Cellar; Ch. 1 back into Cellar · Buildings.
+++

+++
id: 18
kind: transition
discovery_number: 18
zone: Ruined Castle
from_area: Chapel
from_page: A9
discover_difficulty: 0
transition_name: Stairs
to_page: A10
to_area: Chapel Cellar
there_name: Chapel
left_note: Down into the skeleton settlement. Ch. 0 into Chapel Cellar; Ch. 1 back up.
+++

+++
id: 19
kind: transition
discovery_number: 19
zone: Ruined Castle
from_area: Cellar · Great Hall
from_page: A16
discover_difficulty: 0
transition_name: Passage
to_page: A10
to_area: Chapel Cellar
there_name: Cellar · Great Hall
left_note: Into the skeleton settlement. Ch. 0 into Chapel Cellar; Ch. 1 back into Cellar · Great Hall.
+++
