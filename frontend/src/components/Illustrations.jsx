import React from 'react';

// MindMate Main Avatar (Green hair, warm smile, green polo)
export const MindMateAvatar = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E8F1D4" />
    {/* Body / Shirt */}
    <path d="M22 92C22 75 34 68 50 68C66 68 78 75 78 92" fill="#588157" />
    <path d="M42 68L50 82L58 68" fill="#F8F7F4" />
    {/* Neck */}
    <rect x="44" y="56" width="12" height="15" rx="6" fill="#FFDFC4" />
    {/* Head */}
    <ellipse cx="50" cy="45" rx="20" ry="22" fill="#FFDFC4" />
    {/* Hair (Greenish Dark) */}
    <path d="M30 40C30 26 38 18 50 18C62 18 70 26 70 40C66 37 60 38 56 34C52 38 46 36 42 38C38 34 32 38 30 40Z" fill="#2D4A3E" />
    <path d="M30 40C28 44 28 48 30 52C31 46 33 44 35 44" fill="#2D4A3E" />
    <path d="M70 40C72 44 72 48 70 52C69 46 67 44 65 44" fill="#2D4A3E" />
    {/* Ears */}
    <circle cx="29" cy="46" r="4" fill="#FFDFC4" />
    <circle cx="71" cy="46" r="4" fill="#FFDFC4" />
    {/* Eyes (Happy curved eyes) */}
    <path d="M40 43C42 41 45 41 47 43" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M53 43C55 41 58 41 60 43" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cheeks */}
    <circle cx="39" cy="48" r="3" fill="#FFAAA6" opacity="0.6" />
    <circle cx="61" cy="48" r="3" fill="#FFAAA6" opacity="0.6" />
    {/* Smile */}
    <path d="M46 51C48 54 52 54 54 51" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Wellness Character (Peaceful hands on chest inside glowing circle)
export const WellnessPeaceCharacter = ({ className = "w-48 h-48" }) => (
  <svg viewBox="0 0 240 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft inner glow */}
    <circle cx="120" cy="120" r="88" fill="#FFF7ED" />
    
    {/* Yellow/Orange Floating sparkles */}
    <path d="M120 20L123 28L131 31L123 34L120 42L117 34L109 31L117 28L120 20Z" fill="#FFA500" opacity="0.8" />
    <circle cx="55" cy="70" r="3" fill="#FFB703" />
    <circle cx="185" cy="80" r="4" fill="#FFB703" />
    <circle cx="60" cy="160" r="3" fill="#FFB703" />
    <circle cx="180" cy="155" r="3.5" fill="#FFB703" />

    {/* Character body / Purple sweater */}
    <path d="M72 230C72 178 92 160 120 160C148 160 168 178 168 230" fill="#9D8DF1" />
    <path d="M108 160L120 178L132 160" fill="#F8F7F4" />

    {/* Crossed Hands over chest in mindfulness */}
    {/* Left Arm & Hand */}
    <path d="M80 200C88 185 106 175 125 188" stroke="#9D8DF1" strokeWidth="16" strokeLinecap="round" />
    <path d="M125 188C132 184 138 188 135 195C132 200 125 204 116 200" fill="#FFDFC4" />
    {/* Right Arm & Hand */}
    <path d="M160 200C152 185 134 175 115 188" stroke="#8A76E8" strokeWidth="16" strokeLinecap="round" />
    <path d="M115 188C108 184 102 188 105 195C108 200 115 204 124 200" fill="#FFDFC4" />

    {/* Neck */}
    <rect x="112" y="132" width="16" height="24" rx="8" fill="#FFDFC4" />
    {/* Head */}
    <ellipse cx="120" cy="115" rx="26" ry="28" fill="#FFDFC4" />

    {/* Hair (Greenish Dark) */}
    <path d="M94 108C94 90 105 80 120 80C135 80 146 90 146 108C141 104 134 105 128 100C122 105 115 103 110 105C105 100 97 105 94 108Z" fill="#2D4A3E" />
    <path d="M94 108C91 114 91 120 94 125C95 118 97 114 100 114" fill="#2D4A3E" />
    <path d="M146 108C149 114 149 120 146 125C145 118 143 114 140 114" fill="#2D4A3E" />

    {/* Ears */}
    <circle cx="93" cy="116" r="5" fill="#FFDFC4" />
    <circle cx="147" cy="116" r="5" fill="#FFDFC4" />

    {/* Serene Closed Eyes */}
    <path d="M106 114C109 118 114 118 117 114" stroke="#2D4A3E" strokeWidth="3" strokeLinecap="round" />
    <path d="M123 114C126 118 131 118 134 114" stroke="#2D4A3E" strokeWidth="3" strokeLinecap="round" />

    {/* Soft Cheeks */}
    <circle cx="106" cy="122" r="4" fill="#FFAAA6" opacity="0.6" />
    <circle cx="134" cy="122" r="4" fill="#FFAAA6" opacity="0.6" />

    {/* Gentle Smile */}
    <path d="M116 126C118 129 122 129 124 126" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Chatbot Waving Character (Orange hoodie boy waving hello)
export const ChatbotWavingCharacter = ({ className = "w-36 h-36" }) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lavender blob background */}
    <path d="M30 65C25 35 50 15 80 15C115 15 140 30 135 70C130 115 110 135 75 135C40 135 35 95 30 65Z" fill="#EDE9FE" />
    
    {/* Body / Orange Hoodie */}
    <path d="M40 155C40 120 55 108 80 108C105 108 120 120 120 155" fill="#FF874B" />
    {/* Hoodie strings */}
    <path d="M74 114V130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M86 114V130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Waving Hand (Right) */}
    <path d="M112 125C122 110 132 90 130 75" stroke="#FF874B" strokeWidth="12" strokeLinecap="round" />
    {/* Hand */}
    <path d="M130 75C132 70 136 68 140 72C143 75 142 80 138 85L130 88" fill="#FFDFC4" stroke="#FFDFC4" strokeWidth="3" strokeLinejoin="round" />
    {/* Motion lines */}
    <path d="M142 62C145 66 145 70 144 74" stroke="#FF874B" strokeWidth="2" strokeLinecap="round" />
    <path d="M147 67C150 71 150 75 149 78" stroke="#FF874B" strokeWidth="2" strokeLinecap="round" />

    {/* Neck */}
    <rect x="74" y="94" width="12" height="16" rx="6" fill="#FFDFC4" />
    {/* Head */}
    <ellipse cx="80" cy="80" rx="18" ry="20" fill="#FFDFC4" />

    {/* Hair (Greenish Dark) */}
    <path d="M62 75C62 60 70 52 80 52C90 52 98 60 98 75C95 72 90 73 85 69C81 73 76 71 72 73C68 69 63 73 62 75Z" fill="#2D4A3E" />
    <circle cx="61" cy="81" r="3.5" fill="#FFDFC4" />
    <circle cx="99" cy="81" r="3.5" fill="#FFDFC4" />

    {/* Happy Eyes */}
    <circle cx="73" cy="78" r="2.5" fill="#2D4A3E" />
    <circle cx="87" cy="78" r="2.5" fill="#2D4A3E" />
    {/* Smile */}
    <path d="M75 86C77 90 83 90 85 86" stroke="#2D4A3E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Sidebar Thumbs-up Character
export const ThumbsUpCharacter = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Green Plant Background */}
    <path d="M95 110C95 80 108 65 112 55C100 65 95 80 95 110Z" fill="#74A87C" />
    <path d="M102 110C102 90 115 78 120 70C110 78 104 90 102 110Z" fill="#91C788" />

    {/* Yellow Polo Body */}
    <path d="M30 120C30 95 42 85 60 85C78 85 90 95 90 120" fill="#FFB703" />
    <path d="M54 85L60 96L66 85" fill="#F8F7F4" />

    {/* Thumbs up arm */}
    <path d="M35 110C28 100 24 88 30 76" stroke="#FFB703" strokeWidth="10" strokeLinecap="round" />
    <path d="M30 76C28 72 26 66 30 64C34 62 36 68 36 74" stroke="#FFDFC4" strokeWidth="6" strokeLinecap="round" />

    {/* Head */}
    <ellipse cx="60" cy="65" rx="16" ry="18" fill="#FFDFC4" />
    {/* Hair */}
    <path d="M44 60C44 48 52 40 60 40C68 40 76 48 76 60C73 57 68 58 64 54C61 58 57 56 53 58C50 54 45 58 44 60Z" fill="#2D4A3E" />
    {/* Eyes & Smile */}
    <circle cx="54" cy="64" r="2" fill="#2D4A3E" />
    <circle cx="66" cy="64" r="2" fill="#2D4A3E" />
    <path d="M56 71C58 74 62 74 64 71" stroke="#2D4A3E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Insight Face Profile with Blooming Flowers
export const InsightBloomingFace = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="65" cy="40" r="18" fill="#FFA500" opacity="0.9" />
    
    {/* Profile Face (Purple stylized silhouette) */}
    <path d="M20 115C20 90 35 85 45 80C50 78 52 72 48 68C44 64 42 55 45 45C48 35 60 30 65 30C68 30 75 35 75 42C75 48 70 54 68 58C66 62 68 66 74 68C80 70 82 78 80 85C76 95 65 105 60 115" fill="#8B78F6" />

    {/* Flowers Blooming from Head */}
    {/* Flower 1 (Orange) */}
    <circle cx="65" cy="24" r="5" fill="#FF874B" />
    <circle cx="65" cy="24" r="2" fill="#FFD886" />
    {/* Flower 2 (Lavender) */}
    <circle cx="50" cy="30" r="6" fill="#C98CEB" />
    <circle cx="50" cy="30" r="2.5" fill="#FFFFFF" />
    {/* Flower 3 (Green Leaves) */}
    <path d="M40 38C35 32 38 25 45 28C45 35 42 38 40 38Z" fill="#91C788" />
    <path d="M72 32C78 28 82 32 80 38C74 38 72 34 72 32Z" fill="#91C788" />
  </svg>
);

// Calm Mood Character (Purple hair, serene, flowers)
export const MoodCalm = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="25" r="8" fill="#FFA500" opacity="0.6" />
    <path d="M20 75C20 60 30 52 40 52C50 52 60 60 60 75" fill="#A78BFA" />
    <ellipse cx="40" cy="42" rx="12" ry="13" fill="#FFDFC4" />
    {/* Purple Long Hair */}
    <path d="M26 42C26 28 32 22 40 22C48 22 54 28 54 42C56 50 54 60 52 64C48 58 48 48 48 42C48 38 44 38 40 38C36 38 32 38 32 42C32 48 32 58 28 64C26 60 24 50 26 42Z" fill="#7C3AED" />
    {/* Flowers in hair */}
    <circle cx="32" cy="26" r="3" fill="#E5A0D3" />
    <circle cx="48" cy="28" r="3" fill="#FFD886" />
    {/* Closed peaceful eyes */}
    <path d="M34 42C36 44 38 44 39 42" stroke="#4C1D95" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M41 42C42 44 44 44 46 42" stroke="#4C1D95" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M38 47C39 49 41 49 42 47" stroke="#4C1D95" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Energetic Mood Character (Cheerful boy raising arms)
export const MoodEnergetic = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 75C20 58 28 50 40 50C52 50 60 58 60 75" fill="#FFB703" />
    {/* Raised Arms */}
    <path d="M24 60L16 42" stroke="#FFB703" strokeWidth="6" strokeLinecap="round" />
    <circle cx="15" cy="40" r="3" fill="#FFDFC4" />
    <path d="M56 60L64 42" stroke="#FFB703" strokeWidth="6" strokeLinecap="round" />
    <circle cx="65" cy="40" r="3" fill="#FFDFC4" />
    <ellipse cx="40" cy="40" rx="11" ry="12" fill="#FFDFC4" />
    {/* Hair */}
    <path d="M29 36C29 26 34 22 40 22C46 22 51 26 51 36C48 34 45 35 42 32C39 35 36 34 33 35C31 33 29 35 29 36Z" fill="#2D4A3E" />
    {/* Joyful eyes & Big Smile */}
    <circle cx="36" cy="38" r="1.5" fill="#2D4A3E" />
    <circle cx="44" cy="38" r="1.5" fill="#2D4A3E" />
    <path d="M36 43C38 47 42 47 44 43" stroke="#2D4A3E" strokeWidth="2" strokeLinecap="round" fill="#FF6B6B" />
  </svg>
);

// Anxious Mood Character (Worried girl with storm cloud)
export const MoodAnxious = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Scribble / Storm cloud above head */}
    <path d="M48 20C54 18 60 22 58 27C62 29 60 35 56 34C54 38 48 37 46 34C42 36 38 32 40 28C36 26 40 20 44 22C46 18 50 18 52 20" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    
    <path d="M20 75C20 62 28 54 40 54C52 54 60 62 60 75" fill="#1E293B" />
    {/* Hand biting / touching cheek */}
    <path d="M48 68C48 58 46 50 48 44" stroke="#FFDFC4" strokeWidth="4" strokeLinecap="round" />
    
    <ellipse cx="38" cy="42" rx="11" ry="12" fill="#FFDFC4" />
    {/* Dark Hair */}
    <path d="M27 42C27 28 32 24 38 24C44 24 49 28 49 42C49 52 46 60 44 64C41 58 41 50 41 44C41 40 38 40 35 40C32 40 31 40 31 44C31 50 31 58 28 64C27 60 27 50 27 42Z" fill="#0F172A" />
    {/* Worried Eyes */}
    <circle cx="34" cy="40" r="1.5" fill="#0F172A" />
    <circle cx="41" cy="40" r="1.5" fill="#0F172A" />
    <path d="M34 46C37 44 40 46 42 45" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Sad Mood Character (Looking down under raincloud)
export const MoodSad = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Raincloud */}
    <path d="M42 22C44 19 49 19 52 21C55 20 59 23 58 26C61 28 60 32 57 33C57 34 52 35 48 34C44 35 41 32 42 29C39 28 40 23 42 22Z" fill="#94A3B8" />
    {/* Raindrops */}
    <path d="M46 37L45 40" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M52 37L51 40" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M57 37L56 40" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

    <path d="M22 75C22 62 30 55 40 55C50 55 58 62 58 75" fill="#64748B" />
    <ellipse cx="38" cy="46" rx="10" ry="11" fill="#FFDFC4" />
    {/* Hair */}
    <path d="M28 42C28 32 33 28 38 28C43 28 48 32 48 42C46 40 43 41 40 38C38 41 35 40 33 41C31 39 28 41 28 42Z" fill="#1E293B" />
    {/* Sad eyes & Downturned mouth */}
    <circle cx="34" cy="44" r="1.5" fill="#1E293B" />
    <circle cx="41" cy="44" r="1.5" fill="#1E293B" />
    <path d="M35 50C37 48 40 48 42 50" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Decorative Leaves for corners
export const CornerLeaves = ({ position = "bottom-left", className = "w-36 h-36" }) => {
  if (position === "bottom-left") {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10 130C-10 70 30 40 50 20C40 55 25 90 -10 130Z" fill="#759353" opacity="0.7" />
        <path d="M-10 130C10 80 55 60 85 45C65 80 35 105 -10 130Z" fill="#8FA564" opacity="0.8" />
        <path d="M-10 130C30 95 80 90 110 85C80 110 40 120 -10 130Z" fill="#A1B974" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M130 130C130 70 90 40 70 20C80 55 95 90 130 130Z" fill="#759353" opacity="0.7" />
      <path d="M130 130C110 80 65 60 35 45C55 80 85 105 130 130Z" fill="#8FA564" opacity="0.8" />
      <path d="M130 130C90 95 40 90 10 85C40 110 80 120 130 130Z" fill="#A1B974" opacity="0.6" />
    </svg>
  );
};
