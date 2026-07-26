var EXPLORE_PAIRS = {
'INTP-INTJ':{
    overview:'You deconstruct the universe into precise, internal logical frameworks (Ti-Ne). You look at the INTJ and see a fellow architect of abstract systems—someone who shares your deep distrust of social consensus, but who completely bypasses the joy of open-ended variables to brutally force a singular, closed conclusion (Ni-Te).',
    strengths:'They are the ultimate structural anchor. They provide the decisive commitment and real-world execution that actually gives your endless theoretical frameworks somewhere to land. In return, your expansive exploration (Ne) rigorously challenges their rigid models and prevents them from calcifying prematurely.',
    shadow:'You will find their absolute need to lock down a decision and forcefully close doors to be intellectually suspicious and deeply premature. To their Te, your endless need to keep analyzing variables without ever committing looks like pure, avoidant paralysis.',
    dynamic:'The detached analyst and the strategic mastermind. It is a pairing of profound, mutual intellectual respect, but it constantly wrestles with a core structural friction: you want to keep the variables open, and they want to close the case.',
    working:'You must respect the sequence of operations. You own the rigorous challenge phase early on, but once they drop the hammer and make the final decision (Te), you must accept that the analysis is over and execution has begun.',
    friction:'They will make a hard, binding decision to move a project forward. You will casually attempt to reopen the framework to introduce a new, fascinating variable. They will view your openness as infuriating avoidance, and you will view their closure as intellectually lazy.'
  },
  'INTJ-INTP':{
    overview:'You synthesize complex variables to project and execute optimal, long-term future outcomes (Ni-Te). You look at the INTP and see a fellow abstract thinker—someone who shares your exact distrust of social consensus, but who constantly shatters your singular vision into a million branching, open-ended logical frameworks (Ti-Ne).',
    strengths:'They are your ultimate intellectual stress-test. Before you invest massive resources into a flawed strategy, they rigorously dismantle your model and find the hidden vulnerabilities you completely missed. It is a genuinely brilliant, highly robust intellectual partnership.',
    shadow:'You will find their absolute refusal to fully commit to a direction and their tendency to analyze a problem indefinitely to be highly inefficient and deeply frustrating. You both have entirely different relationships with certainty: you crave it, they avoid it.',
    dynamic:'The strategic mastermind and the detached analyst. There is immense mutual respect for each other\'s depth, but massive friction regarding output. You want a final decision; they want more variables.',
    working:'You must let them rigorously challenge your model *before* you commit to an execution plan. The friction they provide is highly useful. However, you must be the one to finally draw the line, set the deadline, and decide what survives.',
    friction:'You will demand a final answer to begin execution. They will refuse to provide one, insisting the logical framework needs more stress-testing. You will view their open-endedness as weak indecision, and they will view your demand for certainty as premature closure.'
  }
};

// ── ABOUT THIS DATASET ──────────────────────────────────────────────────
// Your original app.js has a full EXPLORE_PAIRS entry for every ordered
// pair among the 16 types (240 entries total, keyed like 'INTP-ESFJ').
// Re-keying all 240 by hand here risked introducing a silent typo
// somewhere in that much hand-copied text, so this file ships with two
// pairs wired up end-to-end to prove the merge works, plus a graceful
// fallback in loadExploreDetail() (app.js) for any pair not yet present.
//
// To restore the rest: open your original app.js, copy everything
// between "var EXPLORE_PAIRS = {" and its matching closing "};", and
// paste it in place of the object above. Nothing else needs to change -
// key format and object shape are identical to what you already had.
// ─────────────────────────────────────────────────────────────────────

var TYPES = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

var TYPE_DESC = {
  INFJ: 'Pattern-seeker with quiet depth. Sees beneath surfaces, carries others without being asked, and builds meaning out of everything.',
  INTJ: 'Strategic and self-directed. Builds toward long-range visions most people cannot see yet, and executes with unusual discipline.',
  INFP: 'Value-driven and quietly intense. Holds convictions deeply and feels everything - which is both the gift and the weight.',
  ENFJ: 'Natural connector and visible leader. Reads rooms and people instinctively, and carries their wellbeing as a personal responsibility.',
  INTP: 'Framework builder. More interested in whether something holds together internally than whether anyone agrees with it.',
  ENTP: 'Idea generator and challenger. Argues to think, not to win - though it often looks the same from the outside.',
  ENTJ: 'Executor and strategist. Builds systems around outcomes and moves fast toward them, often before others have formed a plan.',
  ENFP: 'Possibility-driven and genuinely warm. Finds meaning in people and ideas at speed - finishing things is the harder part.',
  ISTJ: 'Systematic and reliable. Builds carefully on what is proven and holds things together when others lose the thread.',
  ISFJ: 'Quietly devoted. Shows up for people in practical, specific ways that often go unnoticed and unasked-for.',
  ESTJ: 'Organized and direct. Brings structure to chaos and holds people accountable without treating it as personal.',
  ESFJ: 'Warm and socially attuned. Feels responsible for the people around them and acts on it constantly.',
  ISTP: 'Efficient and observant. Solves what is in front of them with precision and minimal noise.',
  ISFP: 'Understated and deeply feeling. Expresses through action and presence more than words.',
  ESTP: 'Fast and action-oriented. Reads situations quickly and moves before others have finished their analysis.',
  ESFP: 'Present and energetic. Brings life into rooms and makes people feel genuinely seen.'
};

var BLIND_SPOTS = {
  INFJ: 'Your Ni builds such a complete internal model that you sometimes stop taking in contradicting data. You are certain not because you have checked, but because the model feels whole.',
  INTJ: 'You execute brilliantly but occasionally in the wrong direction. Ni locks the target, Te builds the route, and neither function is designed to question whether the destination was right.',
  INFP: 'You mistake intensity of feeling for correctness of judgment. A value held deeply is not the same as a value that is right in context.',
  ENFJ: 'You carry emotional responsibility for people who did not ask you to. The help is real but the motive is sometimes about your own discomfort with their situation.',
  INTP: 'Your models are internally consistent but occasionally disconnected from how things actually work. Elegance of framework does not equal accuracy.',
  ENTP: 'You can argue any side with equal conviction. This makes it genuinely difficult to know what you actually believe versus what you are currently performing.',
  ENTJ: 'You treat human problems like logistics problems. People are not inefficiencies to be optimized.',
  ENFP: 'Idea generation is your native language but it doubles as avoidance. The moment a thing gets hard, a new idea appears that is easier.',
  ISTJ: 'You trust precedent over evidence. A past method that worked gets grandfathered in long after the context has changed.',
  ISFJ: 'You say yes to avoid the discomfort of someone else disappointing, not because you have capacity. The resentment accumulates quietly.',
  ESTJ: 'You confuse authority with correctness. The rule exists, therefore it applies - even when it does not.',
  ESFJ: 'You read harmony in the room as truth. If people seem okay, you assume things are okay, even when they are not.',
  ISTP: 'You solve the technical problem and consider the conversation done. The relational layer often remains entirely unaddressed.',
  ISFP: 'You withdraw from conflict so cleanly that people do not realize there is a problem until you are already gone.',
  ESTP: 'You optimize for the present read and underweight what happens downstream. The bold move works until it does not.',
  ESFP: 'The performance of engagement replaces the thing itself. Saying something feels like doing it.'
};

var STACKS = {
  INFJ: {fns:['Ni','Fe','Ti','Se'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your dominant Ni synthesizes experience into meaning before it surfaces. Your Fe then routes that meaning outward.', data:{
    Ni:{name:'Introverted Intuition', what:'Works beneath consciousness, connecting patterns across time and surfacing conclusions that feel more like knowings than deductions.', gives:'Deep foresight, a strong inner compass, and the ability to see what others miss.', aware:'Can trap you in your own head. Builds elaborate internal models that feel true but may not map to reality.', watch:'Notice when you are mistaking pattern recognition for certainty.'},
    Fe:{name:'Extroverted Feeling', what:'Reads the emotional atmosphere of rooms and relationships and responds to it.', gives:'Genuine empathy, and attunement to relational dynamics most people do not have.', aware:'Can override your own emotional needs.', watch:'Check whether you are helping from genuine care or from discomfort with tension.'},
    Ti:{name:'Introverted Thinking', what:'Categorizes, analyzes, and checks for internal consistency. Present but unreliable under stress.', gives:'The ability to think through complex systems independently.', aware:'Underdeveloped Ti can produce Ni-level confidence on Ti-level reasoning.', watch:'When you are tearing apart your own thinking, ask whether that voice is rigorous or just mean.'},
    Se:{name:'Extroverted Sensing', what:'Engages the physical, present-moment world. Least conscious, most disruptive under stress.', gives:'The ability to be fully present and take decisive action.', aware:'Under stress shows up as compulsive sensory behavior or uncharacteristic impulsive decisions.', watch:'Compulsive behavior under pressure is a stress signal.'}
  }},
  INTJ: {fns:['Ni','Te','Fi','Se'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Ni-Te loop drives you from insight directly to strategy, sometimes skipping the Fi layer entirely.', data:{
    Ni:{name:'Introverted Intuition', what:'Synthesizes into long-range patterns that arrive as near-certain knowings rather than step-by-step conclusions.', gives:'Exceptional foresight and confidence to commit before others see the case.', aware:'Can produce overconfidence in predictions.', watch:'When did you last genuinely change your mind about something significant?'},
    Te:{name:'Extroverted Thinking', what:'Organizes the external world through systems, efficiency, and measurable results.', gives:'Decisive action, and the ability to structure complex plans.', aware:'Strips the relational texture out of situations.', watch:'Notice whether you are applying Te to a situation that needs a different approach.'},
    Fi:{name:'Introverted Feeling', what:'Quiet but firm inner value system that operates below the surface.', gives:'Authenticity, a personal ethical framework that does not require external validation.', aware:'Emotional needs build up pressure without being named until they overflow.', watch:'Sudden frustration with no clear cause often means a value was crossed.'},
    Se:{name:'Extroverted Sensing', what:'Inferior function - present-moment engagement and physical action.', gives:'Capacity for decisive action and aesthetic awareness.', aware:'Surfaces under stress as compulsive behavior or sudden impulsive decisions.', watch:'Compulsive behavior under pressure signals something upstream needs attention.'}
  }},
  INFP: {fns:['Fi','Ne','Si','Te'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your dominant Fi filters everything through your core value system.', data:{
    Fi:{name:'Introverted Feeling', what:'Continuously evaluates everything against a deep, personal internal framework.', gives:'Authenticity at a level most people never reach.', aware:'Can create emotional isolation.', watch:'Ask whether you are making a values-based decision or a feeling-based one.'},
    Ne:{name:'Extroverted Intuition', what:'Generates connections, possibilities, and interpretations at high speed.', gives:'Creativity, and genuine openness to ideas.', aware:'Without grounding, produces ideation without execution.', watch:'Notice when idea generation has become a way to avoid committing.'},
    Si:{name:'Introverted Sensing', what:'Stores and compares present experience against a detailed internal archive.', gives:'A rich inner world and a long memory for meaningful experiences.', aware:'Can anchor you in past experience in ways that resist change.', watch:'Ask whether resistance to something new is about the thing or about the familiar.'},
    Te:{name:'Extroverted Thinking', what:'Inferior function - structure, external systems, deadlines, measurable output.', gives:'The ability to execute and organize at high levels.', aware:'Under stress shows up as sudden harsh criticism.', watch:'A sudden critical blaming voice is often inferior Te in stress.'}
  }},
  ENFJ: {fns:['Fe','Ni','Se','Ti'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Fe absorbs the emotional landscape first. Notice whether your Ni has had space to form its own read.', data:{
    Fe:{name:'Extroverted Feeling', what:'Primary mode is through the emotional atmosphere - reading it, managing it, responding to it.', gives:'Natural leadership in human-centered contexts, warmth others feel immediately.', aware:'Can cause you to lose yourself in others.', watch:'Check whether the help you are offering was actually asked for.'},
    Ni:{name:'Introverted Intuition', what:'Gives ENFJs their depth - the long-range vision that turns warmth into strategy.', gives:'The ability to see where a situation is heading and respond to that future state.', aware:'Can lock onto a vision of what is best for someone and push toward it uninvited.', watch:'Notice when your vision for someone else is about your own discomfort with their situation.'},
    Se:{name:'Extroverted Sensing', what:'Engagement with the physical world and capacity for present-moment action.', gives:'Energy, enthusiasm, and the ability to take quick decisive action.', aware:'Can produce impulsivity, particularly when Ni-Fe is frustrated.', watch:'Impulsive action after an emotional situation is usually tertiary Se unsupervised.'},
    Ti:{name:'Introverted Thinking', what:'Inferior Ti - internal logical analysis.', gives:'The ability to think independently of social consensus.', aware:'Under stress can produce sudden rigid or harshly analytical criticism.', watch:'Suddenly detached, harshly analytical behavior is a stress signal.'}
  }},
  INTP: {fns:['Ti','Ne','Si','Fe'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Ti builds the framework, your Ne generates the material - the loop can run a long time without external output.', data:{
    Ti:{name:'Introverted Thinking', what:'Builds elaborate internal logical frameworks, more interested in internal consistency than external consensus.', gives:'Exceptional analytical depth, independence from groupthink.', aware:'Without external checking can produce elegant systems that are wrong.', watch:'Notice when you are refining a model instead of testing it against reality.'},
    Ne:{name:'Extroverted Intuition', what:'Generates the raw material Ti works with - connections, possibilities, alternative framings.', gives:'Creativity, breadth of interest.', aware:'Ne-Ti loops - endless conceptual exploration with no grounding in results.', watch:'If you have thought about something for weeks with no output, that is probably a loop.'},
    Si:{name:'Introverted Sensing', what:'Provides access to past experience and a pull toward the familiar.', gives:'Ability to draw on accumulated knowledge over time.', aware:'Can cause you to stick with established methods even when new ones would be better.', watch:'Comfort with the familiar is not the same as the familiar being correct.'},
    Fe:{name:'Extroverted Feeling', what:'Inferior Fe - social and emotional attunement.', gives:'Genuine warmth and the ability to connect emotionally.', aware:'Under stress surfaces as sudden emotional outbursts or a need for validation.', watch:'A sudden need to know whether someone is upset with you is inferior Fe in stress.'}
  }},
  ENTP: {fns:['Ne','Ti','Fe','Si'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Ne generates the possibilities, your Ti stress-tests them - the loop can run a long time without landing.', data:{
    Ne:{name:'Extroverted Intuition', what:'A constant generator of connections, possibilities, and framings.', gives:'Rapid ideation, contagious intellectual energy.', aware:'Makes finishing things difficult.', watch:'Track the ratio of ideas started to ideas completed.'},
    Ti:{name:'Introverted Thinking', what:'Provides the analytical framework that separates ENTPs from pure idea generators.', gives:'Ability to stress-test ideas rigorously.', aware:'Can produce a person who argues any position regardless of belief.', watch:'Ask whether you actually believe the argument you just made.'},
    Fe:{name:'Extroverted Feeling', what:'Gives ENTPs social awareness and the ability to read a room.', gives:'Charm, genuine enjoyment of human connection.', aware:'Debate can feel like sport to you and an attack to others.', watch:'Check whether the other person is enjoying this conversation as much as you are.'},
    Si:{name:'Introverted Sensing', what:'Inferior Si - consistency, routine, follow-through.', gives:'Ability to build reliable habits over time.', aware:'Makes routine feel suffocating and long-term consistency hard.', watch:'If you have broken the same kind of commitment repeatedly, that is Si.'}
  }},
  ENTJ: {fns:['Te','Ni','Se','Fi'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Te moves fast toward outcomes while Ni sets the long-range target - powerful but can leave people behind.', data:{
    Te:{name:'Extroverted Thinking', what:'Primary orientation is toward results, systems, and external order.', gives:'Natural command of complex systems, decisive leadership.', aware:'Reduces everything to outcomes.', watch:'Notice when you are solving a people problem with a logistics approach.'},
    Ni:{name:'Introverted Intuition', what:'Provides the long-range vision that gives Te its direction.', gives:'Strategic depth, ability to commit before proof is available.', aware:'Can lock onto a vision with such focus contradicting information stops landing.', watch:'When did you last genuinely revise a long-held conviction?'},
    Se:{name:'Extroverted Sensing', what:'Physical presence, situational awareness, decisive action in the moment.', gives:'Confidence in high-pressure environments.', aware:'Under stress can produce impulsive decisions.', watch:'Sudden impulsive behavior after sustained pressure is a signal.'},
    Fi:{name:'Introverted Feeling', what:'Inferior Fi - personal values, emotional needs, inner world.', gives:'Deep personal integrity that gives Te direction beyond efficiency.', aware:'Fi needs get suppressed until they overflow.', watch:'Disproportionate anger or hurt is often inferior Fi.'}
  }},
  ENFP: {fns:['Ne','Fi','Te','Si'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Ne generates possibilities faster than Fi can evaluate them - the challenge is always in the landing, not the launch.', data:{
    Ne:{name:'Extroverted Intuition', what:'Every conversation is raw material for connections and meanings generated in real time.', gives:'Genuine creativity, warmth that makes people feel seen.', aware:'Makes starting easy and finishing hard.', watch:'Track things started versus completed in the last six months.'},
    Fi:{name:'Introverted Feeling', what:'The value anchor behind Ne\'s possibilities.', gives:'Authenticity, a clear sense of what actually matters.', aware:'Fi and Ne can loop - generating meaningful possibilities that never become real.', watch:'Check whether enthusiasm is Fi alignment or fading Ne excitement.'},
    Te:{name:'Extroverted Thinking', what:'A drive toward structure and completion that shows up inconsistently.', gives:'The ability to actually execute on what Ne and Fi generate.', aware:'Produces bursts of organization followed by abandonment.', watch:'Notice if Te energy is going into planning instead of doing.'},
    Si:{name:'Introverted Sensing', what:'Inferior Si - routine, consistency, follow-through.', gives:'Stability to build something over time.', aware:'Under stress surfaces as rigid routine or health anxiety.', watch:'Sudden obsession with a past experience under stress is inferior Si.'}
  }},
  ISTJ: {fns:['Si','Te','Fi','Ne'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Si cross-references everything against what has proven to work - Te then builds the structure to implement it reliably.', data:{
    Si:{name:'Introverted Sensing', what:'Processes experience by comparing it against a detailed internal archive of what has worked.', gives:'Exceptional reliability, deep competence built through accumulation.', aware:'Can cause you to trust precedent over evidence even when context has changed.', watch:'When you resist something new, ask whether it is better or just familiar.'},
    Te:{name:'Extroverted Thinking', what:'Drive toward structure, efficiency, and measurable results.', gives:'Clear communication, ability to organize processes.', aware:'Si-Te can produce rigidity.', watch:'Notice whether the structure you enforce serves the goal or has become the goal.'},
    Fi:{name:'Introverted Feeling', what:'A quiet but firm personal value system operating in the background.', gives:'A deep, private sense of integrity and loyalty.', aware:'Can surface as unexpected stubbornness around things that seem minor to others.', watch:'When you dig in unexpectedly, ask what value is actually at stake.'},
    Ne:{name:'Extroverted Intuition', what:'Inferior Ne - possibilities, open-endedness. Least developed.', gives:'The ability to see options and adapt when things change.', aware:'Under stress surfaces as catastrophizing.', watch:'Spiraling worst-case thinking under pressure is inferior Ne.'}
  }},
  ISFJ: {fns:['Si','Fe','Ti','Ne'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Si holds what matters and what has worked, while Fe routes that care outward into consistent support for people.', data:{
    Si:{name:'Introverted Sensing', what:'Deeply attuned to what has been - memories of people, places, and experiences are detailed and meaningful.', gives:'Remarkable attentiveness to people\'s specific needs.', aware:'Can cause you to hold onto past experiences longer than useful.', watch:'When you resist change, ask whether it is about the thing itself or what it replaces.'},
    Fe:{name:'Extroverted Feeling', what:'Routes Si\'s attentiveness outward into care and support for others.', gives:'Warmth that feels genuine because it is based on actual knowledge of the person.', aware:'Makes conflict feel deeply uncomfortable.', watch:'Check whether you are saying yes because you want to or to avoid discomfort.'},
    Ti:{name:'Introverted Thinking', what:'A quiet analytical capacity that surprises people who read ISFJs as purely relational.', gives:'The ability to spot inconsistencies.', aware:'Can produce sudden sharp criticism that feels out of character.', watch:'A sudden cold inner voice is often a signal something genuinely does not add up.'},
    Ne:{name:'Extroverted Intuition', what:'Inferior Ne - possibilities, open-endedness, comfort with change. Least developed.', gives:'The ability to adapt when circumstances shift.', aware:'Under stress surfaces as anxiety about what could go wrong.', watch:'Worst-case spiraling is inferior Ne under stress.'}
  }},
  ESTJ: {fns:['Te','Si','Ne','Fi'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Te pushes toward results while Si anchors to what has proven reliable.', data:{
    Te:{name:'Extroverted Thinking', what:'Default orientation is toward order, results, and accountability.', gives:'Natural organizational leadership.', aware:'Can produce a style others read as blunt even unintentionally.', watch:'Notice when you are managing a relationship like a project.'},
    Si:{name:'Introverted Sensing', what:'Respect for precedent, procedure, and what has been proven over time.', gives:'Institutional knowledge, ability to maintain standards.', aware:'Si-Te can become rigid.', watch:'Ask whether you defend a standard because it is right or familiar.'},
    Ne:{name:'Extroverted Intuition', what:'Occasional access to possibility thinking and flexibility.', gives:'The ability to generate alternatives when standard approaches fail.', aware:'Underdeveloped Ne makes change feel threatening.', watch:'When a situation needs a new approach, let Ne run before Te evaluates.'},
    Fi:{name:'Introverted Feeling', what:'Inferior Fi - personal values, emotional needs. Least conscious.', gives:'A deep personal integrity beyond maintaining structure.', aware:'Fi gets suppressed until it overflows.', watch:'Disproportionate anger is often inferior Fi - something was violated.'}
  }},
  ESFJ: {fns:['Fe','Si','Ne','Ti'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Fe reads and responds to the emotional field while Si anchors you to what has worked.', data:{
    Fe:{name:'Extroverted Feeling', what:'Primary mode is through the emotional atmosphere of your environment.', gives:'Genuine social warmth, ability to make people feel cared for.', aware:'Can absorb responsibility for other people\'s emotional states.', watch:'Check whether you are managing your own discomfort with someone else\'s unhappiness.'},
    Si:{name:'Introverted Sensing', what:'Reliability and memory for what has worked relationally.', gives:'Consistency, deep knowledge of the people you care about.', aware:'Can produce hurt when familiar patterns are rejected.', watch:'When you feel unappreciated, ask whether you offered what was needed now.'},
    Ne:{name:'Extroverted Intuition', what:'Access to possibility thinking that often goes unrecognized.', gives:'Creativity in social situations.', aware:'Can produce anxiety about what could go wrong relationally.', watch:'Worst-case social scenarios in your head are Ne anxiety.'},
    Ti:{name:'Introverted Thinking', what:'Inferior Ti - internal logical analysis independent of social consensus.', gives:'The ability to evaluate situations on logical merits.', aware:'Under stress surfaces as sudden cold logic.', watch:'A sudden pedantic inner voice is inferior Ti under pressure.'}
  }},
  ISTP: {fns:['Ti','Se','Ni','Fe'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Ti diagnoses the problem precisely while Se gathers real-world data in real time.', data:{
    Ti:{name:'Introverted Thinking', what:'Analysis - taking things apart to understand exactly how they work.', gives:'Exceptional diagnostic ability, calm precision under pressure.', aware:'Can produce detachment others read as coldness.', watch:'If the other person is still upset after your logical solution, that was not the problem they had.'},
    Se:{name:'Extroverted Sensing', what:'Direct engagement with the physical world in real time.', gives:'Exceptional situational awareness, practical competence.', aware:'Less interested in long-range planning.', watch:'Notice whether you are solving for right now or three months from now.'},
    Ni:{name:'Introverted Intuition', what:'Occasional flashes of long-range pattern recognition.', gives:'Depth beneath the surface competence.', aware:'Can produce sudden hunches that are not always reliable.', watch:'Check strong gut senses against observable evidence.'},
    Fe:{name:'Extroverted Feeling', what:'Inferior Fe - social and emotional attunement. Least developed.', gives:'Genuine warmth and the ability to communicate care.', aware:'Under stress surfaces as sudden emotional outbursts or need for approval.', watch:'An unexpected emotional reaction signals the relational environment needs attention.'}
  }},
  ISFP: {fns:['Fi','Se','Ni','Te'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Fi holds what you value with quiet intensity while Se keeps you present and engaged.', data:{
    Fi:{name:'Introverted Feeling', what:'Everything filtered through a deep, personal value system first.', gives:'Authenticity that others feel immediately.', aware:'Others may not know there is a problem until you have already decided.', watch:'Notice when you withdraw instead of naming what is wrong.'},
    Se:{name:'Extroverted Sensing', what:'Keeps ISFPs present, engaged, expressed through action and craft.', gives:'Aesthetic sensitivity, ability to be fully present.', aware:'Can make external commitments feel less urgent.', watch:'Check whether presence is grounding you or letting you avoid something.'},
    Ni:{name:'Introverted Intuition', what:'Quiet depth and occasional flashes of insight about where things are heading.', gives:'Depth beneath the gentle surface.', aware:'Can produce brooding conclusions without enough external data.', watch:'When you have quietly decided how something will go, ask what you actually know.'},
    Te:{name:'Extroverted Thinking', what:'Inferior Te - structure, systems, deadlines. Least developed.', gives:'The ability to organize and execute Fi\'s values.', aware:'Under stress surfaces as sudden harsh criticism.', watch:'A sharp inner voice under pressure is inferior Te, not accurate.'}
  }},
  ESTP: {fns:['Se','Ti','Fe','Ni'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Se reads what is happening right now with exceptional accuracy while Ti diagnoses it fast.', data:{
    Se:{name:'Extroverted Sensing', what:'Fully tuned to what is happening in your immediate environment.', gives:'Exceptional situational awareness.', aware:'Consequences that are not immediately visible are easy to underweight.', watch:'Notice when the correct-for-now move creates a downstream cost.'},
    Ti:{name:'Introverted Thinking', what:'The fast internal diagnosis that separates ESTPs from pure impulse.', gives:'The ability to read a situation accurately, not just quickly.', aware:'Confident and often right, which makes it harder to notice when wrong.', watch:'Ask when you last updated a read based on new information.'},
    Fe:{name:'Extroverted Feeling', what:'Genuine social awareness and charm.', gives:'The ability to connect across contexts.', aware:'Can be used instrumentally without genuine relational engagement.', watch:'Check whether your engagement with someone is genuine or performative.'},
    Ni:{name:'Introverted Intuition', what:'Inferior Ni - long-range pattern recognition. Least developed.', gives:'Strategic depth to pair with Se\'s tactical excellence.', aware:'Under stress surfaces as sudden doom-thinking or paranoia.', watch:'Sudden catastrophizing with no clear grounding is inferior Ni.'}
  }},
  ESFP: {fns:['Se','Fi','Te','Ni'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your Se brings you fully into the present moment while Fi ensures what you engage with actually means something to you.', data:{
    Se:{name:'Extroverted Sensing', what:'Your natural home is the present moment.', gives:'The ability to make people feel genuinely seen.', aware:'Can make the future feel abstract.', watch:'Notice the difference between being present and avoiding forward attention.'},
    Fi:{name:'Introverted Feeling', what:'A personal value system that ensures Se engagement actually matters to you.', gives:'Genuine warmth rather than social performance.', aware:'Feelings expressed through behavior rather than words can go unread by others.', watch:'Practice naming what you value rather than demonstrating it.'},
    Te:{name:'Extroverted Thinking', what:'A drive toward results and structure that shows up inconsistently.', gives:'The ability to organize and follow through.', aware:'All-or-nothing relationship with structure.', watch:'One small consistent structure beats ten ambitious plans.'},
    Ni:{name:'Introverted Intuition', what:'Inferior Ni - long-range pattern recognition. Least developed.', gives:'Strategic depth to give Se direction beyond the moment.', aware:'Under stress surfaces as doom-thinking or paranoia about motives.', watch:'Sudden overwhelming anxiety about the future is inferior Ni.'}
  }}
};

var STUB_STACK = {fns:['Dom','Aux','Ter','Inf'], roles:['Dominant','Auxiliary','Tertiary','Inferior'], lens:'your cognitive stack shapes how you process experience in ways that are both strength and blind spot.', data:{Dom:{name:'Dominant function',what:'Full breakdown for this type coming soon.',gives:'',aware:'',watch:''},Aux:{name:'Auxiliary function',what:'',gives:'',aware:'',watch:''},Ter:{name:'Tertiary function',what:'',gives:'',aware:'',watch:''},Inf:{name:'Inferior function',what:'',gives:'',aware:'',watch:''}}};

var GROWTH = {
  INFJ: {healthy:{title:'Healthy INFJ',points:['Ni and Fe work in balance - deep insight is channeled outward with genuine care, not compulsion.','Holds boundaries without guilt.','Uses Ti to self-check rather than treating Ni certainty as fact.','Present in the physical world; can act decisively without overplanning.']},unhealthy:{title:'Unhealthy INFJ',points:['Ni-Ti loop: increasingly certain internal visions with no external reality check.','Martyrdom pattern - absorbs everyone else\'s emotional weight, then resents it.','Withdraws entirely when overwhelmed rather than communicating needs.','Inferior Se breaks through as impulsive, out-of-character behavior.']},growth:{title:'The growth edge',points:['Learn to distinguish Ni insight from Ni wishful thinking.','Ask for what you need before you reach the point of resentment.','Let Ti challenge your conclusions before you fully commit to them.']}},
  INTJ: {healthy:{title:'Healthy INTJ',points:['Ni and Te work toward something genuinely meaningful, not just efficient.','Allows Fi to surface and name what actually matters.','Holds vision with confidence but updates it when evidence demands it.']},unhealthy:{title:'Unhealthy INTJ',points:['Ni-Te loop: brilliant execution toward increasingly unexamined goals.','Certainty calcifies into contempt for anyone who processes differently.','Fi ignored until it explodes as unexpected intensity.']},growth:{title:'The growth edge',points:['Ask when you last genuinely changed your mind.','Fi is not weakness - it makes your execution more coherent.','Find one relationship where you are not the most competent person in the room.']}},
  INFP: {healthy:{title:'Healthy INFP',points:['Fi is clear and directed; Ne generates ideas Fi actually commits to.','Comfortable with imperfection - produces and releases work.','Te develops enough to execute and meet commitments.']},unhealthy:{title:'Unhealthy INFP',points:['Fi echo chamber - values become private and removed from reality.','Ne-Fi loop generates meaning internally with no external output.','Perfectionism prevents starting or finishing.']},growth:{title:'The growth edge',points:['The internal vision does not count until it is external.','Tell people what you need; your inner world is less visible than it feels.','Te is not the enemy of authenticity - it lets values exist in the world.']}},
  ENFJ: {healthy:{title:'Healthy ENFJ',points:['Fe and Ni in balance - genuinely reads people and holds an independent view.','Helps from abundance, not anxiety about what happens if they do not.','Capable of receiving help; the giving is not a control mechanism.']},unhealthy:{title:'Unhealthy ENFJ',points:['Fe dominance without Ni check: manages atmospheres compulsively.','Needs to be needed - creates dependencies in others.','Cannot tolerate conflict - smooths over real problems.']},growth:{title:'The growth edge',points:['Ask whether your help was requested.','Develop a view that does not require agreement to hold.','Your needs are not an imposition.']}},
  INTP: {healthy:{title:'Healthy INTP',points:['Ti builds frameworks that get tested externally, not just refined internally.','Fe developed enough to care about impact on real people.','Can communicate thinking in a way others can follow and use.']},unhealthy:{title:'Unhealthy INTP',points:['Ti-Ne loop: elaborate frameworks that are never tested.','Procrastination as perfectionism - completing something makes it judgeable.','Dismisses emotional reality as irrelevant noise, then gets blindsided.']},growth:{title:'The growth edge',points:['A framework you cannot explain to someone is not finished.','Fe is information, not contamination.','Pick one thing and finish it before the next idea.']}},
  ENTP: {healthy:{title:'Healthy ENTP',points:['Ne generates, Ti evaluates, and something actually gets built or decided.','Can distinguish what they believe from what they are performing.','Follows through on commitments even when something more interesting appears.']},unhealthy:{title:'Unhealthy ENTP',points:['Ne-Ti loop: ideas and analysis that never produce anything.','Debates to win rather than to think.','Chronic unfinished projects - Si fails entirely.']},growth:{title:'The growth edge',points:['Pick the idea and stay - optionality has a real cost.','Ask whether the person you are debating is enjoying it.','Si is not death - consistency lets ideas become real.']}},
  ENTJ: {healthy:{title:'Healthy ENTJ',points:['Te is in service of something genuinely worth building.','Fi is acknowledged - knows what actually matters beyond outcome.','Can receive pushback without treating it as disloyalty.']},unhealthy:{title:'Unhealthy ENTJ',points:['Te-Ni loop: brilliant execution toward increasingly unexamined goals.','Contempt for anyone who processes differently.','Every interpersonal conflict treated as a logistics problem.']},growth:{title:'The growth edge',points:['Ask what you are actually building toward, and whether it is worth it.','Fi is the function that makes your goals worth having.','Let people push back - a plan that survives challenge is stronger.']}},
  ENFP: {healthy:{title:'Healthy ENFP',points:['Ne generates possibilities that Fi actually commits to.','Can finish things - not everything, but enough.','Te developed enough to structure time without it feeling like a cage.']},unhealthy:{title:'Unhealthy ENFP',points:['Ne-Fi loop: endless generation with no external output.','Chronic non-completion at the point of difficulty.','Commits from excitement and disappoints by not following through.']},growth:{title:'The growth edge',points:['The idea is not the thing - the made thing is the thing.','Te is not betraying authenticity, it is what lets values exist.','Distinguish Ne excitement from Fi alignment.']}},
  ISTJ: {healthy:{title:'Healthy ISTJ',points:['Si-Te builds toward things that matter, not just what is familiar.','Can update when evidence demands it.','Ne developed enough to see options when standard approaches hit limits.']},unhealthy:{title:'Unhealthy ISTJ',points:['Precedent over evidence, defended long after context changed.','Fi ignored until it overflows as stubbornness or withdrawal.','Rigidity dressed as reliability.']},growth:{title:'The growth edge',points:['Reliability is a strength; know when a new approach is needed.','Fi needs to be named before it overflows.','Ne is not chaos - it is options.']}},
  ISFJ: {healthy:{title:'Healthy ISFJ',points:['Fe gives genuinely rather than from fear.','Boundaries exist and are communicated before resentment builds.','Ti developed enough to catch when something does not add up.']},unhealthy:{title:'Unhealthy ISFJ',points:['Yes becomes the only answer because no feels too dangerous.','Si attachment to the past prevents honest engagement with now.','Self-erasure in the name of service.']},growth:{title:'The growth edge',points:['No is a complete sentence.','Your needs matter with the same weight as other people\'s.','Ti lets you know when something is genuinely wrong.']}},
  ESTJ: {healthy:{title:'Healthy ESTJ',points:['Te in service of something worth building, not structure for its own sake.','Fi is acknowledged as distinct from duty and procedure.','Can hear pushback without treating it as insubordination.']},unhealthy:{title:'Unhealthy ESTJ',points:['Authority confused with correctness.','Fi suppressed until it overflows.','People managed like processes.']},growth:{title:'The growth edge',points:['Ask whether a standard is right or just established.','Fi knows what you actually value.','Pushback is data, not disloyalty.']}},
  ESFJ: {healthy:{title:'Healthy ESFJ',points:['Gives from abundance rather than anxiety.','Fe reads the room without absorbing responsibility for fixing it.','Ti developed enough to know when something is genuinely wrong.']},unhealthy:{title:'Unhealthy ESFJ',points:['Harmony maintained at the cost of honesty.','Fe absorbs responsibility for everyone\'s emotional state.','Needs never stated; others expected to reciprocate unasked.']},growth:{title:'The growth edge',points:['Harmony is valuable, honesty is necessary.','Your needs exist and stating them is not demanding.','Ti lets you know when something does not add up.']}},
  ISTP: {healthy:{title:'Healthy ISTP',points:['Ti diagnoses accurately and Se responds effectively.','Acknowledges the relational dimension even when uninteresting.','Fe developed enough to communicate care others can receive.']},unhealthy:{title:'Unhealthy ISTP',points:['Problem solved equals conversation over - relational layer unaddressed.','Detachment others experience as coldness.','Commitment avoidance dressed as self-sufficiency.']},growth:{title:'The growth edge',points:['Solving the technical problem is not the same as solving the problem.','Fe is not performance - communicate care in ways others receive.','Ni models consequences - run the tape forward before acting.']}},
  ISFP: {healthy:{title:'Healthy ISFP',points:['Fi knows what it values and acts from that clarity.','Can name what they need rather than withdrawing.','Conflict addressed directly rather than through disappearance.']},unhealthy:{title:'Unhealthy ISFP',points:['Conflict withdrawn from so cleanly others learn late there was a problem.','Values privately held so no one can know what is needed.','Inferior Te explosion after long silent absorption.']},growth:{title:'The growth edge',points:['Name it before you disappear.','Your values are not self-evident to others.','Te is not the enemy of authenticity.']}},
  ESTP: {healthy:{title:'Healthy ESTP',points:['Se reads the present accurately and Ti diagnoses it correctly.','Models downstream consequences before acting.','Can commit to follow-through after the interesting part passed.']},unhealthy:{title:'Unhealthy ESTP',points:['Bold move optimized for now at the cost of what happens downstream.','Being right often makes it harder to notice being wrong.','Commitment avoidance dressed as adaptability.']},growth:{title:'The growth edge',points:['The present read matters - so does three months from now.','Fe is not soft; it makes you more effective.','Ni is the function that lets you see where things are heading.']}},
  ESFP: {healthy:{title:'Healthy ESFP',points:['Se presence is genuine rather than performative.','Fi provides depth beneath the energetic surface.','Te developed enough to build simple, sustainable structure.']},unhealthy:{title:'Unhealthy ESFP',points:['Performance of engagement replaces actual engagement.','Inferior Ni surfaces as sudden anxiety about the future.','Values expressed through behavior, expected to be intuited.']},growth:{title:'The growth edge',points:['Presence is a strength; follow-through is where it becomes real.','Name what you value rather than demonstrating and hoping.','One consistent small structure beats periodic intense organization.']}}
};

var STUB_GROWTH = {
  healthy:{title:'Healthy version',points:['Full growth breakdown for this type coming soon.']},
  unhealthy:{title:'Unhealthy version',points:['Full growth breakdown for this type coming soon.']},
  growth:{title:'The growth edge',points:['Full growth breakdown for this type coming soon.']}
};

var GLOSSARY = [
  {sym:'Ni', name:'Introverted Intuition', body:'Synthesizes patterns and future trajectories beneath conscious thought. Produces insights that arrive as certainty rather than steps.', positions:[
    {role:'Dominant', badge:'b-dom', text:'The primary lens. Tendency toward single-minded vision and deep foresight. (INFJ, INTJ)'},
    {role:'Auxiliary', badge:'b-aux', text:'Provides strategic depth behind a primary function. (ENFJ, ENTJ)'},
    {role:'Tertiary', badge:'b-ter', text:'Intermittent flashes of pattern recognition or sudden hunches. (ISFP, ISTP)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress may surface as paranoia or doom-thinking. (ESFP, ESTP)'}
  ]},
  {sym:'Ne', name:'Extroverted Intuition', body:'Generates connections, possibilities, and alternative framings in real time.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Constant idea generation, difficulty committing to one path. (ENFP, ENTP)'},
    {role:'Auxiliary', badge:'b-aux', text:'Adds creative flexibility and breadth. (INFP, INTP)'},
    {role:'Tertiary', badge:'b-ter', text:'Intermittent bursts of creativity or tangents. (ESFJ, ESTJ)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress surfaces as anxiety about missed possibilities. (ISFJ, ISTJ)'}
  ]},
  {sym:'Si', name:'Introverted Sensing', body:'Stores and compares present experience against a detailed internal archive of past experience.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Strong reliability and attention to detail. (ISFJ, ISTJ)'},
    {role:'Auxiliary', badge:'b-aux', text:'Grounds a primary function in past experience. (ESFJ, ESTJ)'},
    {role:'Tertiary', badge:'b-ter', text:'Intermittent nostalgia or comfort-seeking. (INTP, INFP)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: obsessive attention to symptoms or sudden rigid routine. (ENTP, ENFP)'}
  ]},
  {sym:'Se', name:'Extroverted Sensing', body:'Engages the physical, present-moment world directly.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Fully present and action-oriented. (ESFP, ESTP)'},
    {role:'Auxiliary', badge:'b-aux', text:'Grounds abstract thinking in concrete action. (ISFP, ISTP)'},
    {role:'Tertiary', badge:'b-ter', text:'Sudden aesthetic awareness or decisive bursts. (ENFJ, ENTJ)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: compulsive behavior or reckless urges. (INFJ, INTJ)'}
  ]},
  {sym:'Fi', name:'Introverted Feeling', body:'Maintains a deep, personal, internal value system. Private, specific, and strongly felt.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Deep authenticity, difficulty compromising under pressure. (INFP, ISFP)'},
    {role:'Auxiliary', badge:'b-aux', text:'Adds ethical depth without total absorption. (ENFP, ESFP)'},
    {role:'Tertiary', badge:'b-ter', text:'Quiet but firm lines drawn unexpectedly. (INTJ, ISTJ)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: emotional outbursts or hypersensitivity to criticism. (ENTJ, ESTJ)'}
  ]},
  {sym:'Fe', name:'Extroverted Feeling', body:'Reads and responds to the emotional atmosphere of groups and relationships.', positions:[
    {role:'Dominant', badge:'b-dom', text:'High empathy and social leadership. (ENFJ, ESFJ)'},
    {role:'Auxiliary', badge:'b-aux', text:'Adds warmth behind a primary function. (INFJ, ISFJ)'},
    {role:'Tertiary', badge:'b-ter', text:'Intermittent social attunement or sudden people-pleasing. (ENTP, ESTP)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: emotional outbursts or need for approval. (INTP, ISTP)'}
  ]},
  {sym:'Ti', name:'Introverted Thinking', body:'Builds and evaluates internal logical frameworks for their own consistency.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Builds original frameworks, resists groupthink. (INTP, ISTP)'},
    {role:'Auxiliary', badge:'b-aux', text:'Adds analytical rigor behind a primary function. (ENTP, ESTP)'},
    {role:'Tertiary', badge:'b-ter', text:'Intermittent logical checking, sharp criticism. (INFJ, ISFJ)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: rigid pedantic logic or cold detachment. (ENFJ, ESFJ)'}
  ]},
  {sym:'Te', name:'Extroverted Thinking', body:'Organizes the external world through systems, efficiency, and measurable outcomes.', positions:[
    {role:'Dominant', badge:'b-dom', text:'Decisive, structured, impatient with inefficiency. (ENTJ, ESTJ)'},
    {role:'Auxiliary', badge:'b-aux', text:'Adds execution and structure. (INTJ, ISTJ)'},
    {role:'Tertiary', badge:'b-ter', text:'Sudden organizational efforts or blunt communication. (ENFP, ESFP)'},
    {role:'Inferior', badge:'b-inf', text:'Under stress: harsh criticism or productivity obsession. (INFP, ISFP)'}
  ]}
];

var QUIZ = [
  {q:'After a long social day, what do you need most?', sub:'Think about how you actually recharge - not how you wish you did.', opts:[
    {t:'Quiet time alone to reset.', s:{I:2}},
    {t:'Low-key time with a couple of close people.', s:{E:1,F:1}},
    {t:'Some space and then I am ready again.', s:{I:1}},
    {t:'I get energy from it - usually the last to leave.', s:{E:2}}
  ]},
  {q:'When making a big decision, what drives you most?', sub:'Be honest about what actually happens, not what should.', opts:[
    {t:'Logic and analysis - I build a framework and follow it.', s:{T:2}},
    {t:'How it feels and whether it aligns with what I value.', s:{F:2}},
    {t:'Both - I factor in logic and gut.', s:{T:1,F:1}},
    {t:'My gut. I usually know before I can explain why.', s:{N:1,I:1}}
  ]},
  {q:'How do you approach the unknown?', sub:'', opts:[
    {t:'Make a plan - I feel better once there is structure.', s:{J:2,S:1}},
    {t:'Stay open - too much planning kills possibility.', s:{P:2,N:1}},
    {t:'Research until I am confident enough to move.', s:{J:1,T:1}},
    {t:'Sit with it. Uncertainty is information too.', s:{I:1,N:1}}
  ]},
  {q:'How do you think best?', sub:'', opts:[
    {t:'In patterns and connections - I jump between ideas.', s:{N:2}},
    {t:'Concretely and practically - I care about what works.', s:{S:2}},
    {t:'Deeply and systematically - I build models internally.', s:{N:1,I:1}},
    {t:'Through people and stories - abstractions need grounding.', s:{S:1,F:1}}
  ]},
  {q:'When something important goes wrong, your first move is...', sub:'', opts:[
    {t:'Figure out what failed and fix the system.', s:{T:2,J:1}},
    {t:'Process the feeling, then deal with the facts.', s:{F:2}},
    {t:'Understand it deeply before doing anything.', s:{I:1,N:1}},
    {t:'Move fast - act now, reflect later.', s:{E:1,S:1,P:1}}
  ]}
];
