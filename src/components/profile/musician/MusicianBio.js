import { jsx as _jsx } from "react/jsx-runtime";
export const MusicianBio = ({ musician }) => {
    if (!musician.bio)
        return null;
    return (_jsx("div", { className: "max-w-2xl mx-auto", children: _jsx("p", { className: "text-muted-foreground text-center", children: musician.bio }) }));
};
