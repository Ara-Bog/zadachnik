import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FetchApi from "../services/fetchApi";

import { TabPanel, TabContext, TabList } from "@mui/lab";
import { Tab, Accordion, AccordionActions, AccordionSummary, AccordionDetails, Avatar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { STYLE_TABS, STYLE_ACCORDION } from "../settings/styleMUI";

export default function UserPage() {
  const currentUser = useSelector((store) => store.auth.userData);
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState({});
  const [topicsDistributed, setTopicsDistributed] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();

  const [valueTab, setValueTab] = useState("1");
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const [accordionSelect, setAccordionSelect] = useState("");
  const handleChangeAccordion = (panel) => (event, newValue) => {
    setAccordionSelect(newValue ? panel : false);
  };

  useEffect(() => {
    FetchApi(`api/users/${id}`, dispatch, "Ошибка получения информации пользователя")
      .then(({ user, topics_data, topics_distributed }) => {
        setUser(user);
        setTopics(topics_data);
        setTopicsDistributed(topics_distributed);
      })
      .catch(() => {});
  }, [id]);

  const handleFeedback = () => {};

  return (
    <div className="userPage_wrap">
      {user && (
        <TabContext value={valueTab}>
          <div className="userPage_wrap__header">
            <div className="userPage_wrap__header__avatar">
              <Avatar src={`http://localhost:8000${user.avatar}`} sx={{ width: 130, height: 130, border: "6px solid #fff", fontSize: 60 }}>
                {`${user.user[0]}${user.user.split(" ")[1][0]}`}
              </Avatar>
            </div>
            <div className="userPage_wrap__header__content">
              <div className="userPage_wrap__header__content__info">
                <span>{user.user}</span>
                <p>
                  {user.is_teacher ? "Преподаватель" : "Студент"}
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
              </div>
              <span className="serializer"></span>
              <p style={{ opacity: user.discription ? 1 : 0.4 }}>{user.discription || "Пользователь не оставил о себе информации :("}</p>
              <div>
                <TabList onChange={handleChangeTab} sx={STYLE_TABS}>
                  <Tab label="Активные" value="1" />
                  <Tab label="Завершенные" value="2" />
                </TabList>
              </div>
            </div>
          </div>
          <TabPanel value="1" sx={{ gap: "20px", padding: 0, display: "grid" }}>
            {Object.keys(topics).length ? (
              Object.keys(topics).map((key, indx) => (
                <div className="userPage_wrap__card" key={indx}>
                  <h2>{key}</h2>
                  <div>
                    {topics[key].map((item, indxItem) => (
                      <Accordion
                        key={indxItem}
                        expanded={accordionSelect === `1-${indx}-${indxItem}`}
                        onChange={handleChangeAccordion(`1-${indx}-${indxItem}`)}
                        sx={STYLE_ACCORDION}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={STYLE_ACCORDION}>
                          {item.name}
                        </AccordionSummary>
                        {item.discription && <AccordionDetails sx={STYLE_ACCORDION}>{item.discription}</AccordionDetails>}
                        {currentUser.id !== user.id && currentUser.is_teacher !== user.is_teacher && (
                          <AccordionActions>
                            <button className="border-button" onClick={() => handleFeedback(item.id)}>
                              Откликнутся
                            </button>
                          </AccordionActions>
                        )}
                      </Accordion>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="userPdage-no_content">Здесь еще нет публикаций</div>
            )}
          </TabPanel>
          <TabPanel value="2" sx={{ gap: "20px", padding: 0, display: "grid" }}>
            {Object.keys(topicsDistributed).length ? (
              Object.keys(topicsDistributed).map((key, indx) => (
                <div className="userPage_wrap__card" key={indx}>
                  <h2>{key}</h2>
                  <div>
                    {topicsDistributed[key].map((item, indxItem) => (
                      <Accordion
                        key={indxItem}
                        expanded={accordionSelect === `2-${indx}-${indxItem}`}
                        onChange={handleChangeAccordion(`2-${indx}-${indxItem}`)}
                        sx={STYLE_ACCORDION}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={STYLE_ACCORDION}>
                          {item.name}
                        </AccordionSummary>
                        {item.discription && <AccordionDetails sx={STYLE_ACCORDION}>{item.discription}</AccordionDetails>}
                      </Accordion>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="userPdage-no_content">Здесь еще нет публикаций</div>
            )}
          </TabPanel>
        </TabContext>
      )}
    </div>
  );
}
