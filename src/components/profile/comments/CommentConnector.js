import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const CommentConnector = ({ depth }) => {
    if (depth === 0)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute left-0 bottom-0 w-[2px] bg-border opacity-30", style: {
                    left: '-16px',
                    height: '100%',
                    bottom: '20px',
                } }), _jsx("div", { className: "absolute w-3 h-[2px] bg-border opacity-30", style: {
                    left: '-16px',
                    top: '20px',
                } })] }));
};
