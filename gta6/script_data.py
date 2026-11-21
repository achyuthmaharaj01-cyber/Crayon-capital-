# Script + beat list source of truth. Run: python3 script_data.py -> script.md, beats.md
# Seconds are ESTIMATES at 150 wpm (2.5 words/s) + 0.35 s gap per line.
# Final shot times will be anchored to faster-whisper word times, never these numbers.
WPS = 2.5
GAP = 0.35

# (chapter_title, location / mood, [ (line_id, text, [shot descriptions]) ])
CHAPTERS = [
 ("COLD OPEN", "mixed: red trading floor / clean daylight / spotlight question shots", [
  ("C1", "Grand Theft Auto 6 just made three point seven nine billion dollars in a single day, the biggest launch in the history of entertainment.",
   ["Giant game box on a glowing pedestal, midnight store line wrapping round the block, push in",
    "Billboard price counter ticks $0 -> $3.79B on 'three point seven nine' (cash-register ding)",
    "Gold trophy sign 'BIGGEST LAUNCH EVER' drops in beside the box (small shake)"]),
  ("C2", "And on that same day, the company that owns it watched its stock fall.",
   ["Red trading floor: Take-Two exec (grey suit, glasses, TAKE-TWO badge) looks up at wall ticker",
    "Ticker arrow snaps down, '-3.7%' red glow, exec shock face + sweat drop (shake)"]),
  ("C3", "No bad reviews.", ["Critic with clipboard stamps '99' (stamp shake)"]),
  ("C4", "No last-minute delay.", ["Wall calendar, NOV 19 circled, green tick, clock on the wall"]),
  ("C5", "No missed sales.", ["Empty shop shelves, clerk (cap + badge) holds 'SOLD OUT' sign, grin"]),
  ("C6", "That week, the stock fell about eight percent, and it was down almost twenty from its summer high.",
   ["Cartoon dollar bills with legs walk out of a door labelled TTWO, counter '-8% THIS WEEK'",
    "Grid-paper skyline of stock bars, tallest 'JULY $258' crumbles (crumble sfx, shake)",
    "Rubble settles at '$208', counter '-19%' red glow"]),
  ("C7", "So why would a record-breaking win make investors run?",
   ["BLACK CARD (Caveat, word by word): 'So why would a record-breaking win make investors run?'"]),
  ("C8", "The short answer is, the money had already been counted, months before anyone pressed start.",
   ["Blue-grey spotlight: piggy bank already cracked open, coins stacked and counted, calendar torn to 'JULY'",
    "Controller on a pedestal, START button glowing, untouched, slow push"]),
 ]),
 ("CHAPTER 1: THE TOP", "clean daylight blue street + company HQ", [
  ("1.1", "To get this, you need to know what Grand Theft Auto has been for this company, and the answer is, basically everything.",
   ["Chapter card on black: 'The Top'",
    "Daylight street, TAKE-TWO HQ building (sign, windows, pigeons, trees)",
    "Exec stands on top of a giant game box like a statue on a plinth, hands on hips"]),
  ("1.2", "Grand Theft Auto 5 came out in 2013, and it made eight hundred million dollars on its first day, and a billion in three.",
   ["Desk calendar '2013', counter ticks '$800M' on 'eight hundred million'",
    "Three calendar pages flip, counter rolls to '$1B' (ding), exec grins"]),
  ("1.3", "It has since sold more than two hundred million copies, which is roughly one copy for every person in Brazil.",
   ["Mountain of game boxes, sign '200,000,000+' counter ticks",
    "Huge crowd of tiny people, banner 'POPULATION OF BRAZIL ~ 212M'",
    "Boxes rain down, one lands in each pair of hands"]),
  ("1.4", "Then the company spent more than a decade making the sequel, and fans waited so long that some of them went from high school to having a mortgage.",
   ["Wall clock hands spin, calendar '2013 -> 2023'",
    "Fan as a teen with backpack, grin",
    "Same fan, now in a suit with house keys and a 'MORTGAGE' folder, tired face"]),
  ("1.5", "The first trailer in December 2023 got ninety million views in a single day.",
   ["Giant generic video screen (no logos) on a street, crowd looking up",
    "View counter ticks to '90,000,000' on 'ninety million' (ding)"]),
  ("1.6", "Then the waiting got longer, the game was due in fall 2025, then it slipped to May 2026, then it slipped again to November 19th.",
   ["Calendar 'FALL 2025' ripped off the wall",
    "'MAY 26 2026' page ripped off",
    "'NOV 19 2026' page pinned with a red pin, exec mops sweat"]),
  ("1.7", "And every delay told investors the same thing, the money is still coming, it's just late, so they kept waiting, and kept buying.",
   ["Queue of investors at a ticket booth 'TTWO STOCK', each holds a ticket stub 'LAUNCH DAY'",
    "Queue gets longer, pigeons on the booth roof"]),
  ("1.8", "And by July 2026, Take-Two's stock hit two hundred fifty-eight dollars, its highest close of the year.",
   ["Stock drawn as a skyscraper, scaffolding climbing up",
    "Flag on top 'JULY 2026  $258.41', counter ticks on 'two hundred fifty-eight', exec waving from the roof"]),
 ]),
 ("CHAPTER 2: THE PRICE TAG PROBLEM", "off-white grid paper + warm bakery", [
  ("2.1", "Here's the first thing most people miss, a stock price isn't a score of how a company is doing today, it's a guess about all the money it will make in the future.",
   ["Chapter card: 'The Price Tag Problem'",
    "Grid-paper set: scoreboard labelled 'TODAY' gets a red cross",
    "Fortune-teller crystal ball labelled 'STOCK PRICE', future coins floating inside",
    "Calendar pages 2027, 2028, 2029 drift out of the ball"]),
  ("2.2", "When millions of people already know a game will be huge, they don't wait for launch day to pay for that, they pay for it now.",
   ["Crowd waves money at a cashier window 'PAY FOR THE FUTURE'",
    "Wall clock above window reads 'NOW', cashier stamps receipts"]),
  ("2.3", "Think of it like buying a birthday cake, you pay the bakery on Monday, and on Saturday you don't get to pay again just because the cake looks great.",
   ["Bakery (striped awning, display case, plant): customer pays, receipt 'PAID - MONDAY'",
    "Calendar flips to SATURDAY, gorgeous cake revealed",
    "Customer tries to hand over more money, baker holds up a palm, smug"]),
  ("2.4", "So by launch day, a giant GTA 6 was already inside the price.",
   ["Glass jar labelled 'TTWO PRICE' with the giant game box squeezed inside, lid straining"]),
  ("2.5", "And that creates a strange rule, if you're already expected to be brilliant, brilliant isn't news, it's like a straight-A student bringing home another A, nobody throws a party.",
   ["Kitchen: kid holds report card 'A', parents read newspapers, bored faces",
    "Fridge covered in old 'A' cards, one more gets stuck on"]),
  ("2.6", "To push the stock higher, GTA 6 had to beat everyone's guess, not just be huge.",
   ["Grid chart: bar 'EVERYONE'S GUESS' rises",
    "Dashed taller bar 'NEEDED TO BEAT IT', arrow up, question mark"]),
 ]),
 ("CHAPTER 3: CRACK ONE - BIG NUMBER, SMALLER SLICE", "warm pizza shop / store interior", [
  ("3.1", "And that three point seven nine billion figure isn't what Take-Two gets to keep.",
   ["Chapter card: 'Crack One'",
    "Giant coin pile '$3.79B', exec reaches for it, a velvet rope swings in front of him"]),
  ("3.2", "It's retail sales, the full price players paid, seventy-nine ninety-nine for the standard edition, and up to ninety-nine ninety-nine for the ultimate one.",
   ["Store shelf, label 'RETAIL SALES'",
    "Box with swing tag '$79.99 STANDARD' (ding)",
    "Box with swing tag '$99.99 ULTIMATE' (ding)"]),
  ("3.3", "Take-Two also said thirty-two and a half million copies were sold before the game even came out, and one data firm, Sensor Tower, estimates about two point three six billion dollars of that first day came through digital downloads.",
   ["Pre-order counter at a store desk ticks to '32,500,000 PRE-ORDERS'",
    "Analyst with clipboard (white shirt, tie) beside a download meter",
    "Meter fills to '~$2.36B DIGITAL (ESTIMATE)'"]),
  ("3.4", "Before any of that money reaches Take-Two, the stores take a slice, and Sony and Microsoft take a slice for every copy sold on their consoles, on digital stores that cut is often around thirty percent.",
   ["Pizza labelled '$3.79B' on a counter",
    "Store clerk (cap + badge) takes a slice, grin",
    "Two talking console boxes (labels SONY / MICROSOFT in Kalam, no logos) take slices",
    "Exec left holding a smaller piece, worried"]),
  ("3.5", "And Take-Two's own forecast for the whole holiday quarter was three point three five to three point five billion dollars, and that number was already public.",
   ["Lobby corkboard: calendar 'OCT NOV DEC'",
    "Clipboard 'FORECAST $3.35B - $3.5B' pinned, crowd already reading it"]),
  ("3.6", "So a huge first day mostly told investors something the company had already told them, the plan is on track.",
   ["Exec shrugs with clipboard 'ON TRACK' + tick",
    "Investors yawn, one checks his watch"]),
 ]),
 ("CHAPTER 4: CRACK TWO - EVERYONE ALREADY KNEW", "red trading floor -> deep blue-grey spotlight", [
  ("4.1", "Now the timing, because this is where it gets strange.",
   ["Chapter card: 'Crack Two'",
    "Red trading floor, wall of clocks, calendar strip MON TUE WED THU"]),
  ("4.2", "On Monday and Tuesday of launch week, the stock dropped about ten percent, as nervous investors sold before the big day.",
   ["MON/TUE pages glow",
    "Balloon 'TTWO' leaks air, counter '-10%' red",
    "Nervous traders sweating, papers flying"]),
  ("4.3", "Then on Wednesday the reviews came out, and they were near perfect, a ninety-nine, and the stock jumped six percent.",
   ["WED: critic stamps '99' (shake)",
    "Balloon re-inflates, '+6%' green glow",
    "Traders grin and high-five"]),
  ("4.4", "That was the good news, and it arrived a day before the game did.",
   ["Mail carrier hands envelope 'GOOD NEWS' under WED calendar",
    "Game-box delivery truck still tiny far down the road"]),
  ("4.5", "So by Thursday morning, there was nothing left to be surprised by, it's like a surprise party where the guest of honor helped hang the balloons.",
   ["THU clock 9:00; empty 'SURPRISE!' room",
    "Birthday guy on a ladder hanging the balloons himself",
    "Friends jump out, he gives a flat neutral face"]),
  ("4.6", "And some big funds had been betting on exactly this moment.",
   ["Blue-grey spotlight: hedge-fund trader (black jacket, slick hair) with a stopwatch, smug"]),
  ("4.7", "A trader at the bank Mizuho said many hedge funds had bet against the stock before launch, expecting a sell-the-news day.",
   ["Trader taps in-world clipboard 'HEDGE FUNDS BET AGAINST IT'",
    "Red down-arrow stamped on it (shake)"]),
  ("4.8", "Betting against a stock means you make money when it falls, so for them, the perfect launch was the day to cash in.",
   ["Seesaw: stock price on one end goes down, trader's money bag on the other end goes up",
    "Trader catches the bag, grin"]),
 ]),
 ("CHAPTER 5: THE DAY IT BROKE", "night city -> New York exchange daylight -> red floor (clock in corner every shot)", [
  ("5.1", "Sell the news is an old saying on Wall Street, and the full version is, buy the rumor, sell the news.",
   ["Chapter card: 'The Day It Broke'",
    "Old trader with grey hair and glasses tells it to a junior",
    "BLACK CARD types: 'Buy the rumor. Sell the news.'"]),
  ("5.2", "People buy while something exciting is still coming, and the moment it actually happens, they cash out and leave, like fans leaving the stadium the second the final whistle blows.",
   ["Packed stadium cheering, banner 'COMING SOON'",
    "Ref in stripes blows the whistle",
    "Crowd streams to exits, one fan left holding a foam finger"]),
  ("5.3", "Midnight, the game unlocks, and players around the world start downloading.",
   ["Corner clock 12:00 AM; night street of houses",
    "Windows light up one by one, green download bars over roofs"]),
  ("5.4", "Nine thirty in the morning, the market opens in New York, and the people who bought for the launch start selling.",
   ["Corner clock 9:30 AM; exchange building with columns, bell rings (shake)",
    "Traders pour out holding 'SELL' signs"]),
  ("5.5", "Every seller needs a buyer, and when more people want out than in, the price slides down until someone says yes.",
   ["Long line of sellers facing two buyers",
    "Price tag slides down a ladder rung by rung",
    "A buyer finally catches it, 'YES' speech bubble"]),
  ("5.6", "Noon, the reviews are old news, the record sales are expected news, and there is nothing new to buy on, it's a stock with no fresh reason to go up, and plenty of people ready to leave.",
   ["Corner clock 12:00 PM; newspaper stand, headline 'GTA 6 IS GREAT' with a yawning vendor",
    "Board 'NEW REASONS TO BUY: 0'"]),
  ("5.7", "Add in a weak day for the whole market, and by four o'clock, Take-Two closes at two hundred eight dollars and sixty-five cents, down three point seven percent.",
   ["Corner clock 3:00 PM; whole market skyline dims, rain cloud overhead",
    "Corner clock 4:00 PM; ticker board",
    "Board stamps '$208.65  -3.7%' red glow (stamp shake), exec slumps"]),
  ("5.8", "From its July high, that's roughly fifty dollars a share gone, on the best week this company has ever had.",
   ["Side-by-side buildings '$258 JULY' vs '$208 NOV 19', bracket '-$50'",
    "Confetti still falling on the sales billboard behind"]),
 ]),
 ("CHAPTER 6: IT'S HAPPENED BEFORE", "night green glow tech set -> crypto basement -> grid paper", [
  ("H.1", "If this feels insane, it's not new, markets have done this to giant good news for years.",
   ["Chapter card: 'It's Happened Before'",
    "Museum hall of framed charts, old trader with grey hair and glasses as tour guide, pointing"]),
  ("H.2", "In December 2017, Bitcoin got its first big Wall Street moment, futures trading on the Chicago exchange, the kind of approval fans had begged for.",
   ["Night green glow: talking gold coin with eyes, 'BTC', standing at a red carpet",
    "Calendar 'DEC 2017', banner 'CHICAGO FUTURES - NOW OPEN', camera flashes"]),
  ("H.3", "It peaked near twenty thousand dollars that very week, and a year later it had lost more than eighty percent.",
   ["Coin floats on a balloon to a sign '$20,000' (ding)",
    "Pin pops it, coin plunges, counter '-80%' red glow (crumble, shake)",
    "Coin lands in a dusty basement, shock face"]),
  ("H.4", "In August 2024, Nvidia, the company selling the chips behind AI, beat Wall Street's forecasts, and its stock still fell about six percent the next day.",
   ["Night green tech set: talking computer chip with eyes and a leather jacket-free plain hoodie, holding report card 'BEAT FORECAST'",
    "Grid board 'NEXT DAY: -6%' red, chip sweats"]),
  ("H.5", "Same story every time, when the whole world is already cheering, the good news is used up before it lands.",
   ["Stadium of cheering cartoon investors, a confetti cannon fires early",
    "Real moment arrives, cannon empty, sad 'puff' of one confetti piece"]),
 ]),
 ("CHAPTER 7: WHO ACTUALLY WON", "warm living room glow -> vault -> night green city -> final spotlight", [
  ("6.1", "So who won? Almost everyone, except the people holding the stock that week.",
   ["Chapter card: 'Who Actually Won'",
    "Spotlight podium handing out ribbons",
    "A stockholder stands empty-handed, worried"]),
  ("6.2", "Players got a game critics called close to perfect, after waiting more than twelve years for it.",
   ["Cosy living room (lamp, plant, night window): gamer on couch, controller, TV glow on face, grin"]),
  ("6.3", "Stores and console makers took their slice of every single copy.",
   ["Clerk and the two console boxes eating pizza slices, grins"]),
  ("6.4", "And Take-Two the company, not the stock, just watched players spend more on its game in one day than the biggest movie of all time made in its entire run.",
   ["Exec in a vault, coins pouring in",
    "Counter '$3.79B - ONE DAY'",
    "Film-reel character with sign 'BIGGEST MOVIE EVER ~ $2.9B', shock face"]),
  ("6.5", "The traders who bet on a drop got paid for being right about people, not about the game.",
   ["Hedge-fund trader counts cash, smug",
    "Board behind him 'PEOPLE: PREDICTABLE'"]),
  ("6.6", "And what comes next is something GTA 5 already taught us, that game kept earning for more than a decade, mostly through its online mode.",
   ["Calendar flips 2013 -> 2026",
    "Cash register dings again and again, label 'ONLINE MODE'"]),
  ("6.7", "Take-Two is guiding for eight to eight point two billion dollars in bookings this fiscal year, a record, and most of that rides on this one game.",
   ["Exec holds clipboard '$8B - $8.2B THIS FISCAL YEAR'",
    "Giant game box balanced on one finger, everything else stacked on top"]),
  ("6.8", "Morgan Stanley even warned that every new sales announcement could turn into another sell-the-news day, so the stock may keep wobbling while the company keeps cashing in.",
   ["Grid-paper seesaw, stock bar wobbling up and down",
    "Meanwhile the vault fills steadily, exec smiling"]),
  ("6.9", "Because on Wall Street, the biggest day in entertainment history can still be a losing day, if everyone saw it coming.",
   ["HOOK CALLBACK: giant $3.79B game box looming over the worried exec, red '-3.7%' glow, slow push in",
    "Pull back: whole city skyline, billboard still glowing",
    "BLACK CARD types: 'if everyone saw it coming.' -> fade"]),
 ]),
]

def build():
    t = 0.0
    s_lines, b_lines = [], []
    total_words = 0
    s_lines.append("# Why GTA 6's Record Launch Just Sank Its Own Stock — script\n")
    s_lines.append("Seconds are estimates at 150 wpm + 0.35 s gap. Final timings come from faster-whisper word times.\n")
    b_lines.append("# Beat list (estimated seconds; final shot table anchors to word times)\n")
    shot_no = 0
    for title, mood, lines in CHAPTERS:
        cw = sum(len(x[1].split()) for x in lines)
        s_lines.append(f"\n## {title}  ({cw} words)\n_Set / mood: {mood}_\n")
        s_lines.append("| # | Line | Words | Sec | Starts |\n|---|---|---|---|---|")
        b_lines.append(f"\n## {title} — {mood}\n")
        b_lines.append("| Shot | Start | End | Line | Picture |\n|---|---|---|---|---|")
        for lid, text, shots in lines:
            w = len(text.split()); total_words += w
            dur = w / WPS + GAP
            s_lines.append(f"| {lid} | {text} | {w} | {dur:.1f} | {int(t//60)}:{t%60:04.1f} |")
            sd = dur / len(shots)
            for i, sh in enumerate(shots):
                shot_no += 1
                a, b = t + i*sd, t + (i+1)*sd
                b_lines.append(f"| {shot_no} | {int(a//60)}:{a%60:04.1f} | {int(b//60)}:{b%60:04.1f} | {lid} | {sh} |")
            t += dur
    summary = f"\n**Total: {total_words} words, about {int(t//60)} min {t%60:.0f} s, {shot_no} shots (avg {t/shot_no:.1f} s per shot).**\n"
    s_lines.append(summary); b_lines.append(summary)
    open("script.md","w").write("\n".join(s_lines))
    open("beats.md","w").write("\n".join(b_lines))
    print(summary)
    for title, mood, lines in CHAPTERS:
        print(title, sum(len(x[1].split()) for x in lines), "words",
              round(sum(len(x[1].split())/WPS+GAP for x in lines),1), "s")

if __name__ == "__main__":
    build()
