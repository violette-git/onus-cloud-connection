import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { ProfileContent } from "./ProfileContent";
import { ProfileSettings } from "./ProfileSettings";
export const ProfileView = ({ profile, musician, isOwner, onImageUpload, onSocialLinksUpdate, onBecomeMusicianClick, onMusicianProfileCreated, updateProfileMutation }) => {
    return (_jsx("div", { className: "animate-fade-in pb-12 min-h-screen bg-background", children: _jsxs("div", { className: "onus-container", children: [_jsx(ProfileHeader, { profile: profile, musician: musician, isOwner: isOwner, onImageUpload: onImageUpload }), _jsx(ProfileActions, { profile: profile, isOwner: isOwner, onSocialLinksUpdate: onSocialLinksUpdate, onBecomeMusicianClick: onBecomeMusicianClick }), isOwner && (_jsx("div", { className: "mt-8", children: _jsx(ProfileSettings, { profile: profile, onUpdate: (updates) => updateProfileMutation.mutateAsync(updates), isLoading: updateProfileMutation.isPending }) })), _jsx("div", { className: "mt-8", children: _jsx(ProfileContent, { musician: musician, onProfileCreated: onMusicianProfileCreated, profile: profile, isOwner: isOwner }) })] }) }));
};
