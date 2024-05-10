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
  ".MuiDataGrid-row > .MuiDataGrid-cell:last-child:not([role='cell'])": {
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
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    position: "relative",
  },
  "& .MuiDataGrid-footerContainer::before": {
    content: '""',
    position: "absolute",
    width: "calc(100% - 30px)",
    backgroundColor: "#EAECF0",
    height: "1px",
    top: "0px",
    left: "15px",
  },
};

export const STYLE_ELEMENTS = {
  "&.MuiInputBase-root": {
    fontFamily: "TT Interfaces",
    color: "#475467",
  },
  "& .MuiInputBase-input.MuiSelect-select": {
    backgroundColor: "#fff",
    padding: "12px 13px",
    whiteSpace: "wrap",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#EAECF0",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, \
  &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f84f3988",
  },
  "&.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline, \
  & .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "#F84F39",
  },
  "& .MuiAutocomplete-inputRoot": {
    gap: "8px",
    alignItems: "center",
    padding: "13px 23px 6px 13px",
  },
  "&.MuiChip-root": {
    backgroundColor: "#F3F2FA",
    padding: "10px",
    gap: "11px",
    borderRadius: "5px",
    margin: 0,
  },
  "& .MuiChip-label": {
    padding: 0,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    color: "#4F4D7A",
  },
};

export const STYLE_DRAWER = {
  "& .MuiDrawer-paper": {
    borderRadius: "15px 0 0 15px",
  },
};

export const STYLE_TABS = {
  "& .MuiTabs-indicator": {
    backgroundColor: "#F84F39",
  },
  "& .MuiButtonBase-root.Mui-selected": {
    color: "#26253B",
  },
  "& .MuiButtonBase-root": {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: "20px",
    color: "#667085",
    fontFamily: "TT Interfaces",
    textTransform: "none",
  },
};

export const STYLE_ACCORDION = {
  "&.MuiAccordion-root": {
    boxShadow: "none",
    paddingTop: "13px",
    paddingBottom: "13px",
  },
  "&.MuiAccordion-root.Mui-expanded::before": {
    opacity: 1,
    backgroundColor: "#EAECF0",
  },
  "& .MuiAccordionSummary-content": {
    fontFamily: "TT Interfaces",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "22px",
  },
  ".MuiAccordionDetails-root": {
    fontFamily: "TT Interfaces",
    fontSize: "20px",
    fontWeight: 400,
    lineHeight: "30px",
  },
};
