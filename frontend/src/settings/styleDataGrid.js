export const STYLE_DATA_GRID_DEFAULT = {
  "&.MuiDataGrid-root": {
    border: "none",
    marginBottom: "auto",
  },
  "&.MuiDataGrid-root *": {
    fontFamily: "TT Interfaces",
    color: "#475467",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F3F2FA",
    borderRadius: "15px",
    border: "none",
    marginBottom: "10px",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },
  ".MuiDataGrid-row.Mui-selected": {
    backgroundColor: "#EAECF0",
  },
  ".MuiDataGrid-row": {
    cursor: "pointer",
    borderRadius: "15px",
    position: "relative",
  },
  ".MuiDataGrid-virtualScrollerRenderZone>.MuiDataGrid-row:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    width: "calc(100% - 30px)",
    backgroundColor: "#EAECF0",
    height: "1px",
    bottom: "0px",
    left: "15px",
  },
  ".MuiDataGrid-row > .MuiDataGrid-cell": {
    border: "none",
  },
  ".MuiDataGrid-row > .MuiDataGrid-cell:last-child": {
    display: "none",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  ".MuiDataGrid-cellContent": {
    fontSize: "14px",
    lineHeight: "18px",
    fontWeight: 400,
  },
  "& .dataGrid_firstCol > *": {
    fontWeight: 500,
    color: "#26253B",
  },
};
