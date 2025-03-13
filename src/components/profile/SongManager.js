import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SunoPlayer } from "./SunoPlayer";
import { CommentButton } from "./comments/CommentButton";
export const SongManager = ({ musicianId, songs, isOwner = false }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newSong, setNewSong] = useState({ title: "", url: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const extractSongId = (url) => {
        try {
            const urlObj = new URL(url);
            if (!urlObj.hostname.includes('suno')) {
                return null;
            }
            const pathParts = urlObj.pathname.split('/');
            return pathParts[pathParts.length - 1];
        }
        catch (e) {
            return null;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const songId = extractSongId(newSong.url);
        if (!songId) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please provide a valid Suno song URL.",
            });
            setIsSubmitting(false);
            return;
        }
        try {
            const { error } = await supabase
                .from('songs')
                .insert({
                musician_id: musicianId,
                title: newSong.title,
                url: songId, // Store just the song ID
            });
            if (error)
                throw error;
            toast({
                title: "Success!",
                description: "Your song has been added.",
            });
            setNewSong({ title: "", url: "" });
            setIsAdding(false);
            queryClient.invalidateQueries({ queryKey: ['musician'] });
        }
        catch (error) {
            console.error('Error adding song:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not add song. Please try again.",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (songId) => {
        try {
            const { error } = await supabase
                .from('songs')
                .delete()
                .eq('id', songId);
            if (error)
                throw error;
            toast({
                title: "Success!",
                description: "Song has been removed.",
            });
            queryClient.invalidateQueries({ queryKey: ['musician'] });
        }
        catch (error) {
            console.error('Error deleting song:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not delete song. Please try again.",
            });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Songs" }), !isAdding && isOwner && (_jsx(Button, { onClick: () => setIsAdding(true), variant: "outline", children: "Add Song" }))] }), isAdding && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "title", className: "text-sm font-medium", children: "Title" }), _jsx(Input, { id: "title", value: newSong.title, onChange: (e) => setNewSong(prev => ({ ...prev, title: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "url", className: "text-sm font-medium", children: "Suno Song URL" }), _jsx(Input, { id: "url", type: "url", value: newSong.url, onChange: (e) => setNewSong(prev => ({ ...prev, url: e.target.value })), placeholder: "https://suno.com/song/your-song-id", required: true })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Adding..." : "Add Song" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => setIsAdding(false), children: "Cancel" })] })] })), _jsx("div", { className: "space-y-4", children: songs.map((song) => (_jsxs("div", { className: "p-4 border rounded-lg space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h4", { className: "font-medium", children: song.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CommentButton, { contentId: song.id, contentType: "song" }), isOwner && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(song.id), className: "text-destructive hover:text-destructive", children: "Delete" }))] })] }), _jsx(SunoPlayer, { songId: song.url })] }, song.id))) })] }));
};
