"use client"

import { useState } from "react";



export default function BeforeAfter() {

  type ExampleKeys = keyof typeof examples;



const [tab, setTab] = useState<ExampleKeys>("titles");

  
// here array of each things and inside that array of objects.. like for titles, description, tags, hashtags...
const examples = {

  titles: [
    { before: "How to stop procrastinating", after: "This 3-Minute Trick Killed My Procrastination Forever ⏰" },
    { before: "How to get more YouTube views", after: "This Hidden Algorithm Hack 10×'d My YouTube Views 🚀" },
    { before: "Minecraft survival challenge", after: "I Survived 100 Days in Minecraft Hardcore 😱" },
    { before: "Morning routine for success", after: "The 7-Minute Morning Routine That Rewired My Brain 🧠" },

    // ⭐ NEW Programming Title
    { before: "Learn JavaScript basics", after: "I Mastered JavaScript in 30 Days — Here’s the Blueprint I Wish I Had 🔥" },
  ],



  descriptions: [
    { 
      before: "In this video I will show you how to edit videos faster using shortcuts and tips.",
      after: "🎬 Want to edit 3X faster? I reveal the exact shortcuts Pro editors use (that YouTube won't tell you about). By the end of this video, you'll cut your editing time from 5 hours to 90 minutes. #videoediting #premiere"
    },
    { 
      before: "This is a cooking video where I make pasta. I'll show the recipe step by step.",
      after: "🍝 This 15-minute pasta hack went VIRAL for a reason! My Italian grandmother's secret recipe that restaurants charge $30 for. You only need 5 ingredients (you already have them). Drop a 🔥 if you're making this tonight! #pastarecipe #cooking"
    },
    { 
      before: "Tutorial on how to grow your Instagram followers organically.",
      after: "📈 I grew from 0 to 50K followers in 90 days WITHOUT paid ads (here's the exact blueprint). This strategy works in 2024 even if you're starting from scratch. Best part? It takes 10 mins/day. Click the timestamps below 👇 #instagramgrowth #socialmedia"
    },
    {
      before: "This video shows 7 habits that can improve your morning routine.",
      after: "🌅 Transform your mornings in ONE week. These 7 science-backed habits rewired my focus, boosted my energy, and helped me stay consistent. Try #4 for instant results! #morningroutine #selfimprovement"
    },

    // ⭐ NEW Programming Description
    {
      before: "In this tutorial I explain JavaScript basics for beginners.",
      after: "💻 Want to learn JavaScript but overwhelmed by tutorials? I break down JS in the simplest way possible — variables, functions, arrays, DOM, everything. By the end, you'll write your own mini projects confidently. #javascript #codingforbeginners"
    },
  ],




  tags: [
    { 
      before: "gaming, minecraft, survival, challenge",
      after: "minecraft hardcore, 100 days challenge, minecraft survival tips, gaming challenge 2024, minecraft secrets, hardcore survival guide, minecraft gameplay, survival games, trending minecraft, viral gaming content"
    },
    { 
      before: "fitness, workout, exercise, health",
      after: "home workout no equipment, 15 min fat burn, quick fitness routine, workout for beginners, fat loss workout, body transformation, fitness 2024, effective exercise, weight loss at home, trending fitness"
    },
    { 
      before: "cooking, recipe, food, kitchen",
      after: "easy 5 ingredient recipes, quick dinner ideas, cooking hacks 2024, viral food recipe, budget friendly meals, cooking for beginners, family dinner recipes, trending cooking videos, kitchen tips and tricks, meal prep ideas"
    },
    {
      before: "motivation, routine, morning",
      after: "morning routine tips, productivity hacks 2024, self improvement routine, daily habits for success, motivational habits, morning life hacks, how to be consistent, improve productivity, focus habits, life changing habits"
    },

    // ⭐ NEW Programming Tags
    {
      before: "javascript, coding, programming, beginner",
      after: "javascript tutorial for beginners, learn coding step by step, coding for beginners 2024, js fundamentals, front end development, coding roadmap, project based learning, programming tips, web development basics, easy javascript tutorial"
    },
  ],




  hashtags: [
    { 
      niche: "Fitness",
      title: "The 7-Minute Morning Routine That Rewired My Brain 🧠",
      hashtags: "#morningroutine #fitness #productivityhacks #healthylifestyle #workoutmotivation #fitnessjourney #morningworkout #selfimprovement #mindset #fitnesstips"
    },
    { 
      niche: "Gaming",
      title: "I Survived 100 Days in Minecraft Hardcore 😱",
      hashtags: "#minecraft #gaming #minecrafthardcore #100dayschallenge #minecraftsurvival #gamer #minecrafttips #gamingcommunity #minecraftgameplay #videogames"
    },
    { 
      niche: "Cooking",
      title: "This 15-Minute Pasta Recipe Went VIRAL 🍝",
      hashtags: "#cooking #recipe #foodie #pastarecipe #quickmeals #easyrecipes #viralrecipe #foodlover #cookinghacks #delicious"
    },
    { 
      niche: "Business",
      title: "This Hidden Algorithm Hack 10×'d My YouTube Views 🚀",
      hashtags: "#youtube #youtubegrowth #contentcreator #youtubestrategy #socialmediamarketing #youtuberlife #youtubetips #videocontent #digitalmarketing #contentmarketing"
    },

    // ⭐ NEW Programming Hashtags
    {
      niche: "Programming",
      title: "I Mastered JavaScript in 30 Days — Here’s the Blueprint I Wish I Had 🔥",
      hashtags: "#javascript #coding #webdevelopment #programmingtips #learncoding #frontenddeveloper #codeforbeginners #100daysofcode #softwaredevelopment #jsbeginner"
    },
  ],

};



type TabItem = {
  id: ExampleKeys;
  label: string;
};


  const tabs : TabItem[] = [
    { id: 'titles', label: 'Titles' },
    { id: 'descriptions', label: 'Descriptions'},
    { id: 'tags', label: 'Tags' },
    { id: 'hashtags', label: 'Hashtags' },
  ];


  
  

  
  return (
  <section className="py-20 md:py-24 bg-white">
    <div className="max-w-[1180px] mx-auto px-6 lg:px-20 flex flex-col items-center gap-12">

    {/* Heading */}
    <div className="text-center max-w-[700px]">


      <div className="inline-block mb-4 px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
              Real Results
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
        Before <span className="text-gray-400">→</span> <span className="text-red-600">After</span>
      </h2>
      <p className="text-gray-500 text-sm font-bold sm:text-base mt-3">
        Watch how optimized hooks transform normal titles into viral winners.
      </p>
    </div>


    {/* --- tab navigation on screen landing page --- */}
      <div className="w-full max-w-[1050px]">
        <div className=" flex flex-wrap justify-center gap-2 mb-6">
          { tabs.map((EachTab)=>(
            <button key={EachTab.id} onClick={()=> setTab(EachTab.id)}
                  className={`
                  px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                  ${tab === EachTab.id 
                    ? 'bg-red-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}>
                  {EachTab.label}
                </button>
          ) )}
        </div>
      </div>





{/* ---------------------------------------------------------------------------------------------- */}


    {/* Table for all tabs and iske ander contents will changes like titles, description, tags and hashtags ... */}
    <div className="w-full max-w-[1050px] rounded-3xl border border-red-200 shadow-xl overflow-hidden">








      {/* -------> Header — desktop not hashtags */}
        {tab !== 'hashtags'  &&  (
        <div className="hidden md:grid grid-cols-2 bg-gray-50 border-b border-red-200 text-center">
          <div className="py-5 font-semibold text-gray-700 border-r border-red-100">Before</div>
          <div className="py-5 font-semibold text-red-700">After (AI Optimized)</div>
        </div>)}





      {/* -------> Header — desktop & not hashtags */}
          {tab === 'hashtags' ? (
            <div>
              {examples.hashtags.map( (item, idx)=>(
                <div 
                key={idx}
                className="p-6 border-b last:border-b-0 border-red-100 hover:bg-red-50/30 transition"
                  >
                  <div className=" flex flex-col gap-3">

                    {/* ------ for niche------- */}
                      <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                              Niche : {item.niche}
                          </span>
                      </div>

                    {/* ------ for video title------- */}
                      <div className="flex flex-col gap-2">
                        <span className=" text-xs font-semibold text-gray-500  uppercase tracking-wide " >
                            Video title
                        </span>
                        <p className="text-gray-600 font-semibold text-xs sm:text-base ">
                          {item.title}
                        </p>
                      </div>

                    {/* ------ for AI hashtags according to this vid ------ */}
                      <div className=" flex flex-col gap-2">
                        <span className="text-xs font-semibold text-red-500 uppercase tracking-wide ">
                          AI Generated Hashtags</span>
                        <p className="text-red-700 font-medium text-sm sm:text-base leading-relaxed">
                          {item.hashtags}
                        </p>
                      </div>

                  </div>

                  
                </div>
              ))}
            </div>






          ):(



          // here all left tabs --> titles, descriptions, tags.

          examples[tab].map( (item, idx)=>(
            <div
            key={idx}
            className=" grid grid-cols-1 md:grid-cols-2 border-b last:border-b-0 border-red-100 transition hover:bg-red-50/60"
            >
              {/* ------before------- */}
              <div className="p-5 md:p-6 md:border-r border-red-100 flex flex-col gap-2">
              {/* md:hidden --> only on sm,md view*/}
                <span className="md:hidden inline-block bg-gray-100 text-gray-700 text-xs md:text-base font-semibold py-1 px-2 rounded-md w-fit">
                BEFORE
                </span>
                <p className="text-gray-700 text-sm sm:text-base md:text-md font-medium leading-snug">
                  “{item.before}”
                </p>
            </div>

              {/* ------After------- */}
              <div className="p-5 md:p-6 flex flex-col gap-2 bg-red-50/10">
                <span className="md:hidden inline-block bg-red-100 text-red-700 text-xs md:text-base font-medium py-1 px-2 rounded-md w-fit">
                  AFTER (AI Optimized)
                </span>
                <p className="text-red-700 text-sm sm:text-base md:text-md font-semibold leading-snug">
                  {item.after}
                </p>
            </div>
            </div>
          ))
          ) }




















    </div>
    
  </div>
      
    </section>
  );
}
