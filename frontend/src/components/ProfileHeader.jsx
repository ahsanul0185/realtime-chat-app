import React, { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import noAvatar from "../assets/no-profile.svg";
import { Loader, LogOutIcon, PencilIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

const ProfileHeader = () => {
  const { logout, authUser, updateProfile,isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState();

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic : base64Image})
    }

  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">

          <div className="h-10 relative group shrink-0">
            {/* <span className="z-10 absolute group-hover:opacity-0 group-hover:scale-0 duration-200 bottom-[0.3px] -right-[0.5px] border-2 border-dark size-3 bg-green-500 rounded-full"></span> */}
            <button
              className="size-10 rounded-full overflow-hidden relative"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || noAvatar}
                alt="user profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center duration-200 transition-opacity">
                <PencilIcon className="size-4 text-white" />
              </div>

              {isUpdatingProfile && <div className="absolute inset-0 bg-black/50  flex items-center justify-center duration-200 transition-opacity">
                <Loader className="text-gray-200 size-5 animate-spin" />
              </div>}
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div> 

          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-slate-200 font-medium text-sm max-w-[180px] truncate">
                {authUser.fullName}
              </h3>

              <p className="text-slate-400 text-[11px]">Online</p>
            </div>

            <div className="flex gap-4 items-center">
              {/* LOGOUT BTN */}
              <button
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                onClick={logout}
              >
                <LogOutIcon className="size-5" />
              </button>

              {/* SOUND TOGGLE BTN */}
              <button
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                onClick={() => {
                  // play click sound before toggling
                  mouseClickSound.currentTime = 0; // reset to start
                  mouseClickSound
                    .play()
                    .catch((error) => console.log("Audio play failed:", error));
                  toggleSound();
                }}
              >
                {isSoundEnabled ? (
                  <Volume2Icon className="size-5" />
                ) : (
                  <VolumeOffIcon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
