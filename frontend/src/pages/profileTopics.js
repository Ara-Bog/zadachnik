import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { STYLE_DATA_GRID_DEFAULT } from "../settings/styleDataGrid";
import axiosInstance from "../services/axiosInstance";
import Feedbacks from "../components/notifyesRows";

const columns = [
  { field: "name", headerName: "Название", cellClassName: "dataGrid_firstCol", flex: 1 },
  { field: "direction_traning", headerName: "Направление", flex: 1 },
  { field: "type_topic", headerName: "Тип", flex: 1 },
  {
    field: "feedback",
    headerName: "Отклики",
    width: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div
        style={{
          padding: "2px 10px",
          borderRadius: "16px",
          alignSelf: "center",
          ...(params.value ? { color: "#F84F39", backgroundColor: "#F84F3926" } : { backgroundColor: "#F3F2FA" }),
        }}
      >
        {params.value}
      </div>
    ),
  },
];

export default function ProfileTopics({ isDistributed = false }) {
  const currentUser = useSelector((store) => store.auth.userData);
  const [topics, setTopics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedTopic, setSelectTopic] = useState([]);
  const notifyes = useSelector((state) => state.auth.notificates);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get(`api/profile/topics/${isDistributed + 1}`);
        setTopics(response.data.topics);

        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [notifyes, isDistributed]);

  const filter = (currentRow) => {
    if (!currentRow) {
      setFilteredLogs([]);
    } else {
      let newList = logs.filter((item) => item.topic_id === currentRow);
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

  useEffect(() => {
    filter(selectedTopic[0]);
  }, [logs]);

  return (
    <div>
      <div>
        <h1>Созданные темы</h1>
        <button href="#" className="opacity-button bg--red color--orange">
          {currentUser.is_teacher ? "Изменить список тем" : "Добавить тему"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "40px" }}>
        <div>
          <DataGrid
            rows={topics}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onRowSelectionModelChange={onHangeSelectRow}
            rowSelectionModel={selectedTopic}
            pageSizeOptions={[]}
            autoHeight
            sx={STYLE_DATA_GRID_DEFAULT}
            hideFooterSelectedRowCount={true}
          />
        </div>
        <div>
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
