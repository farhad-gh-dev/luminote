import type { Highlight } from "@/types";

interface HighlightsListProps {
  initialHighlights: Highlight[];
}

const HighlightsList: React.FC<HighlightsListProps> = ({
  initialHighlights,
}) => {
  console.log(initialHighlights);
  return (
    <div>
      Highlight pannel
      <div>Highlights List</div>
    </div>
  );
};

export default HighlightsList;
