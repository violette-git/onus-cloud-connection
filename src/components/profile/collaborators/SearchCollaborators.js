import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
export const SearchCollaborators = ({ searchTerm, onSearch }) => {
    return (_jsx(Input, { placeholder: "Search collaborators...", value: searchTerm, onChange: (e) => onSearch(e.target.value), className: "mb-4 bg-background" }));
};
