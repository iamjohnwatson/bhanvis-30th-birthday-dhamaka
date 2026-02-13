import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Music, Volume2, VolumeX, Ticket, Film, MapPin, PlayCircle, Sparkles, Star } from 'lucide-react';

/* 
  Data Configuration
*/
const BG_MUSIC_ID = "6SZKkEZmrLg"; // Tum Hi Ho Instrumental

const ACT_I_QUESTIONS = [
  {
    dialogue: "Rahul, naam toh suna hi hoga...",
    answer: "Dil To Pagal Hai",
    options: ["DDLJ", "Kuch Kuch Hota Hai", "Dil To Pagal Hai", "Mohabbatein"]
  },
  {
    dialogue: "Kuch kuch hota hai, tum nahi samjhoge.",
    answer: "Kuch Kuch Hota Hai",
    options: ["K3G", "Kuch Kuch Hota Hai", "Kal Ho Naa Ho", "Veer-Zaara"]
  },
  {
    dialogue: "Bade bade deshon mein aisi chhoti chhoti baatein...",
    answer: "DDLJ",
    options: ["Pardes", "DDLJ", "Dilwale", "Baazigar"]
  },
  {
    dialogue: "Main apni favorite hoon!",
    answer: "Jab We Met",
    options: ["Kabhi Alvida Naa Kehna", "Jab We Met", "Geeta Mera Naam", "Heroine"]
  },
  {
    dialogue: "Parampara. Pratishtha. Anushasan.",
    answer: "Mohabbatein",
    options: ["Paheli", "Baghban", "Mohabbatein", "Black"]
  }
];

const ACT_II_QUESTIONS = [
  {
    videoTitle: "Thudakkam Maangalyam (Bangalore Days)",
    videoId: "a3UNpjnYquI",
    localVideo: "scene1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1596727147705-54a9d0b0117e?q=80&w=2075&auto=format&fit=crop",
    answer: "Bangalore",
    options: ["Kochi", "Bangalore", "Chennai", "Hyderabad"]
  },
  {
    videoTitle: "Kaisa Hai Yeh Isq Hai (Mere Brother Ki Dulhan)",
    videoId: "pHu4PLhuKgQ",
    localVideo: "scene2.mp4",
    thumbnail: "https://images.unsplash.com/photo-1582556272658-963e1828cb00?q=80&w=1974&auto=format&fit=crop",
    answer: "Coorg",
    options: ["Manali", "Coorg", "Ooty", "Shimla"]
  },
  {
    videoTitle: "Mast Magan (2 States)",
    videoId: "xitd9mEZIHk",
    localVideo: "scene3.mp4",
    thumbnail: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop",
    answer: "Mahabalipuram",
    options: ["Mahabalipuram", "Kerala", "Goa", "Hampi"]
  },
  {
    videoTitle: "Ghungroo (War)",
    videoId: "qN4ooNx77u0",
    localVideo: "scene4.mp4",
    thumbnail: "https://images.unsplash.com/photo-1533923793740-4cafa68972e2?q=80&w=2070&auto=format&fit=crop",
    answer: "Amalfi Coast",
    options: ["Amalfi Coast", "French Riviera", "Ibiza", "Mykonos"]
  },
  {
    videoTitle: "Khaabon Ke Parindey (ZNMD)",
    videoId: "R0XjwtP_iTY",
    localVideo: "scene5.mp4",
    thumbnail: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop",
    answer: "Spain",
    options: ["Portugal", "Italy", "Spain", "France"]
  }
];



/*
  Framer Motion Variants
*/
const pageVariants = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.5, ease: "easeIn" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentAct, setCurrentAct] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shake, setShake] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  // Audio Fading Logic
  useEffect(() => {
    if (!audioRef.current) return;

    const fadeAudio = (targetVol, duration = 1000) => {
      const audio = audioRef.current;
      const stepTime = 50;
      const steps = duration / stepTime;
      const volStep = (targetVol - audio.volume) / steps;

      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        const newVol = audio.volume + volStep;

        // Clamp volume between 0 and 1
        if (newVol >= 0 && newVol <= 1) {
          audio.volume = newVol;
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          audio.volume = targetVol;
          if (targetVol === 0) {
            audio.pause();
            setIsPlaying(false);
          }
        }
      }, stepTime);
    };

    if (currentAct === 2) {
      if (isPlaying) fadeAudio(0, 1500);
    } else if (currentAct === 3) {
      audioRef.current.volume = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          fadeAudio(0.5, 1500);
        })
        .catch(e => console.log('Autoplay blocked', e));
    }
  }, [currentAct]);

  const handleStart = () => {
    setStarted(true);
    setCurrentAct(1);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log('Autoplay blocked', e));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswer = (selected, correct) => {
    if (selected === correct) {
      const nextProgress = progress + 1;
      setProgress(nextProgress);

      if (currentAct === 1) {
        if (currentQuestionIndex < ACT_I_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setCurrentAct(2);
          setCurrentQuestionIndex(0);
        }
      } else if (currentAct === 2) {
        if (currentQuestionIndex < ACT_II_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setCurrentAct(3);
        }
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleIntermissionDone = () => {
    setCurrentAct(4);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-montserrat relative overflow-hidden">
      {/* Desktop Backdrop */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute inset-0 bg-zinc-900/90 z-10 backdrop-blur-sm"></div>
        <img src="https://images.unsplash.com/photo-1596727147705-54a9d0b0117e?q=80&w=2075&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 animate-pulse-glow" />
      </div>

      <audio
        ref={audioRef}
        src="bg-music.mp3"
        loop
        onPlay={() => console.log("Audio started playing")}
        onPause={() => console.log("Audio paused")}
        onError={(e) => console.error("Audio load failed", e.currentTarget.error)}
      />

      {/* Main Container 9:16 */}
      <div className="relative w-full h-[100dvh] sm:h-[800px] sm:w-[450px] bg-zinc-950 sm:border-4 sm:border-bollywood-gold shadow-2xl overflow-hidden flex flex-col z-20">

        {/* Cinematic Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-bollywood-gold opacity-20"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
                animationDelay: `-${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Cinematic Grain/Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 mix-blend-overlay"></div>

        {/* Audio Controller */}
        {started && (
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full border border-bollywood-gold/30 bg-black/40 text-bollywood-gold flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${isPlaying ? 'animate-spin-slow shadow-[0_0_15px_rgba(212,175,55,0.3)]' : ''}`}
            >
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 relative z-20 flex flex-col overflow-y-auto hide-scrollbar">
          <AnimatePresence mode="wait">
            {!started && (
              <IntroScreen key="intro" onStart={handleStart} />
            )}

            {started && currentAct === 1 && (
              <Act1
                key={`act1-${currentQuestionIndex}`}
                data={ACT_I_QUESTIONS[currentQuestionIndex]}
                index={currentQuestionIndex}
                total={ACT_I_QUESTIONS.length}
                onAnswer={handleAnswer}
                shake={shake}
              />
            )}

            {started && currentAct === 2 && (
              <Act2
                key={`act2-${currentQuestionIndex}`}
                data={ACT_II_QUESTIONS[currentQuestionIndex]}
                index={currentQuestionIndex}
                total={ACT_II_QUESTIONS.length}
                onAnswer={handleAnswer}
                shake={shake}
              />
            )}

            {started && currentAct === 3 && (
              <Intermission key="intermission" onNext={handleIntermissionDone} />
            )}

            {started && currentAct === 4 && (
              <Finale key="finale" />
            )}

          </AnimatePresence>
        </div>

        {/* Cinematic Progress Bar */}
        {started && currentAct !== 4 && (
          <div className="h-16 bg-zinc-950 border-t border-bollywood-gold/20 flex items-center px-6 overflow-hidden shrink-0 relative z-30">
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-bollywood-gold via-yellow-200 to-bollywood-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / 10) * 100}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                <div className="absolute inset-0 animate-shimmer opacity-50 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
              </motion.div>
            </div>
            <div className="ml-4 text-bollywood-gold font-playfair text-lg italic w-12 text-center">
              {progress}/10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 
  Sub-Components
*/

function IntroScreen({ onStart }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
    >
      {/* Spotlight Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ruby-red/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_50%)] animate-pulse-glow pointer-events-none"></div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-16 relative z-10"
      >
        <h1 className="font-playfair text-5xl md:text-6xl gold-gradient-text mb-4 leading-[1.2] drop-shadow-2xl">
          Bhanvi's <br /> <span className="text-white text-4xl md:text-5xl">30th birthday dhamaka</span>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ delay: 1, duration: 1 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-bollywood-gold to-transparent mx-auto mt-6"
        ></motion.div>

        <p className="text-zinc-400 tracking-[0.5em] uppercase text-[10px] mt-6 font-bold">The Blockbuster Event</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="group relative px-12 py-6 bg-transparent text-white text-lg font-bold font-playfair tracking-widest uppercase"
      >
        <div className="absolute inset-0 border border-bollywood-gold/50 group-hover:border-bollywood-gold transition-colors duration-500"></div>
        <div className="absolute inset-[4px] border border-bollywood-gold/30 group-hover:border-bollywood-gold/60 transition-colors duration-500"></div>

        <span className="absolute inset-0 w-full h-full bg-ruby-red/10 group-hover:bg-ruby-red/20 transition-colors duration-500"></span>

        <span className="relative flex items-center gap-3 z-10 group-hover:text-glow transition-all">
          START MOVIE <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </span>
      </motion.button>
    </motion.div>
  );
}

function Act1({ data, onAnswer, shake, index, total }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="min-h-full flex flex-col p-8 pt-24 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-ruby-red/10 to-transparent pointer-events-none"></div>

      <div className="mb-8 flex items-end justify-between border-b border-bollywood-gold/20 pb-4 relative z-10 shrink-0">
        <Sparkles className="text-bollywood-gold opacity-50 absolute -top-4 -left-2" size={20} />
        <div>
          <p className="text-bollywood-gold/60 text-[10px] tracking-[0.3em] font-bold uppercase mb-1">Act I • The Prequel</p>
          <h3 className="text-white font-playfair text-xl italic">Scene {index + 1}</h3>
        </div>
        <div className="text-4xl font-playfair text-zinc-800 font-bold opacity-20 absolute right-0 -bottom-2">{index + 1}</div>
      </div>

      <div className="flex-1 flex items-center justify-center mb-12 shrink-0">
        <h2 className="text-3xl font-playfair text-white leading-snug text-center drop-shadow-lg">
          "<span className="gold-gradient-text text-glow">{data.dialogue}</span>"
        </h2>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden" animate="show"
        className="space-y-4 mb-8 shrink-0"
      >
        {data.options.map((opt) => (
          <motion.button
            variants={slideUp}
            key={opt}
            onClick={() => onAnswer(opt, data.answer)}
            className="w-full relative overflow-hidden text-left p-5 bg-zinc-900/50 border border-zinc-700/50 hover:border-bollywood-gold/60 hover:bg-zinc-800/80 transition-all font-montserrat font-medium flex items-center group backdrop-blur-sm"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-bollywood-gold transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

            <span className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center mr-5 text-[10px] group-hover:border-bollywood-gold opacity-50 font-playfair">
              <div className="w-full h-full rounded-full bg-bollywood-gold/10 transform scale-0 group-hover:scale-100 transition-transform"></div>
            </span>
            <span className="text-zinc-300 group-hover:text-white group-hover:tracking-wide transition-all duration-300">{opt}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Act2({ data, onAnswer, shake, index, total }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="min-h-full flex flex-col p-8 pt-20"
    >
      <div className="mb-6 text-center relative z-10 shrink-0">
        <p className="text-bollywood-gold/60 text-[10px] tracking-[0.3em] font-bold uppercase mb-2">Act II • Travel Montage</p>
        <div className="w-12 h-[1px] bg-bollywood-gold/30 mx-auto"></div>
      </div>

      {/* Cinema Frame */}
      <div className="w-full aspect-video max-h-[40vh] bg-black relative shadow-2xl group mx-auto mb-8 perspective-1000 shrink-0">
        <div className="absolute -inset-[2px] bg-gradient-to-b from-bollywood-gold/30 to-transparent rounded-sm opacity-50"></div>
        <div className="absolute inset-0 border-[10px] border-zinc-900 shadow-[inset_0_0_20px_rgba(0,0,0,1)] z-10 pointer-events-none"></div>

        {/* Toggle between Local Video and YouTube */}
        <video
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          src={data.localVideo}
          autoPlay
          loop
          muted={false}
          playsInline
          onError={(e) => {
            // Fallback logic if local video fails
            e.target.style.display = 'none';
            // Show iframe (next sibling)
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
          }}
        />
        <iframe
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity hidden"
          src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${data.videoId}`}
          title={data.videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="text-bollywood-gold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-ruby-red rounded-full animate-pulse"></div> Now Playing
          </div>
          <div className="text-white font-playfair text-lg truncate max-w-[80%] mx-auto">{data.videoTitle}</div>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden" animate="show"
        className="grid grid-cols-2 gap-3 mt-auto mb-4 shrink-0"
      >
        {data.options.map((opt) => (
          <motion.button
            variants={slideUp}
            key={opt}
            onClick={() => onAnswer(opt, data.answer)}
            className="h-20 flex flex-col items-center justify-center text-center p-2 rounded bg-zinc-900/40 border border-zinc-800 hover:border-bollywood-gold/50 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all active:scale-95 group relative overflow-hidden backdrop-blur-md"
          >
            <MapPin className="mb-2 text-zinc-600 group-hover:text-bollywood-gold transition-colors duration-300" size={14} />
            <span className="font-montserrat font-semibold text-xs text-zinc-400 group-hover:text-white transition-colors">{opt}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Intermission({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 5000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center p-8 bg-[#F4C430] text-ruby-red relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000000_3px)] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000000_120%)] opacity-20 pointer-events-none"></div>

      <div className="border-y-8 border-double border-ruby-red py-12 w-full text-center relative z-10 transform -rotate-2">
        <h1 className="font-playfair text-6xl font-black tracking-tighter mb-4 animate-[pulse_3s_infinite]">
          INTERMISSION
        </h1>
        <p className="font-montserrat font-bold text-sm uppercase tracking-[0.5em] text-black">
          Grab some popcorn
        </p>
      </div>

      <div className="absolute bottom-24 px-8 text-center" style={{ transform: "translateZ(0)" }}>
        <p className="font-playfair font-bold text-2xl leading-relaxed text-black/80 italic drop-shadow-sm">
          "The Plot Twist...<br />Every great Bollywood movie ends with a grand reunion."
        </p>
      </div>
    </motion.div>
  );
}

function Finale() {
  const [revealed, setRevealed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleSwipe = () => {
    setRevealed(true);
    fireConfetti();
  };

  const fireConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 80 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#9B111E', '#FFD700'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#9B111E', '#FFF'] });
    }, 200);
  };

  return (
    <div className="h-full w-full relative bg-zinc-950 overflow-hidden">
      {/* Video Overlay */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black flex items-center justify-center p-4"
          >
            <video
              src="finale.mp4"
              className="w-full h-full object-contain max-h-[80vh] border-2 border-bollywood-gold rounded-lg shadow-[0_0_50px_rgba(212,175,55,0.3)]"
              controls
              autoPlay
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white hover:text-bollywood-gold"
            >
              <VolumeX size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curtain Layer */}
      <motion.div
        className="absolute inset-0 z-40 flex"
        animate={revealed ? { opacity: 0, pointerEvents: 'none' } : {}}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <motion.div
          className="w-1/2 h-full bg-ruby-red relative flex items-center justify-end border-r-4 border-black/20"
          animate={revealed ? { x: '-100%' } : { x: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"></div>
          <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#00000010_50px)]"></div>
          <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black/80 to-transparent"></div>
        </motion.div>

        <motion.div
          className="w-1/2 h-full bg-ruby-red relative border-l-4 border-black/20"
          animate={revealed ? { x: '100%' } : { x: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/30"></div>
          <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#00000010_50px)]"></div>
          <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black/80 to-transparent"></div>
        </motion.div>

        {/* Swipe Prompt */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-[20%] left-0 right-0 text-center z-50 flex flex-col items-center cursor-grab active:cursor-grabbing"
              drag="y"
              dragConstraints={{ top: -300, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y < -100) handleSwipe();
              }}
            >
              <div className="flex flex-col items-center gap-4 text-bollywood-gold animate-float">
                <span className="uppercase font-bold tracking-[0.3em] text-[10px] drop-shadow-md bg-black/60 px-4 py-2 rounded-full border border-bollywood-gold/30 backdrop-blur-sm">Swipe Up For The Reveal</span>
                <div className="w-[1px] h-20 bg-gradient-to-t from-bollywood-gold to-transparent"></div>
                <div className="w-2 h-2 rounded-full bg-bollywood-gold animate-ping"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Message Layer */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">

        <motion.div
          initial={{ scale: 0 }}
          animate={revealed ? { scale: 1.5, rotate: 180 } : {}}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(212,175,55,0.3)_0%,transparent_70%)]"></div>
        </motion.div>

        <motion.h1
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={revealed ? { scale: 1, opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, type: "spring", bounce: 0.5 }}
          className="text-5xl font-playfair gold-gradient-text mb-8 leading-tight drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]"
        >
          DHAMAKEDAAR <br /> ENTRY!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ delay: 2, staggerChildren: 0.8 }}
          className="space-y-8 relative z-10"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }} animate={revealed ? { x: 0, opacity: 1 } : {}}
            className="flex items-center gap-4 justify-center"
          >
            <div className="h-[1px] w-12 bg-zinc-700"></div>
            <p className="text-xl text-zinc-300 font-montserrat tracking-widest uppercase text-[12px]">Put down your phone</p>
            <div className="h-[1px] w-12 bg-zinc-700"></div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }} animate={revealed ? { x: 0, opacity: 1 } : {}}
          >
            <p className="text-2xl text-white font-playfair italic">Walk to the front door.</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={revealed ? { scale: 1.2, opacity: 1 } : {}} transition={{ delay: 4, type: 'spring' }}
            className="pt-8 flex flex-col gap-6 items-center"
          >
            <button className="text-2xl bg-ruby-red text-white font-bold font-montserrat uppercase px-8 py-4 clip-path-ticket shadow-[0_0_50px_rgba(155,17,30,0.6)] animate-pulse-glow">
              Open it NOW
            </button>

            <button
              onClick={() => setShowVideo(true)}
              className="text-sm text-bollywood-gold font-playfair italic border-b border-bollywood-gold/50 pb-1 hover:text-white hover:border-white transition-colors"
            >
              Wait! Play the Birthday Video &rarr;
            </button>
          </motion.div>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ delay: 5, duration: 2 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <div className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] space-y-3 font-bold">
            <p>Directed by <span className="text-zinc-400">Akash Sriram</span></p>
            <p className="text-[9px]">Starring <span className="text-bollywood-gold">Bhanvi Satija</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
