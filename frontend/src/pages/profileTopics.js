import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { STYLE_DATA_GRID_DEFAULT } from "../settings/styleMUI";
import Feedbacks from "../components/notifyesRows";
import FetchApi from "../services/fetchApi";
import { setOpenDrawer } from "../services/actionsSlice";

const columns = [
  { field: "name", headerName: "Название", cellClassName: "dataGrid_firstCol", flex: 1 },
  { field: "direction_traning__str", headerName: "Направление", flex: 1 },
  { field: "type_topic__str", headerName: "Тип", flex: 1 },
  {
    field: "feedback",
    headerName: "Отклики",
    width: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        className="dataGrid-cell_feedback"
        style={{
          ...(params.value ? { color: "#F84F39", backgroundColor: "#F84F3926" } : { backgroundColor: "#F3F2FA" }),
        }}
      >
        {params.value}
      </div>
    ),
  },
];

export default function ProfileTopics() {
  const [topics, setTopics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedTopic, setSelectTopic] = useState([]);
  const notifyes = useSelector((state) => state.auth.notificates);
  const dispatch = useDispatch();

  useEffect(() => {
    FetchApi(`api/profile/topics?id_status=1`, dispatch, "Ошибка получения списка тем", "get")
      .then(({ topics, logs }) => {
        setTopics(topics);
        setLogs(logs);
      })
      .catch(() => {});
  }, [notifyes]);

  const filter = (currentRow) => {
    if (!currentRow) {
      setFilteredLogs([]);
    } else {
      let newList = logs.filter((item) => item.topic === currentRow);
      setFilteredLogs(newList);
    }
  };

  const onHangeSelectRow = (rows) => {
    if (selectedTopic[0] === rows[0]) {
      setSelectTopic([]);
      setFilteredLogs([]);
    } else {
      setSelectTopic(rows);
      filter(rows[0]);
    }
  };

  const changeTopic = () => {
    let currentTopic = topics.find((item) => item.id === selectedTopic[0]);
    dispatch(setOpenDrawer(currentTopic));
  };

  useEffect(() => {
    filter(selectedTopic[0]);
  }, [logs]);

  return (
    <div className="MyTopics_wrap">
      <div className="MyTopics_wrap__header">
        <h1>Созданные темы</h1>
        <div>
          {selectedTopic.length ? (
            <button type="button" className="opacity-button bg--red color--orange" onClick={changeTopic}>
              Изменить тему
            </button>
          ) : null}
          <button type="button" className="opacity-button bg--green color--green" onClick={() => dispatch(setOpenDrawer())}>
            Добавить тему
          </button>
        </div>
      </div>
      <div className="MyTopics_wrap__content">
        <div className="MyTopics_wrap__content__dataGrid">
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
        <div className="MyTopics_wrap__content__feedback">
          <span>Лента откликов</span>
          <div className="notifyList">
            <Feedbacks
              data={filteredLogs}
              isExtended
              label={selectedTopic.length ? "По данной теме отсутствуют отклики" : "Выберите тему, чтобы посмотреть ленту"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
