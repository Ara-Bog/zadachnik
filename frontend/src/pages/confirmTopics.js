import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { STYLE_DATA_GRID_DEFAULT } from "../settings/styleMUI";
import Feedbacks from "../components/notifyesRows";
import FetchApi from "../services/fetchApi";
import { setOpenDrawer, closeLoading } from "../services/actionsSlice";

const columns = [
  { field: "type_topic__str", headerName: "Тип", cellClassName: "dataGrid_firstCol", flex: 1 },
  { field: "direction_traning__str", headerName: "Направление", flex: 1 },
  { field: "name", headerName: "Название", flex: 1 },
  { field: "status__str", headerName: "Статус", witdh: 200 },
  { field: "count_users", headerName: "Количество участников", witdh: 100 },
];

export default function ConfirmTopics() {
  const [topics, setTopics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedTopic, setSelectTopic] = useState([]);
  const notifyes = useSelector((state) => state.auth.notificates);
  const dispatch = useDispatch();

  useEffect(() => {
    FetchApi(`api/profile/topics?id_status=2,3&is_confirmed=true`, dispatch, "Ошибка получения списка тем", "get")
      .then(({ topics, logs }) => {
        setTopics(topics);
        setLogs(logs);
      })
      .catch(() => {});
  }, [notifyes]);

  const onHangeSelectRow = (rows) => {
    if (selectedTopic[0] === rows[0]) {
      setSelectTopic([]);
    } else {
      setSelectTopic(rows);
    }
  };

  const changeTopic = () => {
    let currentTopic = topics.find((item) => item.id === selectedTopic[0]);
    let logsTopic = logs.find((item) => item.topic === selectedTopic[0]);
    dispatch(setOpenDrawer({ ...currentTopic, disabled: true, logs: logsTopic }));
  };

  return (
    <div className="MyTopics_wrap">
      <div className="MyTopics_wrap__header">
        <h1>Распределенные темы</h1>
        <div>
          {selectedTopic.length ? (
            <button type="button" className="opacity-button bg--green color--green" onClick={changeTopic}>
              Данные темы
            </button>
          ) : null}
        </div>
      </div>
      {console.log("ZZZ", logs)}
      <div className="MyTopics_wrap__content">
        <div className="MyTopics_wrap__content__dataGrid" style={{ gridColumn: "span 5" }}>
          <DataGrid
            rows={topics}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onRowSelectionModelChange={onHangeSelectRow}
            rowSelectionModel={selectedTopic}
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
