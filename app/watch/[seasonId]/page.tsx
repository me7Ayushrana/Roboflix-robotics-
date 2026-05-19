"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize, 
  ChevronRight, Lock, Eye, MonitorPlay, ChevronDown, Check, Settings
} from "lucide-react";
import RoboflixNavbar from "@/components/RoboflixNavbar";
import RoboflixFooter from "@/components/RoboflixFooter";
import { SEASONS_DATA, Season, Episode } from "@/lib/roboflix-data";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  
  // Resolve starting season from params
  const seasonId = (params?.seasonId as string) || "s1";
  
  const initialSeason = useMemo(() => {
    return SEASONS_DATA.find((s) => s.id === seasonId) || SEASONS_DATA[0];
  }, [seasonId]);

  // States
  const [activeSeason, setActiveSeason] = useState<Season>(initialSeason);
  const [activeEpisode, setActiveEpisode] = useState<Episode>(initialSeason.episodes[0]);

  const isYoutubeEpisode = activeEpisode.id === "s1e1" || activeEpisode.id === "s1e2";

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<string>("Auto");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isPiPActive, setIsPiPActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState<boolean>(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState<boolean>(false);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  
  // Bunny Stream/fallback URL
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [ytPlayerInstance, setYtPlayerInstance] = useState<any>(null);

  // Load YouTube Player API and initialize
  useEffect(() => {
    if (!isYoutubeEpisode || !hasStartedPlaying) {
      setYtPlayerInstance(null);
      return;
    }

    const initYtPlayer = () => {
      if (!document.getElementById("youtube-iframe")) return;
      
      try {
        const player = new (window as any).YT.Player("youtube-iframe", {
          events: {
            onReady: (event: any) => {
              setYtPlayerInstance(event.target);
              setDuration(event.target.getDuration() || 1320); // 22 min fallback
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                handleNextEpisode();
              }
            }
          }
        });
      } catch (err) {
        console.error("YT Player init error:", err);
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      (window as any).onYouTubeIframeAPIReady = () => {
        initYtPlayer();
      };
    } else {
      if ((window as any).YT.Player) {
        initYtPlayer();
      } else {
        const checkReady = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkReady);
            initYtPlayer();
          }
        }, 100);
      }
    }
  }, [activeEpisode, hasStartedPlaying]);

  // Sync YouTube player time and duration dynamically
  useEffect(() => {
    if (!isYoutubeEpisode || !ytPlayerInstance || !isPlaying || isScrubbing) return;

    const interval = setInterval(() => {
      if (ytPlayerInstance && !isScrubbing) {
        if (ytPlayerInstance.getCurrentTime) {
          setCurrentTime(ytPlayerInstance.getCurrentTime());
        }
        if (ytPlayerInstance.getDuration) {
          const d = ytPlayerInstance.getDuration();
          if (d > 0) {
            setDuration(d);
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [ytPlayerInstance, isPlaying, activeEpisode, isScrubbing]);

  // Refs for custom video tag and container
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync state if initialSeason changes
  useEffect(() => {
    setActiveSeason(initialSeason);
    setActiveEpisode(initialSeason.episodes[0]);
    setIsPlaying(false);
    setStreamUrl("");
  }, [initialSeason]);

  // Request signed video stream token on play trigger
  const handlePlayStart = async () => {
    setIsPlaying(true);
    setHasStartedPlaying(true);

    if (isYoutubeEpisode) {
      setIsLoadingToken(false);
      return;
    }

    setIsLoadingToken(true);

    try {
      const res = await fetch("/api/video/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId: activeEpisode.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.streamUrl) {
          setStreamUrl(data.streamUrl);
        } else {
          // Graceful fallback to test HLS stream
          setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
        }
      } else {
        // Fallback if not authenticated or environment not set
        setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
      }
    } catch (err) {
      setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
    } finally {
      setIsLoadingToken(false);
    }
  };

  // HTML5/HLS Player Actions
  const togglePlayPause = () => {
    if (isYoutubeEpisode) {
      if (ytPlayerInstance) {
        if (isPlaying) {
          ytPlayerInstance.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerInstance.playVideo();
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(true);
      }
      return;
    }
    if (!isPlaying) {
      handlePlayStart();
    } else {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
    }
  };

  const seekBackward = () => {
    if (isYoutubeEpisode && ytPlayerInstance) {
      const newTime = Math.max(0, ytPlayerInstance.getCurrentTime() - 10);
      ytPlayerInstance.seekTo(newTime, true);
      setCurrentTime(newTime);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const seekForward = () => {
    if (isYoutubeEpisode && ytPlayerInstance) {
      const newTime = Math.min(duration, ytPlayerInstance.getCurrentTime() + 10);
      ytPlayerInstance.seekTo(newTime, true);
      setCurrentTime(newTime);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isYoutubeEpisode && ytPlayerInstance) {
      ytPlayerInstance.setPlaybackRate(speed);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedDropdown(false);
  };

  const handleQualityChange = (q: string) => {
    setQuality(q);
    setShowQualityDropdown(false);
    
    if (isYoutubeEpisode && ytPlayerInstance) {
      const qualityMap: { [key: string]: string } = {
        "Auto": "default",
        "1080p": "hd1080",
        "720p": "hd720",
        "480p": "large",
        "360p": "medium"
      };
      if (ytPlayerInstance.setPlaybackQuality) {
        ytPlayerInstance.setPlaybackQuality(qualityMap[q] || "default");
      }
    }
  };

  const toggleMute = () => {
    if (isYoutubeEpisode && ytPlayerInstance) {
      if (isMuted) {
        ytPlayerInstance.unMute();
      } else {
        ytPlayerInstance.mute();
      }
      setIsMuted(!isMuted);
      return;
    }
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setIsPiPActive(false);
        } else {
          await videoRef.current.requestPictureInPicture();
          setIsPiPActive(true);
        }
      } catch (err) {
        console.error("PiP error:", err);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Monitor Fullscreen Changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys if typing in inputs
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          seekForward();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isMuted, duration]);

  // Video Time/Duration Updates
  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    handleNextEpisode();
  };

  // Format time (seconds -> mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Automatically play the new episode if already in playing state
  useEffect(() => {
    if (!isPlaying) return;

    setCurrentTime(0);
    setStreamUrl("");

    if (isYoutubeEpisode) {
      setIsLoadingToken(false);
      return;
    }

    setIsLoadingToken(true);
    fetch("/api/video/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ episodeId: activeEpisode.id })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.streamUrl) {
            setStreamUrl(data.streamUrl);
          } else {
            setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
          }
        } else {
          setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
        }
      })
      .catch(() => {
        setStreamUrl("https://test-streams.mux.dev/x36xhq/x36xhq.m3u8");
      })
      .finally(() => {
        setIsLoadingToken(false);
      });
  }, [activeEpisode]);

  // Load next episode logic
  const handleNextEpisode = () => {
    const currentIndex = activeSeason.episodes.findIndex((e) => e.id === activeEpisode.id);
    if (currentIndex < activeSeason.episodes.length - 1) {
      // Load next episode in same season
      const nextEp = activeSeason.episodes[currentIndex + 1];
      setActiveEpisode(nextEp);
      setIsPlaying(true);
      setHasStartedPlaying(true);
    } else {
      // Load first episode of next season if available
      const nextSeasonIndex = SEASONS_DATA.findIndex((s) => s.id === activeSeason.id) + 1;
      if (nextSeasonIndex < SEASONS_DATA.length) {
        const nextSeason = SEASONS_DATA[nextSeasonIndex];
        setActiveSeason(nextSeason);
        setActiveEpisode(nextSeason.episodes[0]);
        setIsPlaying(true);
        setHasStartedPlaying(true);
        router.push(`/watch/${nextSeason.id}`, { scroll: false });
      }
    }
  };

  // Handle switching season tabs in sidebar
  const handleSeasonTabClick = (season: Season) => {
    setActiveSeason(season);
    setActiveEpisode(season.episodes[0]);
    setIsPlaying(true);
    setHasStartedPlaying(true);
    router.push(`/watch/${season.id}`, { scroll: false });
  };

  // Handle clicking an episode from the list
  const handleEpisodeItemClick = (episode: Episode) => {
    setActiveEpisode(episode);
    setIsPlaying(true);
    setHasStartedPlaying(true);
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ["Auto", "1080p", "720p", "480p", "360p"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-premium-grid bg-radial-glow text-white flex flex-col font-inter relative overflow-hidden">
      {/* Roboflix Nav */}
      <RoboflixNavbar />

      {/* Breadcrumb Bar */}
      <div className="w-full bg-[#0d0d0d] border-b border-brand-border py-3 px-6 md:px-12 flex items-center justify-between text-xs font-mono text-gray-500 uppercase select-none relative z-10">
        <div className="flex items-center gap-2">
          <Link href="/browse" className="hover:text-brand-red transition-colors">BROWSE</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300">SEASON {activeSeason.seasonNumber}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-red line-clamp-1">{activeEpisode.title}</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
          </span>
          <span className="text-[9px] text-gray-500 tracking-wider">HLS PLAYER ONLINE</span>
        </div>
      </div>

      {/* Two Column Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 relative z-10">
        
        {/* LEFT COLUMN: Player + Info */}
        <div className="flex flex-col gap-6">
          
          {/* Video Player Container */}
          <div 
            ref={playerContainerRef}
            className="relative w-full aspect-[16/9] bg-black border border-brand-border rounded-lg overflow-hidden group select-none flex flex-col justify-end"
          >
            {/* 1. Persistent Video Player Frame */}
            {hasStartedPlaying && (
              <div className="absolute inset-0 w-full h-full bg-black flex flex-col justify-between">
                {isYoutubeEpisode ? (
                  <div className="relative w-full h-full overflow-hidden">
                    {/* The cropped iframe shifted to crop YouTube title and controls */}
                    <div className="absolute inset-0 w-full h-[calc(100%+120px)] -top-[60px] pointer-events-none">
                      <iframe
                        id="youtube-iframe"
                        src={
                          activeEpisode.id === "s1e1"
                            ? "https://www.youtube.com/embed/RuDsBrSczis?enablejsapi=1&autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0"
                            : "https://www.youtube.com/embed/T5rmd-vKQeM?enablejsapi=1&autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0"
                        }
                        title={activeEpisode.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      />
                    </div>
                    
                    {/* Click-to-toggle overlay over the entire player */}
                    <div 
                      className="absolute inset-0 z-20 cursor-pointer"
                      onClick={togglePlayPause}
                    />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={streamUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleVideoEnded}
                    onClick={togglePlayPause}
                  />
                )}
              </div>
            )}

            {/* 2. Loading State Overlay */}
            {isLoadingToken && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4 z-20">
                <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-brand-red animate-spin" />
                <span className="font-mono text-xs text-gray-500">Securing HLS stream token...</span>
              </div>
            )}

            {/* 3. Pre-play Cover Overlay */}
            {!hasStartedPlaying && (
              <div 
                onClick={handlePlayStart}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gradient-to-b from-[#111]/30 via-black/80 to-black hover:opacity-95 transition-all duration-300 z-20 animate-fade-in"
              >
                {/* Custom Red Border Play Button Circle */}
                <div className="w-20 h-20 rounded-full border-4 border-brand-red flex items-center justify-center bg-black/60 shadow-[0_0_30px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform duration-300">
                  <Play className="w-8 h-8 fill-brand-red text-brand-red ml-1.5" />
                </div>
                <div className="flex flex-col gap-1 items-center mt-5 text-center px-4">
                  <span className="font-bebas text-2xl tracking-wide text-white">
                    PLAY EPISODE {activeEpisode.episodeNumber}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    {activeEpisode.title} ({activeEpisode.duration})
                  </span>
                </div>
              </div>
            )}

            {/* Custom Control Bar (Below / Overlaid at bottom on hover) */}
            {hasStartedPlaying && !isLoadingToken && (
              <>
                {/* Progress bar overlay on hover */}
                <div className="absolute bottom-[44px] left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onMouseDown={() => setIsScrubbing(true)}
                    onTouchStart={() => setIsScrubbing(true)}
                    onChange={(e) => {
                      setCurrentTime(parseFloat(e.target.value));
                    }}
                    onMouseUp={(e) => {
                      setIsScrubbing(false);
                      const val = parseFloat((e.target as HTMLInputElement).value);
                      if (isYoutubeEpisode && ytPlayerInstance) {
                        ytPlayerInstance.seekTo(val, true);
                      } else if (videoRef.current) {
                        videoRef.current.currentTime = val;
                      }
                    }}
                    onTouchEnd={(e) => {
                      setIsScrubbing(false);
                      const val = parseFloat((e.target as HTMLInputElement).value);
                      if (isYoutubeEpisode && ytPlayerInstance) {
                        ytPlayerInstance.seekTo(val, true);
                      } else if (videoRef.current) {
                        videoRef.current.currentTime = val;
                      }
                    }}
                    style={{
                      background: `linear-gradient(to right, #E50914 0%, #E50914 ${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%, #4b5563 ${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%, #4b5563 100%)`
                    }}
                    className="w-full accent-brand-red h-1.5 rounded cursor-pointer outline-none transition-all duration-150"
                  />
                </div>

                <div className="h-11 w-full bg-black/90 border-t border-brand-border flex items-center justify-between px-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Left Side: Playback buttons */}
                <div className="flex items-center gap-4">
                  {/* Seek -10s */}
                  <button onClick={seekBackward} className="text-gray-400 hover:text-brand-red transition-colors focus:outline-none cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Play/Pause */}
                  <button onClick={togglePlayPause} className="text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
                    {!isPlaying ? <Play className="w-4 h-4 fill-gray-400" /> : <Pause className="w-4 h-4 fill-gray-400" />}
                  </button>

                  {/* Seek +10s */}
                  <button onClick={seekForward} className="text-gray-400 hover:text-brand-red transition-colors focus:outline-none cursor-pointer">
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume Control */}
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4 text-brand-red" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Duration tracker */}
                  <div className="font-mono text-[10px] text-gray-500">
                    {formatTime(currentTime)} <span className="mx-1">/</span> {formatTime(duration)}
                  </div>
                </div>

                {/* Right Side: Options & Actions */}
                <div className="flex items-center gap-4 relative">
                  
                  {/* Playback Speed dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowSpeedDropdown(!showSpeedDropdown);
                        setShowQualityDropdown(false);
                      }}
                      className="flex items-center gap-1 font-mono text-[10px] text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                    >
                      ⚡ {playbackSpeed}x <ChevronDown className="w-3 h-3" />
                    </button>
                    {showSpeedDropdown && (
                      <div className="absolute bottom-8 right-0 bg-brand-card border border-brand-border rounded p-1 flex flex-col gap-1 w-24 z-40 shadow-2xl">
                        {speeds.map((sp) => (
                          <button
                            key={sp}
                            onClick={() => handleSpeedChange(sp)}
                            className="flex items-center justify-between px-2 py-1 text-left font-mono text-[10px] text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                          >
                            <span>{sp}x</span>
                            {playbackSpeed === sp && <Check className="w-3 h-3 text-brand-red" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quality Settings dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowQualityDropdown(!showQualityDropdown);
                        setShowSpeedDropdown(false);
                      }}
                      className="flex items-center gap-1 font-mono text-[10px] text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                    >
                      📺 {quality} <ChevronDown className="w-3 h-3" />
                    </button>
                    {showQualityDropdown && (
                      <div className="absolute bottom-8 right-0 bg-brand-card border border-brand-border rounded p-1 flex flex-col gap-1 w-24 z-40 shadow-2xl">
                        {qualities.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className="flex items-center justify-between px-2 py-1 text-left font-mono text-[10px] text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                          >
                            <span>{q}</span>
                            {quality === q && <Check className="w-3 h-3 text-brand-red" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PiP */}
                  {!isYoutubeEpisode && (
                    <button onClick={togglePiP} className="text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer" title="Picture in Picture">
                      <span className="font-mono text-[10px] font-bold">⧉</span>
                    </button>
                  )}

                  {/* Fullscreen toggle */}
                  <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
          </div>

          {/* Episode Metadata Section */}
          <div className="flex flex-col gap-4 border-b border-brand-border pb-6">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-bold text-brand-red uppercase tracking-wider">
                // SEASON {activeSeason.seasonNumber} · {activeSeason.title}
              </span>
              <h2 className="font-bebas text-4xl tracking-wide text-white uppercase">
                EP {activeEpisode.episodeNumber} — {activeEpisode.title}
              </h2>
              
              {/* Meta Row info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                <span className="font-mono text-xs text-gray-400">
                  🕒 {activeEpisode.duration}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                <span className="font-mono text-xs text-gray-400">
                  📅 {activeEpisode.publishDate}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                <span className="font-mono text-xs text-gray-400">
                  ⭐️ {activeEpisode.rating}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                  activeEpisode.difficulty === "BEGINNER" 
                    ? "bg-green-950/80 text-green-400 border border-green-800"
                    : activeEpisode.difficulty === "INTERMEDIATE"
                    ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                    : "bg-red-950/80 text-red-400 border border-red-800"
                }`}>
                  {activeEpisode.difficulty}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <p className="font-inter text-sm text-gray-400 leading-relaxed max-w-4xl">
              {activeEpisode.description}
            </p>

            {/* Technology tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {activeEpisode.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded bg-[#111] border border-brand-border font-mono text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Next Episode Bar */}
          <button
            onClick={handleNextEpisode}
            className="w-full p-4 rounded-lg bg-brand-card hover:bg-[#181818] border border-brand-border hover:border-brand-red/40 flex items-center justify-between text-left transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-[#1a1a1a] flex items-center justify-center text-white border border-brand-border group-hover:scale-105 transition-transform">
                <MonitorPlay className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block font-bold">
                  NEXT LESSON
                </span>
                <span className="font-bebas text-lg tracking-wide text-white group-hover:text-brand-red transition-colors">
                  AUTOPLAY NEXT EPISODE →
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>

        </div>

        {/* RIGHT COLUMN: Episodes Sidebar (Sticky & Scrollable) */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          {/* Season Header */}
          <div className="flex flex-col gap-1 border-b border-brand-border pb-4">
            <h3 className="font-bebas text-2xl tracking-wide text-white uppercase line-clamp-1">
              SEASON {activeSeason.seasonNumber} — {activeSeason.title}
            </h3>
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-wider font-bold">
              {activeSeason.episodes.length} EPISODES UNLOCKED
            </span>
          </div>

          {/* Season Tab Swapper (S1 / S2 / S3 / S4 / S5) */}
          <div className="grid grid-cols-5 gap-1 bg-[#111] p-1 rounded border border-brand-border">
            {SEASONS_DATA.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonTabClick(season)}
                className={`py-1.5 text-center font-bebas text-sm rounded tracking-wider transition-all cursor-pointer ${
                  activeSeason.id === season.id
                    ? "bg-brand-red text-white shadow"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                S{season.seasonNumber}
              </button>
            ))}
          </div>

          {/* Episode List Scrollarea */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1">
            {activeSeason.episodes.map((ep) => {
              const isPlayingItem = activeEpisode.id === ep.id && activeSeason.id === seasonId;
              
              return (
                <div
                  key={ep.id}
                  onClick={() => handleEpisodeItemClick(ep)}
                  className={`w-full p-3 rounded bg-brand-card border border-brand-border flex items-center justify-between gap-4 cursor-pointer hover:border-brand-red/30 transition-all ${
                    isPlayingItem 
                      ? "border-l-4 border-l-brand-red border border-brand-border bg-[#181818]" 
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ep Number or Active visual */}
                    <div className={`font-mono text-xs font-bold min-w-4 text-center ${
                      isPlayingItem ? "text-brand-red" : "text-gray-500"
                    }`}>
                      {ep.episodeNumber.toString().padStart(2, "0")}
                    </div>
                    
                    {/* Emoji Thumbnail placeholder */}
                    <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center border border-brand-border select-none flex-shrink-0">
                      <span className="text-lg">{ep.thumbnailEmoji}</span>
                    </div>

                    {/* Title + Duration */}
                    <div className="flex flex-col min-w-0">
                      <span className={`font-inter text-xs font-semibold truncate ${
                        isPlayingItem ? "text-brand-red font-bold" : "text-gray-200"
                      }`}>
                        {ep.title}
                      </span>
                      <span className="font-mono text-[9px] text-gray-500 uppercase">
                        {ep.duration}
                      </span>
                    </div>
                  </div>

                  {/* Free vs Locked Tag */}
                  <div>
                    {ep.isFree ? (
                      <span className="px-1.5 py-0.5 rounded-sm bg-green-950/70 border border-green-800 text-[8px] font-bold text-green-400 font-mono">
                        FREE
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </aside>

      </main>

      {/* Roboflix Footer */}
      <RoboflixFooter />
    </div>
  );
}
