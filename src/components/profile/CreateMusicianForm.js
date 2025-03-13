import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
export const CreateMusicianForm = ({ userId, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        bio: "",
        genreId: "",
    });
    const { data: genres } = useQuery({
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error: musicianError } = await supabase
                .from('musicians')
                .insert({
                user_id: userId,
                name: formData.name,
                location: formData.location,
                bio: formData.bio,
                genre_id: formData.genreId || null,
            });
            if (musicianError)
                throw musicianError;
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'musician' })
                .eq('id', userId);
            if (profileError)
                throw profileError;
            toast({
                title: "Success!",
                description: "Your musician profile has been created.",
            });
            onSuccess();
        }
        catch (error) {
            console.error('Error creating musician profile:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not create musician profile. Please try again.",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "name", className: "text-sm font-medium", children: "Artist/Band Name" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "location", className: "text-sm font-medium", children: "Location" }), _jsx(Input, { id: "location", value: formData.location, onChange: (e) => setFormData(prev => ({ ...prev, location: e.target.value })), placeholder: "e.g., Los Angeles, CA" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "bio", className: "text-sm font-medium", children: "Bio" }), _jsx(Textarea, { id: "bio", value: formData.bio, onChange: (e) => setFormData(prev => ({ ...prev, bio: e.target.value })), placeholder: "Tell us about yourself or your band...", className: "h-32" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "genre", className: "text-sm font-medium", children: "Primary Genre" }), _jsxs(Select, { value: formData.genreId, onValueChange: (value) => setFormData(prev => ({ ...prev, genreId: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a genre" }) }), _jsx(SelectContent, { children: genres?.map((genre) => (_jsx(SelectItem, { value: genre.id, children: genre.name }, genre.id))) })] })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? "Creating..." : "Create Musician Profile" })] }));
};
