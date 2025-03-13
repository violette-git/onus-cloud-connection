import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
export const Musicians = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data: userProfile } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!user,
    });
    const { data: genres, isLoading: isLoadingGenres } = useQuery({
        queryKey: ['genres'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('genres')
                .select('*')
                .order('name');
            if (error)
                throw error;
            return data;
        },
    });
    const { data: musicians, isLoading: isLoadingMusicians } = useQuery({
        queryKey: ['musicians', searchQuery, selectedGenre],
        queryFn: async () => {
            let query = supabase
                .from('musicians')
                .select(`
          *,
          musician_genres (
            genre:genres (
              name
            )
          )
        `);
            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`);
            }
            if (selectedGenre && selectedGenre !== 'all') {
                query = query.eq('musician_genres.genre_id', selectedGenre);
            }
            const { data: musiciansData, error: musiciansError } = await query;
            if (musiciansError)
                throw musiciansError;
            // Fetch profiles for musicians with user_id
            const musiciansWithProfiles = await Promise.all((musiciansData || []).map(async (musician) => {
                if (musician.user_id) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('avatar_url, username, full_name')
                        .eq('id', musician.user_id)
                        .single();
                    return {
                        ...musician,
                        profile: profileData || undefined
                    };
                }
                return musician;
            }));
            return musiciansWithProfiles;
        },
    });
    const handleBecomeMusicianClick = async () => {
        if (!user)
            return;
        const { error } = await supabase
            .from('profiles')
            .update({ role: 'musician' })
            .eq('id', user.id);
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not upgrade to musician account. Please try again.",
            });
            return;
        }
        toast({
            title: "Success!",
            description: "Your account has been upgraded to a musician account.",
        });
    };
    const getGenreNames = (musician) => {
        return musician.musician_genres
            .map(mg => mg.genre.name)
            .join(', ');
    };
    const isLoading = isLoadingGenres || isLoadingMusicians;
    const handleMusicianClick = (musicianId) => {
        navigate(`/musicians/${musicianId}`);
    };
    return (_jsx("div", { className: "min-h-screen pt-24 pb-12", children: _jsx("div", { className: "onus-container", children: _jsxs("div", { className: "space-y-8", children: [user && userProfile?.role === 'observer' && (_jsxs("div", { className: "bg-muted p-4 rounded-lg text-center space-y-2", children: [_jsx("p", { className: "text-muted-foreground", children: "Want to share your music with the world?" }), _jsx(Button, { onClick: handleBecomeMusicianClick, children: "Become a Musician" })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }), _jsx(Input, { placeholder: "Search musicians...", className: "pl-10", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs(Select, { value: selectedGenre, onValueChange: setSelectedGenre, children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Genre" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Genres" }), genres?.map((genre) => (_jsx(SelectItem, { value: genre.id, children: genre.name }, genre.id)))] })] })] }), isLoading ? (_jsx("div", { className: "text-center text-muted-foreground", children: "Loading musicians..." })) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [musicians?.map((musician) => (_jsxs(Card, { className: "overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]", onClick: () => handleMusicianClick(musician.id), children: [_jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "aspect-square", children: _jsxs(Avatar, { className: "h-full w-full rounded-none", children: [_jsx(AvatarImage, { src: musician.profile?.avatar_url || musician.avatar_url || undefined, alt: musician.name, className: "object-cover" }), _jsx(AvatarFallback, { className: "rounded-none", children: _jsx(User, { className: "h-12 w-12 text-muted-foreground" }) })] }) }) }), _jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg", children: musician.name }), _jsxs(CardDescription, { children: [getGenreNames(musician), " \u2022 ", musician.location || 'Unknown location'] })] })] }, musician.id))), musicians?.length === 0 && (_jsx("div", { className: "col-span-full text-center text-muted-foreground", children: "No musicians found matching your criteria." }))] }))] }) }) }));
};
