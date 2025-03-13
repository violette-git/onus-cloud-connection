import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VideoForm } from "./VideoForm";
import { VideoEmbed } from "./VideoEmbed";
import { CommentButton } from "./comments/CommentButton";
export const VideoManager = ({ musicianId, videos, isOwner = false }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newVideo, setNewVideo] = useState({
        title: "",
        url: "",
        platform: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        }
        catch (_) {
            return false;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newVideo.title || !newVideo.url || !newVideo.platform) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all fields.",
            });
            return;
        }
        if (!isValidUrl(newVideo.url)) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a valid URL.",
            });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('videos')
                .insert({
                musician_id: musicianId,
                title: newVideo.title,
                url: newVideo.url,
                platform: newVideo.platform,
            });
            if (error)
                throw error;
            toast({
                title: "Success!",
                description: "Your video has been added.",
            });
            setNewVideo({ title: "", url: "", platform: "" });
            setIsAdding(false);
            queryClient.invalidateQueries({ queryKey: ['musician'] });
        }
        catch (error) {
            console.error('Error adding video:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not add video. Please try again.",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (videoId) => {
        try {
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', videoId);
            if (error)
                throw error;
            toast({
                title: "Success!",
                description: "Video has been removed.",
            });
            queryClient.invalidateQueries({ queryKey: ['musician'] });
        }
        catch (error) {
            console.error('Error deleting video:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not delete video. Please try again.",
            });
        }
    };
    const handleVideoFormChange = (field, value) => {
        setNewVideo(prev => ({ ...prev, [field]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Videos" }), !isAdding && isOwner && (_jsx(Button, { onClick: () => setIsAdding(true), variant: "outline", children: "Add Video" }))] }), isAdding && (_jsx(VideoForm, { isSubmitting: isSubmitting, newVideo: newVideo, onSubmit: handleSubmit, onChange: handleVideoFormChange, onCancel: () => setIsAdding(false) })), _jsx("div", { className: "space-y-4", children: videos.map((video) => (_jsxs("div", { className: "p-4 border rounded-lg space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: video.title }), _jsx("p", { className: "text-sm text-muted-foreground capitalize", children: video.platform })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CommentButton, { contentId: video.id, contentType: "video" }), isOwner && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(video.id), className: "text-destructive hover:text-destructive", children: "Delete" }))] })] }), _jsx(VideoEmbed, { video: video })] }, video.id))) })] }));
};
