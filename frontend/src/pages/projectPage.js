import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, ruRU, GridActionsCellItem } from "@mui/x-data-grid";
import { STYLE_DATA_GRID_DEFAULT } from "../settings/styleMUI";
import FetchApi from "../services/fetchApi";
import { useParams } from "react-router-dom";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { setOpenDrawer } from "../services/actionsSlice";
import Feedbacks from "../components/notifyesRows";
import { Avatar } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DialogComponent from "../components/dialog";

export default function ProjectPage() {
  const [topic, setTopic] = useState(null);
  const [requests, setRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [team, setTeam] = useState([]);
  const [idDeleteUser, setIdDeleteUser] = useState(null);
  const notifyes = useSelector((state) => state.auth.notificates);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleDeleteUser = (id) => {
    setOpenDialog(true);
    setIdDeleteUser(id);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "От",
      cellClassName: "dataGrid_firstCol",
      flex: 1,
      renderCell: (params) => (
        <div className="topic__header">
          <Avatar src={`http://localhost:8000${params.value}`} sx={{ width: 40, height: 40, color: "#fff !important" }}>
            {`${params.row.user_to__str[0]}${params.row.user_to__str.split(" ")[1][0]}`}
          </Avatar>
          <div className="topic__header__user">
            <span>{params.row.user_to__str}</span>
          </div>
        </div>
      ),
    },
    {
      field: "action",
      type: "actions",
      headerName: "Исключить",
      width: 100,
      getActions: (params) => [<GridActionsCellItem icon={<CloseRoundedIcon />} label="Исплючить" onClick={() => handleDeleteUser(params.row.id)} />],
    },
  ];

  useEffect(() => {
    FetchApi(`api/topic/${id}`, dispatch, "Ошибка страницы проекта", "get")
      .then((data) => {
        setTopic(data);
      })
      .catch(() => {});
    FetchApi(`api/logger/${id}`, dispatch, "Ошибка страницы проекта", "get")
      .then((data) => {
        let req = [];
        let team = [];
        data.forEach((item) => (item.action === 2 ? team.push(item) : req.push(item)));
        setRequests(req);
        setTeam(team);
      })
      .catch(() => {});
  }, [id, notifyes]);

  const changeTopic = () => {
    dispatch(setOpenDrawer(topic));
  };

  const handleCloseDialog = (action) => {
    if (action) {
      FetchApi(`api/logger/${idDeleteUser}`, dispatch, "Ошибка страницы проекта", "delete")
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
    }
    setOpenDialog(false);
  };

  return (
    <div className="MyTopics_wrap">
      {topic && (
        <>
          <div className="MyTopics_wrap__header">
            <h1>{topic.name}</h1>
            <button type="button" className="opacity-button bg--red color--orange" onClick={changeTopic}>
              Изменить
            </button>
          </div>
          <div className="MyTopics_wrap__subHeader">
            <p>{topic.discription}</p>
            <div className="topic__tags">
              {topic.tags.map((item, indx) => (
                <span key={indx}>{item}</span>
              ))}
            </div>
          </div>
          <div className="MyTopics_wrap__content">
            <div className="MyTopics_wrap__content__dataGrid">
              <div className="MyTopics_wrap__content__dataGrid__header">
                <span>Команда</span>
                <div className="topic__header__counter">
                  <PersonOutlineRoundedIcon sx={{ width: 20, height: 20 }} />
                  {`${topic.select_users} из ${topic.count_users}`}
                </div>
              </div>
              <DataGrid
                rows={team}
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
            <div className="MyTopics_wrap__content__feedback">
              <span>Лента откликов</span>
              <div className="notifyList">
                <Feedbacks data={requests} isExtended label="По данной теме откликов не было" />
              </div>
            </div>
          </div>
        </>
      )}
      <DialogComponent
        openDialog={openDialog}
        dialogData={{
          label: "Подтвердите действие",
          text: "Выдействительно хотите исключить пользователя из команды ?",
        }}
        callback={handleCloseDialog}
      />
    </div>
  );
}
