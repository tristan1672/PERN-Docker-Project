import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DataTable = ({ data, isLoading }) => {
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Post ID" }), _jsx("th", { children: "ID" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Body" }), _jsx("th", { children: "Created At" })] }) }), _jsx("tbody", { children: data.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.post_id }), _jsx("td", { children: item.id }), _jsx("td", { children: item.name }), _jsx("td", { children: item.email }), _jsx("td", { children: item.body }), _jsx("td", { children: new Date(item.created_at).toLocaleString() })] }, item.id))) })] }));
};
export default DataTable;
