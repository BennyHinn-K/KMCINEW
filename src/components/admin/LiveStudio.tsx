import React, { useRef, useState, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Monitor, Radio } from 'lucide-react';

interface LiveStudioProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const LiveStudio: React.FC<LiveStudioProps> = ({ onNotify }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [meetLink, setMeetLink] = useState('');

  useEffect(() => {
    // Automatically attach stream to video element when stream state updates and component re-renders
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      // Ref assignment moved to useEffect to ensure DOM is ready
      onNotify("Camera and Microphone connected successfully", "success");
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        onNotify("Access denied. Please click the lock icon in your address bar to allow camera access.", "error");
      } else {
        const message = err instanceof Error ? err.message : "Unknown error";
        onNotify("Failed to access camera: " + message, "error");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setIsLive(false);
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleGoLive = () => {
    if (!stream) {
      onNotify("Please start the camera before going live.", "error");
      return;
    }
    setIsLive(!isLive);
    onNotify(isLive ? "Broadcast ended." : "You are now LIVE!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center border border-slate-800">
            {stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`} 
              />
            ) : (
              <div className="text-center text-slate-500">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Camera Offline</p>
              </div>
            )}

            {!isVideoEnabled && stream && (
               <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Video Paused</p>
                  </div>
               </div>
            )}
            
            {isLive && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center shadow-lg z-10">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                LIVE ON AIR
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-2">
              {!stream ? (
                <button 
                  onClick={startCamera}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center"
                >
                  <Camera className="w-4 h-4 mr-2" /> Start Camera
                </button>
              ) : (
                <button 
                  onClick={stopCamera}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 flex items-center"
                >
                  <VideoOff className="w-4 h-4 mr-2" /> Stop Camera
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={toggleVideo} 
                disabled={!stream}
                className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'} disabled:opacity-50`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleAudio}
                disabled={!stream}
                className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'} disabled:opacity-50`}
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleGoLive}
              disabled={!stream}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all shadow-md flex items-center ${
                isLive 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
              }`}
            >
              {isLive ? 'End Broadcast' : 'Go Live Now'}
            </button>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-amber-500" />
              Google Meet Integration
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Embed a Google Meet session for interactive bible study or meetings.
            </p>
            <input 
              type="text" 
              placeholder="Paste Google Meet Link" 
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {meetLink && (
               <a 
                 href={meetLink} 
                 target="_blank" 
                 rel="noreferrer"
                 className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
               >
                 Launch Meeting
               </a>
            )}
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
              <strong>Tip:</strong> Use Google Meet for interactive sessions where you need to see the congregation.
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-red-500" />
              Stream Health
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Bitrate</span>
                  <span className="font-mono font-bold">4500 kbps</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">FPS</span>
                  <span className="font-mono font-bold">60</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStudio;
