import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (_jsxs("div", { children: [_jsx("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, children: "Previous" }), _jsxs("span", { children: ["Page ", currentPage, " of ", totalPages] }), _jsx("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, children: "Next" })] }));
};
export default Pagination;
