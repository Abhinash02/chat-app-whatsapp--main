"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import {
  Menu,
  X,
  Mic,
  Paperclip,
  Smile,
  Phone,
  Video,
  ArrowLeft,
  Users,
  MessageSquare,
  PhoneOff,
  PhoneForwarded,
  PhoneOutgoing,
  PhoneIncoming,
  Play,
  Pause,
} from "lucide-react";

// const API_URL = "http://localhost:5000";
const API_URL = "chat-app-whatsapp-main-git-main-abhinashs-projects-cc3dac45.vercel.app";

// Call Server Configuration 
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// 📞 Call UI Components 
const IncomingCallModal = ({ call, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <img
          src={`${API_URL}/default-avatar.png`}
          className="w-24 h-24 rounded-full border-4 border-green-500"
          alt="caller"
        />
        <h2 className="text-2xl font-bold">{call.from} is calling...</h2>
        <p className="text-lg text-gray-600 capitalize">{call.type} Call</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onReject}
            className="px-6 py-3 bg-red-600 text-white rounded-full font-bold flex items-center gap-2"
          >
            <PhoneOff /> Reject
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-3 bg-green-600 text-white rounded-full font-bold flex items-center gap-2"
          >
            <Phone /> Accept
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated CallScreen to show video streams
const CallScreen = ({
  call,
  callAccepted,
  onEndCall,
  localVideoRef,
  remoteVideoRef,
}) => {
  const recipient = call.to || call.from;
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[90]">
      {/* Remote Video (Full Screen) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/*  Video Small Picture-in-Picture */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-4 right-4 w-48 h-64 object-cover rounded-lg shadow-lg border-2 border-white"
      />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <h1 className="text-4xl font-bold text-white mt-8 drop-shadow-lg">
          {recipient}
        </h1>
        <p className="text-xl text-green-300 mt-2 drop-shadow-lg">
          {callAccepted ? "Connected" : "Ringing..."}
        </p>

        <button
          onClick={onEndCall}
          className="mt-10 px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg flex items-center gap-2"
        >
          <PhoneOff /> End Call
        </button>
      </div>
    </div>
  );
};

// --- 🖼️ Status UI Components ---
const StatusViewer = ({ userStatus, onClose, onNext, onPrev }) => {
  if (!userStatus) return null;

  const { username, profileImage, statuses } = userStatus.user;
  const currentStatus = statuses[userStatus.index];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex flex-col items-center justify-center">
       <button onClick={onClose} className="absolute top-4 right-4 z-50">
        <X className="w-10 h-10 text-white" />
      </button>
      <div className="absolute top-4 left-4 flex items-center gap-3 z-50">
        <img
          src={`${API_URL}${profileImage}`}
          className="w-12 h-12 rounded-full"
          alt={username}
        />
        <p className="text-white text-xl font-bold">{username}</p>
      </div>
      <div className="absolute top-1.5 left-0 right-0 p-2 flex gap-1 z-50">
        {statuses.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full">
            <div
              className={`h-full bg-white ${
                idx < userStatus.index ? "w-full" : ""
              } ${idx === userStatus.index ? "animate-progress" : "w-0"}`}
              style={{
                animationName: idx === userStatus.index ? "progress" : "none",
                animationDuration: "5s",
                animationTimingFunction: "linear",
              }}
            />
          </div>
        ))}
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        {currentStatus.mediaUrl && currentStatus.mediaType === "video" ? (
          <video
            src={`${API_URL}${currentStatus.mediaUrl}`}
            className="max-w-full max-h-[80vh] object-contain"
            autoPlay
            loop={false}
            onEnded={onNext}
          />
        ) : currentStatus.mediaUrl && currentStatus.mediaType === "image" ? (
          <img
            src={`${API_URL}${currentStatus.mediaUrl}`}
            className="max-w-full max-h-[80vh] object-contain"
            alt="status"
          />
        ) : null}
        {currentStatus.text && (
          <p
            className={`absolute text-white text-3xl font-bold p-4 text-center ${
              currentStatus.mediaUrl ? "bottom-20 bg-black/50" : ""
            }`}
          >
            {currentStatus.text}
          </p>
        )}
      </div>
      <button
        onClick={onPrev}
        className="absolute left-0 top-0 bottom-0 w-1/3 z-40"
      />
      <button
        onClick={onNext}
        className="absolute right-0 top-0 bottom-0 w-2/3 z-40"
      />
    </div>
  );
};

// Custom Audio Player Component 
const CustomAudioPlayer = ({ src, sender }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
    
    audioRef.current.currentTime = seekTime;
    setProgress(seekTime);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    audioRef.current.currentTime = 0;
  };

  // Determine colors based on sender
  const isMe = sender === "You";
  const bgColor = isMe ? "bg-green-600" : "bg-gray-500";
  const iconColor = "text-white";
  const progressBg = isMe ? "bg-white/30" : "bg-gray-300";
  const progressFill = isMe ? "bg-white" : "bg-green-500";


  return (
    <div className="flex items-center gap-2 w-64">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button
        onClick={togglePlayPause}
        className={`p-2 ${bgColor} ${iconColor} rounded-full`}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <div
        className={`flex-1 h-2 ${progressBg} rounded-full cursor-pointer`}
        onClick={handleSeek}
      >
        <div
          className={`h-2 ${progressFill} rounded-full`}
          style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : "0%" }}
        />
      </div>
    </div>
  );
};


export default function ChatPage() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [recording, setRecording] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [unread, setUnread] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [reactingTo, setReactingTo] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPic, setNewPic] = useState(null);
  
  // update password

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const [showStatus, setShowStatus] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusFile, setStatusFile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 💡 New State 
  const [activeTab, setActiveTab] = useState("chats"); // 'chats', 'status', 'calls'
  const [allStatuses, setAllStatuses] = useState([]);
  const [viewingStatus, setViewingStatus] = useState(null);
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); 
  const [callAccepted, setCallAccepted] = useState(false);
  const [callLogs, setCallLogs] = useState([]); 
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const messagesEnd = useRef(null);
  const fileInput = useRef(null);
  const mediaRecorder = useRef(null);
  const socket = useRef(null);
  const ringtone = useRef(null);
  const pc = useRef(null); // PeerConnection
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /*  INITIAL SETUP (Fetch Users, Status, Calls)   */
  useEffect(() => {
    if (!token) return window.location.replace("/login");

    socket.current = io(API_URL, { auth: { token } });

    const fetchAllData = async () => {
      try {
        const [meRes, usersRes, statusRes, callsRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/status/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/calllog`, {
            headers: { Authorization: `Bearer ${token}` },
          }), 
        ]);

        setMe(meRes.data);
        setNewName(meRes.data.username);
        setUsers(
          usersRes.data.filter((u) => u.username !== meRes.data.username)
        );
        setAllStatuses(statusRes.data);
        setCallLogs(callsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        localStorage.clear();
        window.location.replace("/login");
      }
    };

    fetchAllData();

    return () => socket.current?.disconnect();
  }, []);

 
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  /*  SOCKET LISTENERS Chat, Call, WebRTC  */
  useEffect(() => {
    if (!socket.current || !me) return;

    // Chat Listeners 
    socket.current.on("privateMessage", (msg) => {
      // Use the 'me' state object for the check
      const myUsername = me.username; 
      
      const formatted = {
        ...msg,
        sender: msg.sender === myUsername ? "You" : msg.sender,
        reactions: msg.reactions || {},
      };
      if (
        receiver &&
        (msg.sender === receiver.username || msg.receiver === myUsername)
      ) {
        setMessages((prev) => [...prev, formatted]);
      } else if (msg.receiver === myUsername) {
        setUnread((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    });

    socket.current.on("messageReaction", ({ messageId, emoji }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                reactions: {
                  ...m.reactions,
                  [emoji]: (m.reactions[emoji] || 0) + 1,
                },
              }
            : m
        )
      );
    });

    // Call Listeners 
    socket.current.on("incomingCall", ({ from, type, offer }) => {
      setIncomingCall({ from, type, offer }); 
      const playPromise = ringtone.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) =>
          console.log("Ringtone autoplay prevented.")
        );
      }
    });

    socket.current.on("callAccepted", async ({ from, answer }) => {
      if (pc.current) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallAccepted(true);
        ringtone.current?.pause();
      }
    });

    socket.current.on("callRejected", ({ from }) => {
      alert(`${from} rejected the call.`);
      logCall(call.type, "dialed", me.username, call.to); 
      resetCallState();
    });

    socket.current.on("callEnded", ({ from }) => {
      alert(`Call with ${from} ended.`);
      resetCallState();
    });

    // WebRTC Listener 
    socket.current.on("ice-candidate", async ({ from, candidate }) => {
      if (pc.current && candidate) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding received ICE candidate", e);
        }
      }
    });

    // Cleanup listeners
    return () => {
      socket.current.off("privateMessage");
      socket.current.off("messageReaction");
      socket.current.off("incomingCall");
      socket.current.off("callAccepted");
      socket.current.off("callRejected");
      socket.current.off("callEnded");
      socket.current.off("ice-candidate");
    };
  }, [me, receiver, call]); 

  /*  WebRTC Core Functions                                            */
  
  const getMedia = async (type) => {
    const constraints =
      type === "video"
        ? { video: true, audio: true }
        : { audio: true, video: false };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    return stream;
  };

  const createPeerConnection = (recipientUsername, stream) => {
    const peerConnection = new RTCPeerConnection(iceServers);

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", {
          to: recipientUsername,
          candidate: event.candidate,
        });
      }
    };

    pc.current = peerConnection;
    return peerConnection;
  };

  /*  VOICE RECORDING                                                  */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setFile(new File([blob], "voice.webm", { type: "audio/webm" }));
    };
    mediaRecorder.current.start();
    setRecording(true);
  };
  const stopRecording = () => {
    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  /*  OPEN CHAT & LOAD HISTORY                                          */
  const openChat = async (user) => {
    setReceiver(user);
    setUnread((prev) => ({ ...prev, [user.username]: 0 }));
    
    // Get username from localStorage (set on login)
    const myUsername = localStorage.getItem("username");

    const { data } = await axios.get(`${API_URL}/api/message`, {
      params: { receiver: user.username },
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(
      data.map((m) => ({
        ...m,
        // Use myUsername for the check
        sender: m.sender === myUsername ? "You" : m.sender,
        reactions: m.reactions || {},
      }))
    );
    setMobileMenuOpen(false);
  };

  /*  SEND MESSAGE (with try...catch)                                 */
  const send = async () => {
    if (!input.trim() && !file) return;

    try {
      let mediaUrl = "";
      if (file) {
        const form = new FormData();
        form.append("file", file);
        const { data } = await axios.post(`${API_URL}/api/upload`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        mediaUrl = data.filePath;
      }

      const payload = {
        receiver: receiver.username,
        text: input,
        type: file
          ? file.type.startsWith("image")
            ? "image"
            : file.type.startsWith("audio")
            ? "voice"
            : "doc"
          : "text",
        mediaUrl,
      };

      // This is the call that was failing
      const { data } = await axios.post(`${API_URL}/api/message`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.current.emit("privateMessage", { ...data, sender: me.username });
      setMessages((prev) => [...prev, { ...data, sender: "You", reactions: {} }]);
      setInput("");
      setFile(null);
      setAudioURL("");
      if (fileInput.current) fileInput.current.value = "";
    
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error: Could not send message. Please try again.");
    }
  };

  /*  REACTION / EDIT / DELETE                                          */

  const react = (messageId, emoji) => {
    socket.current.emit("reactToMessage", { messageId, emoji });
    setReactingTo(null);
  };
  const deleteMsg = async (id) => {
    await axios.delete(`${API_URL}/api/message/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    setShowMenu(null);
  };
  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
    setShowMenu(null);
  };
  const saveEdit = async () => {
    await axios.put(
      `${API_URL}/api/message/${editingId}`,
      { text: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages((prev) =>
      prev.map((m) =>
        m._id === editingId ? { ...m, text: editText, edited: true } : m
      )
    );
    setEditingId(null);
  };

  /*  CALL FEATURES (with Logging)                                    */
  const logCall = async (callType, status, caller, callee) => {
    try {
      await axios.post(
        `${API_URL}/api/calllog`,
        {
          caller: caller,
          receiver: callee,
          type: callType,
          status: status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { data } = await axios.get(`${API_URL}/api/calllog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCallLogs(data);
    } catch (err) {
      console.error("Failed to log call", err);
    }
  };

  const resetCallState = () => {
    pc.current?.close(); // Close peer connection
    localStream?.getTracks().forEach((track) => track.stop()); // Stop camera/mic

    pc.current = null;
    setCall(null);
    setIncomingCall(null);
    setCallAccepted(false);
    setLocalStream(null);
    setRemoteStream(null);

    ringtone.current?.pause();
    if (ringtone.current) ringtone.current.currentTime = 0;
  };

  const startCall = async (type) => {
    const callData = { to: receiver.username, type };
    setCall(callData);

    try {
      const stream = await getMedia(type);
      const peerConnection = createPeerConnection(receiver.username, stream);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.current.emit("callRequest", { ...callData, offer });

      const playPromise = ringtone.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) =>
          console.log("Ringtone play prevented (outgoing).")
        );
      }
    } catch (err) {
      console.error("Error starting call:", err);
      resetCallState();
    }
  };

  const startVoiceCall = () => startCall("voice");
  const startVideoCall = () => startCall("video");

  const acceptCall = async () => {
    try {
      const stream = await getMedia(incomingCall.type);
      const peerConnection = createPeerConnection(incomingCall.from, stream);

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.current.emit("acceptCall", { to: incomingCall.from, answer });

      setCallAccepted(true);
      setCall({ from: incomingCall.from, type: incomingCall.type }); // Set active call
      setIncomingCall(null);
      ringtone.current?.pause();
    } catch (err) {
      console.error("Error accepting call:", err);
      resetCallState();
    }
  };

  const rejectCall = () => {
    socket.current.emit("rejectCall", { to: incomingCall.from });
    logCall(incomingCall.type, "missed", incomingCall.from, me.username); // Log as missed
    resetCallState();
  };

  const endCall = () => {
    const recipient = call.to || call.from;
    socket.current.emit("endCall", { to: recipient });

    // Log the call
    const amICaller = !!call.to;
    logCall(
      call.type,
      amICaller ? "dialed" : "received",
      amICaller ? me.username : recipient,
      amICaller ? recipient : me.username
    );

    resetCallState();
  };
  /*  PROFILE & STATUS (with Video)                                    */
  const updateProfile = async () => {
    let picUrl = me.profileImage;
    if (newPic) {
      const form = new FormData();
      form.append("file", newPic);
      const { data } = await axios.post(`${API_URL}/api/upload`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      picUrl = data.filePath;
    }

    // Create payload
    const payload = {
      username: newName,
      profileImage: picUrl,
    };

    // Only add passwords if they're filled out
    if (oldPassword && newPassword) {
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    }
    
    try {
      await axios.put(
        `${API_URL}/api/auth/profile`,
        payload, // Send payload
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMe((prev) => ({ ...prev, username: newName, profileImage: picUrl }));
      localStorage.setItem("username", newName);
      setShowProfile(false);
      setOldPassword(""); // Clear fields
      setNewPassword(""); // Clear fields
      
    } catch (err) {
      console.error("Profile update failed", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const fetchStatuses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/status/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllStatuses(data);
    } catch (err) {
      console.error("Failed to refetch statuses", err);
    }
  };

  const postStatus = async () => {
    let mediaUrl = "";
    let mediaType = null;

    if (statusFile) {
      const form = new FormData();
      form.append("file", statusFile);
      const { data } = await axios.post(`${API_URL}/api/upload`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mediaUrl = data.filePath;
      mediaType = statusFile.type.startsWith("video") ? "video" : "image"; // Determine type
    }

    await axios.post(
      `${API_URL}/api/status`,
      { text: statusText, mediaUrl, mediaType }, // Send mediaType
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowStatus(false);
    setStatusText("");
    setStatusFile(null);
    alert("Status posted!");
    fetchStatuses();
  };

  const logout = () => {
    localStorage.clear();
    socket.current?.disconnect();
    window.location.replace("/login");
  };

  /*  STATUS VIEWER LOGIC (Video aware)                               */

  const openStatus = (user) => {
    setViewingStatus({ user, index: 0 });
  };
  const closeStatus = () => {
    setViewingStatus(null);
  };
  const nextStatus = () => {
    if (!viewingStatus) return;
    if (viewingStatus.index < viewingStatus.user.statuses.length - 1) {
      setViewingStatus((prev) => ({ ...prev, index: prev.index + 1 }));
    } else {
      closeStatus();
    }
  };
  const prevStatus = () => {
    if (!viewingStatus) return;
    if (viewingStatus.index > 0) {
      setViewingStatus((prev) => ({ ...prev, index: prev.index - 1 }));
    }
  };

  useEffect(() => {
    if (viewingStatus) {
      const current = viewingStatus.user.statuses[viewingStatus.index];
      if (current.mediaType !== "video") {
        const timer = setTimeout(() => {
          nextStatus();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [viewingStatus]);

  /*  AUTO‑SCROLL                                                       */
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!me)
    return (
      <div className="flex h-screen bg-green-600 items-center justify-center text-white text-6xl font-bold">
        WhatsApp
      </div>
    );

  /*  RENDER                                                            */
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <audio ref={ringtone} src="/ringtone.mp3" loop />

      {/* Call Modals */}
      {incomingCall && !call && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
      {(call || (callAccepted && incomingCall)) && (
        <CallScreen
          call={call || incomingCall}
          callAccepted={callAccepted}
          onEndCall={endCall}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
      )}

      {/* Status Viewer  */}
      {viewingStatus && (
        <StatusViewer
          userStatus={viewingStatus}
          onClose={closeStatus}
          onNext={nextStatus}
          onPrev={prevStatus}
        />
      )}

      {/*SIDEBAR  */}
      <div
        className={`${
          receiver && !mobileMenuOpen ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-96 bg-white shadow-2xl`}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${API_URL}${me.profileImage}`}
              className="w-12 h-12 rounded-full border-4 border-white"
              alt="me"
            />
            <p className="text-xl font-bold truncate">{me.username}</p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setShowStatus(true)}
              className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold"
            >
              + Status
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold"
            >
              Edit
            </button>
            <button
              onClick={logout}
              className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl z-50 p-2 md:hidden">
            <button
              onClick={() => {
                setShowStatus(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              + Status
            </button>
            <button
              onClick={() => {
                setShowProfile(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}

        {/* UPDATED: CHAT / STATUS / CALLS TABS */}
        <div className="flex bg-gray-100">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 p-3 font-bold text-lg flex items-center justify-center gap-2 ${
              activeTab === "chats"
                ? "text-green-600 border-b-4 border-green-600"
                : "text-gray-500"
            }`}
          >
            <MessageSquare /> CHATS
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`flex-1 p-3 font-bold text-lg flex items-center justify-center gap-2 ${
              activeTab === "status"
                ? "text-green-600 border-b-4 border-green-600"
                : "text-gray-500"
            }`}
          >
            <Users /> STATUS
          </button>
          <button
            onClick={() => setActiveTab("calls")}
            className={`flex-1 p-3 font-bold text-lg flex items-center justify-center gap-2 ${
              activeTab === "calls"
                ? "text-green-600 border-b-4 border-green-600"
                : "text-gray-500"
            }`}
          >
            <PhoneForwarded /> CALLS
          </button>
        </div>

        {/* --- Conditional Lists --- */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" && (
            // Users (Chats) list
            <div>
              {users.map((user) => (
                <div
                  key={user.username}
                  onClick={() => openChat(user)}
                  className={`p-4 hover:bg-green-50 cursor-pointer border-b flex items-center justify-between ${
                    receiver?.username === user.username ? "bg-green-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`${API_URL}${
                        user.profileImage || "/default-avatar.png"
                      }`}
                      className="w-12 h-12 rounded-full"
                      alt={user.username}
                    />
                    <p className="font-semibold text-lg">{user.username}</p>
                  </div>
                  {unread[user.username] > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {unread[user.username]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "status" && (
            // Status list
            <div>
              <p className="p-4 text-gray-600 font-bold bg-gray-50">
                Recent updates
              </p>
              {allStatuses.map((userStatus) => (
                <div
                  key={userStatus.username}
                  onClick={() => openStatus(userStatus)}
                  className="p-4 hover:bg-green-50 cursor-pointer border-b flex items-center gap-3"
                >
                  <div className="p-1 border-4 border-green-500 rounded-full">
                    <img
                      src={`${API_URL}${userStatus.profileImage}`}
                      className="w-12 h-12 rounded-full"
                      alt={userStatus.username}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {userStatus.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userStatus.statuses.length} updates
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "calls" && (
            // Call Log list
            <div>
              {callLogs.map((log) => {
                const isMeCaller = log.caller === me.username;
                const otherUser = isMeCaller ? log.receiver : log.caller;
                const isMissed = log.status === "missed";
                
                return (
                  <div
                    key={log._id}
                    className="p-4 hover:bg-green-50 cursor-pointer border-b flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`${API_URL}/default-avatar.png`} // Ideally, fetch user profile pics
                        className="w-12 h-12 rounded-full"
                        alt={otherUser}
                      />
                      <div>
                        <p
                          className={`font-semibold text-lg ${
                            isMissed ? "text-red-600" : ""
                          }`}
                        >
                          {otherUser}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {isMeCaller ? (
                            <PhoneOutgoing className="w-4 h-4" />
                          ) : (
                            <PhoneIncoming className="w-4 h-4" />
                          )}
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={isMissed ? "text-red-600" : "text-green-600"}
                    >
                      {log.type === "video" ? <Video /> : <Phone />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/*CHAT AREA */}
      <div
        className={`${
          receiver ? "flex" : "hidden md:flex"
        } flex-1 flex flex-col`}
      >
        {receiver ? (
          <>
            {/* Chat header – with call buttons */}
            <div className="bg-green-600 text-white p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReceiver(null)}
                  className="md:hidden p-2 -ml-2"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <img
                  src={`${API_URL}${
                    receiver.profileImage || "/default-avatar.png"
                  }`}
                  className="w-11 h-11 rounded-full"
                  alt="receiver"
                />
                <h2 className="text-xl font-bold truncate">
                  {receiver.username}
                </h2>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startVoiceCall}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  onClick={startVideoCall}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- Messages --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  } group`}
                >
                  <div
                    className={`relative max-w-[90%] md:max-w-[70%] p-3 rounded-2xl shadow ${
                      msg.sender === "You"
                        ? "bg-green-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {msg.type === "image" && (
                      <img
                        src={`${API_URL}${msg.mediaUrl}`}
                        className="rounded-lg max-w-full mb-2"
                        alt="img"
                      />
                    )}
                    
                    {/*  UPDATED: Use CustomAudioPlayer  */}
                    {msg.type === "voice" && (
                      <CustomAudioPlayer 
                        src={`${API_URL}${msg.mediaUrl}`} 
                        sender={msg.sender}
                      />
                    )}
                    
                    {msg.type === "doc" && (
                      <a
                        href={`${API_URL}${msg.mediaUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          msg.sender === "You" 
                          ? "bg-green-700 text-white" 
                          : "bg-gray-200 text-black"
                        }`}
                      >
                        <Paperclip className="w-5 h-5" />
                        <span className="truncate max-w-xs">{msg.mediaUrl.split("/").pop()}</span>
                      </a>
                    )}

                    {editingId === msg._id ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                        className="w-full p-2 bg-white text-black rounded"
                        autoFocus
                      />
                    ) : (
                      // Only show text if it's a text message
                      msg.type === "text" && (
                        <p className="break-words">
                          {msg.text}{" "}
                          {msg.edited && (
                            <span className="text-xs opacity-70">(edited)</span>
                          )}
                        </p>
                      )
                    )}
                    
                    {/* Show text content under media if it exists */}
                    {msg.type !== "text" && msg.text && (
                       <p className="break-words pt-2">
                          {msg.text}{" "}
                          {msg.edited && (
                            <span className="text-xs opacity-70">(edited)</span>
                          )}
                        </p>
                    )}

                    <div className="flex gap-1 mt-2 flex-wrap">
                      {Object.entries(msg.reactions || {}).map(([e, c]) => (
                        <span
                          key={e}
                          className={`px-2 py-0.5 rounded-full text-sm shadow ${
                            msg.sender === "You" ? "bg-white text-black" : "bg-gray-100"
                          }`}
                        >
                          {e} {c}
                        </span>
                      ))}
                    </div>

                    {msg.sender === "You" && (
                      <button
                        onClick={() =>
                          setShowMenu(showMenu === msg._id ? null : msg._id)
                        }
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-gray-200/50 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center"
                      >
                        ...
                      </button>
                    )}
                    {showMenu === msg._id && (
                      <div className="absolute top-9 right-1 bg-black text-white rounded-lg shadow-2xl p-1 z-50">
                        <button
                          onClick={() => {
                            setReactingTo(msg._id);
                            setShowMenu(null);
                          }}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-800"
                        >
                          React
                        </button>
                        <button
                          onClick={() => startEdit(msg)}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMsg(msg._id)}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-800 text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {reactingTo === msg._id && (
                      <div className="absolute bottom-10 left-0 z-50">
                        <EmojiPicker
                          onEmojiClick={(e) => {
                            react(msg._id, e.emoji);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>

            {/* --- INPUT BAR --- */}
            <div className="p-4 bg-white border-t flex items-center gap-3 relative">
              {/* File preview */}
              {(file || audioURL) && (
                <div className="absolute bottom-20 left-4 bg-white p-3 rounded-xl shadow-lg flex items-center gap-2 z-40">
                  {audioURL ? (
                    <audio src={audioURL} controls />
                  ) : file?.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-24 rounded"
                      alt="preview"
                    />
                  ) : (
                    <p>{file?.name}</p>
                  )}
                  <button
                    onClick={() => {
                      setFile(null);
                      setAudioURL("");
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                    className="text-red-500 text-xl"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Attachment */}
              <button
                onClick={() => fileInput.current.click()}
                className="text-2xl"
              >
                <Paperclip className="w-6 h-6" />
              </button>
              <input
                ref={fileInput}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,video/*,.pdf,.doc,.docx,.webm,.mp3"
              />

              {/* Emoji */}
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-2xl"
              >
                <Smile className="w-6 h-6" />
              </button>
              {showEmoji && (
                <div className="absolute bottom-20 left-4 z-50">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setInput((prev) => prev + e.emoji);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}

              {/* Voice + Text */}
              <div className="flex items-center gap-2 flex-1">
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`transition ${
                    recording ? "animate-pulse text-red-600" : "text-green-600"
                  }`}
                  title="Hold to record"
                >
                  <Mic className="w-8 h-8" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && send()}
                  placeholder="Hold Mic or type..."
                  className="flex-1 border-2 border-green-300 rounded-full px-4 py-2 text-base focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={send}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition"
              >
                SEND
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-4xl text-gray-400">
            {activeTab === "chats" && "Select a chat to start messaging"}
            {activeTab === "status" && "View your contacts' statuses"}
            {activeTab === "calls" && "View your call history"}
          </div>
        )}
      </div>

      {/* PROFILE MODAL  */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
              Edit Profile
            </h2>
            <label className="cursor-pointer block mb-4">
              <img
                src={
                  newPic
                    ? URL.createObjectURL(newPic)
                    : `${API_URL}${me.profileImage}`
                }
                className="w-32 h-32 rounded-full mx-auto border-4 border-green-500"
                alt="profile"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPic(e.target.files[0])}
                className="hidden"
              />
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New Name"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4"
            />
            
            {/*  ADDED Password Fields  */}
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password (min 6 chars)"
              className="w-full border-2 border-gray-300 p-3 rounded-lg mb-4"
            />
            {/* END Password Fields  */}

            <div className="flex gap-3">
              <button
                onClick={updateProfile}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold"
              >
                SAVE
              </button>
              <button
                onClick={() => setShowProfile(false)}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  STATUS MODAL (UPDATED) */}
      {showStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
              Add Status
            </h2>
            <textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="What's happening?"
              className="w-full h-28 border-2 border-green-300 rounded-lg p-3"
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setStatusFile(e.target.files[0])}
              className="mt-3 block w-full"
            />
            {statusFile && statusFile.type.startsWith("image") && (
              <img
                src={URL.createObjectURL(statusFile)}
                className="mt-3 rounded-lg max-h-48 mx-auto"
                alt="status preview"
              />
            )}
            {statusFile && statusFile.type.startsWith("video") && (
              <video
                src={URL.createObjectURL(statusFile)}
                className="mt-3 rounded-lg max-h-48 mx-auto"
                controls
                muted
              />
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={postStatus}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold"
              >
                POST
              </button>
              <button
                onClick={() => {
                  setShowStatus(false);
                  setStatusText("");
                  setStatusFile(null);
                }}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}