import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FeaturedContentManager } from "./featured/FeaturedContentManager";
import { FeaturedContentItem } from "./featured/FeaturedContentItem";
export const FeaturedContent = ({ musicianId, isOwner, songs, videos }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const { data: featuredItems, isLoading } = useQuery({
        queryKey: ['featured-content', musicianId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('featured_content')
                .select('*')
                .eq('musician_id', musicianId)
                .order('display_order');
            if (error)
                throw error;
            return data;
        }
    });
    const addMutation = useMutation({
        mutationFn: async (item) => {
            const { error } = await supabase
                .from('featured_content')
                .insert(item);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
            toast({
                title: "Content featured successfully",
                description: "Your selected content has been added to the featured section.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to feature content. Please try again.",
            });
        }
    });
    const removeMutation = useMutation({
        mutationFn: async (itemId) => {
            const { error } = await supabase
                .from('featured_content')
                .delete()
                .eq('id', itemId);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
            toast({
                title: "Content removed",
                description: "The content has been removed from your featured section.",
            });
        }
    });
    const reorderMutation = useMutation({
        mutationFn: async (items) => {
            const { error } = await supabase
                .from('featured_content')
                .upsert(items.map(item => ({
                id: item.id,
                musician_id: item.musician_id,
                content_type: item.content_type,
                content_id: item.content_id,
                display_order: item.display_order
            })));
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
        }
    });
    const handleDragStart = (item) => {
        setDraggedItem(item);
    };
    const handleDragOver = (e, targetItem) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetItem.id)
            return;
        const items = featuredItems?.slice() || [];
        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        const targetIndex = items.findIndex(item => item.id === targetItem.id);
        if (draggedIndex === -1 || targetIndex === -1)
            return;
        items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, draggedItem);
        const updatedItems = items.map((item, index) => ({
            ...item,
            display_order: index
        }));
        reorderMutation.mutate(updatedItems);
    };
    if (isLoading)
        return null;
    const songCount = featuredItems?.filter(item => item.content_type === 'song').length ?? 0;
    const videoCount = featuredItems?.filter(item => item.content_type === 'video').length ?? 0;
    if (!featuredItems?.length && !isOwner)
        return null;
    return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Featured Content" }), isOwner && (_jsx(Button, { variant: "outline", onClick: () => setIsEditing(!isEditing), children: isEditing ? "Done" : "Manage Featured" }))] }), _jsxs("div", { className: "space-y-6", children: [featuredItems?.map((item) => (_jsx(FeaturedContentItem, { item: item, songs: songs, videos: videos, isEditing: isEditing, onRemove: (id) => removeMutation.mutate(id), onDragStart: handleDragStart, onDragOver: handleDragOver }, item.id))), isEditing && (_jsx("div", { className: "pt-4 border-t", children: _jsx(FeaturedContentManager, { songs: songs, videos: videos, featuredSongs: songCount, featuredVideos: videoCount, onAddSong: (songId) => {
                                    addMutation.mutate({
                                        musician_id: musicianId,
                                        content_type: 'song',
                                        content_id: songId,
                                        display_order: (featuredItems?.length ?? 0)
                                    });
                                }, onAddVideo: (videoId) => {
                                    addMutation.mutate({
                                        musician_id: musicianId,
                                        content_type: 'video',
                                        content_id: videoId,
                                        display_order: (featuredItems?.length ?? 0)
                                    });
                                } }) }))] })] }) }));
};
