# Prototype Rules Reference (Short)

Purpose: **rules and keyword effects only** — how play works and what each effect means. **Where numbers and keywords sit on a card** — see **Card layout (examples)** below. Deeper **authoring tradeoffs** and **design patterns** live in **`docs/challenge-design-guide.md`**. Keep this file short and editable.


Needed Update for Groupplay.

- Each player has its own challange Queue in the length of his personal Vision.
- Challenges need to be overcome by the whole group, so when a challene is overcomes it is passed on to a palyer of choice, until all have overcome it.
- When a challenge is overcoem by all characters it is placed on a Path Pile
- When players reach 5 or less stamina or choose to do so the need to go back to there starng landmark by going through a Path Deck
- Clear Effect: Instantly Discard the challenge to a Disacrd Pile (No passing on and not put in the Path Pile). Typical for Clearing, Building a path or removing a beeing.
- Bypass Effect: After the whole group has Choosen the same Bypass option on a specific Challenge it is discarded and not put in the Path Pile.
- A path is completed only when every card in its finite Challenge Deck has been overcome.
- Marker needed to track normal overcome and Baypass seperatly
- First Qeue: for tarrain effects that last
- While revelaed: for permanent transfarable effects like from creatures
- on Reveal: effects that trigger only once, can easely effect thw whole group.
- Global challenge queue for effects that effect everybody and are present everywhere.
- Effects that effect everybody on a challenge that stay in one queue could be a spirit wiving a spell on everybody.


## Equip Tools 
You can Equip 4 Tools from all the Tools you have.
Not Equipped Tools count as part of your Backpack.

## Landmark Atlas
In the Landmark Atlas you find Landmarks that let you navigate the World.
Each Page of the Atlas represents one Landmark. To Travel to a Landmark you simply turn to the Landmark Atlas Page that represents the Landmark.

## Choose a Path

The `Paths` available at Landmark are found  on the Landmark Page.
Path Lead to other Landmarks and let you Travel through the world. 
You can Choose to Explore a Path any time, as Ongoing you know one.

You Start on Landmark Atlas Page 1 [LA1]:

Forest Clearing 

Paths:
- Area Exploration [ZD1]
- Old Forest Trail -> [12C-ZD1] -> LA2

When you choose a path like the Old Forest Trail, do this:
1. Note that path's `Required Challenges`. (12 Challenges for this prototype path)
2. Shuffle that path's Zone Deck [ZD1]. (Zone Deck 1)
3. Deal 12 cards face down as the Challenge Deck.
4. Place the Zonedeck Title Card above the Challenge Deck. (Old Forest)
5. Start Exploring that Challenge Deck.

Each overcome challenge is discarded. No current effect adds, removes, or bypasses Challenge Deck cards.

When doing an `Area Exploration` an area around a Landmark you cannot reach a new Landmark, but you can choose to follow a new Path when you find one.


## Travel
You can Travel to a Landmark any time when:
1. You have chosen the Path that Leads to that Landmark.
2. The Challenge Deck is empty and no challenge remains revealed.


## Exploring 
Steps:
1. Reveal
2. Overcome a Challenges
3. Outcome

## Move
1. **Move X**: Move all revealed Challenges up to X slots closer, one slot at a time. Stop when the closest Challenge reaches the first (Close) slot. Reveal one new Challenge for each movement slot actually taken.
2. **Vision X**: The maximum number of Challenge slots is X. Newly revealed Challenges are placed in draw order so the last drawn Challenge is in slot X.
3. **Reveal +X**: For the next Move only, increase Vision by X and reveal X additional Challenges beyond the normal amount from moving.
4. Resolve/Note `On/While Reveal` Effects.


## Overcome a Challenges
You can only overcome the **first** Challenge in Reveal Order as **Target**, unless an effect says otherwise.

1. Choose Approach found on the challenge (`Fight`, `Work`, `Traverse`, `Awareness`).
2. Use the **Active** Equipped Tool if it has a matching Approach, or a **Universal** tool line. If it has no matching line, use Body / Power 0. You cannot pick a different Equipped Tool for this Close.
3. Gain Exhaustion = `max(0, Challenge Power - Tool/Body Power) + Tool/Body Stamina Cost (min 0)`. A Tool or Body's negative number is its Stamina Value: `[F] 8 -2 Fight` adds 2 Exhaustion when that line is used. Using the tool does not spend Uses or any other tool resource.   

## Card Layout

Tiger (Challange Name)

ON reveal: Move Forward 1 (While/On Reveal Effects)
---
Fight 4 : Rations +3 (Approach Power X: Outcome )
Lasts 1 : Hinderance X: all other revealed challenges have +X Challenge Power. (Speical effect)
---
Lasts 1 : Hinderance X: all other revealed challenges have +X Challenge Power. (Lasting Effect written heads up)


## Outcome
1. Resolve Outcome Effects.
2. Discard this challenge unless **Lasts X** (or **On Overcome: Lasts X**) keeps it—see **Lasts effects**.


## Repack Tools
After overcoming Challenges and before the next Move, pay 1 Stamina to exchange one Equipped Tool with one Backpack Tool. You may Repack only once in this window, and only when Close is empty, no revealed Danger remains, and no pending Exhaustion is left.


## Reaching a Landmarks
When you arrive at a Landmark:
1. Resolve arrival effects, found at the Landmark Page.
2. You may Rest.

## Rest
Steps:
1. Remove Exhaustion by the Recovery found at the Landmark Page.
2. You may spend Rations 1:1 to Recover additional Exhaustion.
3. Gain Experience for all the Exhaustion you have Recovered.

## Stamina
The Normal Stamina is 15. It can be increased or decreased by Effects.
When your Exhaustion = Stamina your character becomes Exhausted (too similar to Exhaustion?).

When you become Exhausted:
1. Abandon Exploration, and return to the last Landmark.
2. You will not gain Experience after you Rest.

## New Rules:
- Bypass: Challenges is after overcoming passed on to a palyer of choice that had not faced it yet. Track your overome on it with a Marker.
Have all palyers choosen an Bypass Option is the card not Disacrd but put on a Retret Pile.

- Retreat: The Retrete Pile need to be fully overcome after wards you rreach the Landmark you startet explroting from. (When retreting there is no new Retret pile is build)



## Standard Effects
Effects that are only explained in the Rules

- `Clear`: Discard the challenge. It counts as overcome for the Challenge Deck.
- `Find FX`: Find a Discovery, with the Key FX on the current Landmark Page.
- `Exhaust X`: Gain X Exhaustion and track it for your character.
- `Recovery X`: Remove X Exhaustion from your character.
- `Rations X`: Gain X rations and track them for your character.
- `Reveal +X`: For the next Move, increase Vision by X and reveal X additional Challenges beyond the normal amount from moving.
- `Scout X`: Look at **X** Cards from the zone Deck, choose for each to reveal it or return it to the bottom of the Zone Deck.





## Discoveries

When choosing an Approach with **Find FX** as Outcome, you look at the Landmark Atlas Page for the current Landmark and see what you Discover.

Example challenge:

Rock Formation
Awareness 4: Find F1

Example Discovery Section on a Landmark Page:

F1 = D3, F2 = D8, ....


With F1 you find Discovery 3 and go to the Discovery Book Page 3

In the Discovery Book you can find, New Paths, new Tools, Knowledge about the World and more.



## Standard Tool Effects
Effects that are only explained in the Rules

- Tools are a **mode**. Using a Tool does not spend Uses or any other tool resource.
- `Range X–Y` : This line can target only challenge positions X to Y in Reveal Order.
- `Alternative` : The activation of the effect can be freely chosen while this tool is Active. 



## Resolving Effects
Effects that are only explained in the Rules
Full Bypass: Triggers whenn all palyers have choosen an Bypass Option.

- `Return`: This challenge is returned to the bottom of zone deck.
- `On Reveal`: Effect activates when challenge is revealed.
- `On Use`: Effect activates when the Active Tool is used on Close. This is a trigger, not a spend.
- `While Revealed`: Effect is active as Ongoing Challenge is revealed.
- `Charging X`: Activates only after **X** Approaches are resolved
- `Range X–Y` : This Effect only activats on or against challenges in positions X…Y in Reveal Order (the leftmost / first revealed challenge is position 1). 
- `[X+]`: Activates when receiving X+ Exhaustion.
- `Lasts X`: When this card would be normally discarded, it remains in play for X
further actions.
When an Lasts effect is activated put the card bottom up on apile left of your equipped tools, so that the Effect on the bottom of the card is readeable. 



## Card Effects 
Effects that are explained on cards (may be gated by **`Charging X`**, **While Revealed**, etc.).

- `Danger X` : Suffer X Exhaustion without reduction. 
- `Power +X`: +X Power for your next Approach.
- `Challenge Power +X`: +X Power to this challenge’s Approaches.
- `Move Close X`: move challenge forward by X in reveal order.
- `Confusion`: shuffle zone deck.
- `Blocking X`: X challenges behind this one cannot be overcome.
- `Covering X`: next challenge in Reveal Order +X Challenge Power.
- `Hinderance X`: all other revealed challenges have +X Challenge Power.
- `Cramped X`: Fight Challenge Power +X.
- `Rough X`: Work Challenge Power +X.
- `Treacherous X`: Traverse Challenge Power +X.
- `Dread X`: Awareness Challenge Power +X.
- `Guidance X`: Traverse Power +X for the next challenge.
- `Prepare X`: +X Power for the next Approach.
- `Limited Pepare X` : +X Power for the next specific Approaches.
- `Grouping X`: +X Challenge Power when another challenge with the same name is revealed.
- `Use-Rations X`: Spend X Rations or suffer X*2 additional Exhaustion.
- `Bypass 1` : Discard the next 1 challange without resolving any effects.
- `Ongoing X` : This Challenge needs to be overcome X times with one tool. 

