import { Input } from "@/components/ui/input";

interface SearchCollaboratorsProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const SearchCollaborators = ({ searchTerm, onSearch }: SearchCollaboratorsProps) => {
  return (
    <Input
      placeholder="Search collaborators..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="mb-4 bg-background"
    />
  );
};