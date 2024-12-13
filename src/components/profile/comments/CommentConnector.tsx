interface CommentConnectorProps {
  depth: number;
}

export const CommentConnector = ({ depth }: CommentConnectorProps) => {
  if (depth === 0) return null;

  return (
    <>
      {/* Vertical connection line */}
      <div 
        className="absolute left-0 bottom-0 w-[2px] bg-border opacity-30"
        style={{ 
          left: '-16px',
          height: '100%',
          bottom: '20px',
        }}
      />
      {/* Horizontal connector line */}
      <div 
        className="absolute w-3 h-[2px] bg-border opacity-30"
        style={{ 
          left: '-16px',
          top: '20px',
        }}
      />
    </>
  );
};