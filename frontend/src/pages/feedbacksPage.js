import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { STYLE_DATA_GRID_DEFAULT } from "../settings/styleMUI";
import FetchApi from "../services/fetchApi";

const columns = [
  { field: "user", headerName: "От", cellClassName: "dataGrid_firstCol", flex: 1 },
  { field: "topic__str", headerName: "Тема", flex: 3 },
  { field: "action__str", headerName: "Статус", flex: 1 },
];

export default function FeedbacksPage() {
  const [logs, setLogs] = useState([]);
  const notifyes = useSelector((state) => state.auth.notificates);
  const dispatch = useDispatch();

  useEffect(() => {
    FetchApi(`api/logger`, dispatch, "Ошибка откликов", "get")
      .then((data) => {
        data.forEach((item) => (item.user = item.action === 1 ? item.user_from__str : item.user_to__str));
        setLogs(data);
      })
      .catch(() => {});
  }, [notifyes]);

  return (
    <div className="MyTopics_wrap">
      <div className="MyTopics_wrap__header">
        <h1>Мои отклики</h1>
        <div></div>
      </div>
      <div className="MyTopics_wrap__content">
        <div className="MyTopics_wrap__content__dataGrid" style={{ gridColumn: "span 5" }}>
          <DataGrid
            rows={logs}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            disableRowSelectionOnClick
            pageSizeOptions={[10]}
            autoHeight
            sx={STYLE_DATA_GRID_DEFAULT}
            hideFooterSelectedRowCount={true}
          />
        </div>
      </div>
    </div>
  );
}
