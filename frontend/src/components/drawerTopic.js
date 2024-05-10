import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Chip, Select, TextField, Autocomplete, MenuItem, CircularProgress } from "@mui/material";
import { STYLE_ELEMENTS, STYLE_DRAWER } from "../settings/styleMUI";
import CloseIcon from "@mui/icons-material/Close";
import DialogComponent from "./dialog";
import { clearDrawer, closeLoading } from "../services/actionsSlice";
import FetchApi from "../services/fetchApi";

const TAGS = ["Python", "SQL", "Django", "JavaScript", "Java", "C#", "Web"];

export default function DrawerTopic() {
  const currentUser = useSelector((store) => store.auth.userData);
  const actions = useSelector((store) => store.actions);
  const [data, setData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (actions.openDrawer) {
      setData({ ...actions.drawerData, ...(currentUser.is_teacher ? {} : { direction_traning: currentUser.direction_traning }) });
    }
  }, [actions.openDrawer, actions.drawerData]);

  const handeChange = (filed, value) => {
    setData((prev) => ({ ...prev, [filed]: value }));
  };

  const handeClose = () => {
    setOpenDialog(true);
  };

  const handleArchive = () => {
    FetchApi(`api/change_status/`, dispatch, "Ошибка архивирования темы", "put", { topic_id: data.id, status_id: 3 })
      .then(() => {
        dispatch(clearDrawer());
        window.location.reload();
      })
      .catch(() => {});
  };

  const handleActivate = () => {
    FetchApi(`api/change_status/`, dispatch, "Ошибка активации темы", "put", { topic_id: data.id, status_id: 1 })
      .then(() => {
        dispatch(clearDrawer());
        window.location.reload();
      })
      .catch(() => {});
  };

  const handleCloseDialog = (val) => {
    setOpenDialog(false);
    if (val) {
      dispatch(clearDrawer());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let requestType = "post";
    let errorLabel = "Ошибка создания новой темы";
    if (data.id) {
      requestType = "put";
      errorLabel = "Ошибка изменения темы";
    }
    FetchApi(`api/profile/topics/`, dispatch, errorLabel, requestType, data)
      .then(() => {
        dispatch(clearDrawer());
        window.location.reload();
      })
      .catch(() => {});
  };

  return (
    <>
      <Drawer open={actions.openDrawer} onClose={handeClose} anchor="right" sx={STYLE_DRAWER}>
        {data && (
          <form className="default_form" style={{ width: "500px" }} onSubmit={handleSubmit}>
            <input name="id" readOnly value={data.id || ""} style={{ display: "none" }} />
            <input name="status" readOnly value={data.status || ""} style={{ display: "none" }} />
            {!data.disabled && data.id && (
              <div>
                {data.status === 1 && (
                  <button
                    type="button"
                    className="opacity-button bg--red color--orange"
                    style={{ width: "auto", justifyContent: "center", padding: "10px" }}
                    onClick={handleArchive}
                  >
                    Архивировать тему
                  </button>
                )}
                {data.status === 3 && (
                  <button
                    type="button"
                    className="opacity-button bg--red color--orange"
                    style={{ width: "auto", justifyContent: "center", padding: "10px" }}
                    onClick={handleActivate}
                  >
                    Активировать тему
                  </button>
                )}
              </div>
            )}
            {true && (
              <>
                <div className="default_form__row">
                  <span>Направление подготовки</span>
                  <Select
                    id="direction_select"
                    value={data.direction_traning}
                    required={currentUser.is_teacher}
                    disabled={data.disabled}
                    autoWidth={false}
                    sx={STYLE_ELEMENTS}
                    onChange={(event) => {
                      handeChange("direction_traning", event.target.value);
                    }}
                  >
                    {actions.drawerData__directionsTraning.map((item, indx) => (
                      <MenuItem key={indx} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </>
            )}
            <div className="default_form__row">
              <span>Тип задачи</span>
              <Select
                id="type_select"
                value={data.type_topic}
                required
                disabled={data.disabled}
                autoWidth={false}
                sx={STYLE_ELEMENTS}
                onChange={(event) => {
                  handeChange("type_topic", event.target.value);
                }}
              >
                {actions.drawerData__typesTopic.map((item, indx) => (
                  <MenuItem key={indx} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="default_form__row">
              <span>Заголовок</span>
              <input id="name" disabled={data.disabled} required value={data.name} onChange={(el) => handeChange("name", el.target.value)} />
            </div>
            <div className="default_form__row">
              <span>Описание</span>
              <textarea
                id="discription"
                disabled={data.disabled}
                value={data.discription || ""}
                onChange={(el) => handeChange("discription", el.target.value)}
              />
            </div>
            <div className="default_form__row">
              <span>Теги</span>
              <Autocomplete
                multiple
                id="tags-filled"
                options={TAGS}
                disabled={data.disabled}
                freeSolo
                value={data.tags || []}
                sx={STYLE_ELEMENTS}
                onChange={(_, val) => handeChange("tags", val)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="filled" deleteIcon={<CloseIcon />} label={option} sx={STYLE_ELEMENTS} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            {data.type_topic === 3 && (
              <div className="default_form__row">
                <span>Количество участников</span>
                <input
                  id="count_users"
                  type="number"
                  disabled={data.disabled}
                  min={1}
                  max={10}
                  value={data.count_users}
                  onChange={(el) => handeChange("count_users", el.target.value || 1)}
                />
              </div>
            )}
            {!data.disabled && (
              <div className="default_form__footer">
                <button type="submit" className="opacity-button bg--green color--green">
                  Сохранить изменения
                </button>
                <button type="button" className="opacity-button bg--red color--orange" onClick={handeClose}>
                  Отмена
                </button>
              </div>
            )}
          </form>
        )}
      </Drawer>
      <DialogComponent
        openDialog={openDialog}
        dialogData={{
          label: "Подтвердите действие",
          text: "Все не сохраненные данные будут утеряны, Вы действительно хотите выйти ?",
        }}
        callback={handleCloseDialog}
      />
    </>
  );
}
