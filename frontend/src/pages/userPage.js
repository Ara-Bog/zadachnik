import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";

import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function UserPage() {
  const currentUser = useSelector((store) => store.auth.userData);
  const [user, setUser] = useState({});
  const [topics, setTopics] = useState({});
  const [topicsDistributed, setTopicsDistributed] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [valueTab, setValueTab] = useState("1");
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const [accordionSelect, setAccordionSelect] = useState("");
  const handleChangeAccordion = (panel) => (event, newValue) => {
    setAccordionSelect(newValue ? panel : false);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get(`api/users/${id}`);
        setUser(response.data.user);
        setTopics(response.data.topics_data);
        setTopicsDistributed(response.data.topics_distributed);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [id]);
  return (
    !loading && (
      <div className="userPage_wrap">
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
                <TabList
                  onChange={handleChangeTab}
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#F84F39", // Цвет индикатора
                    },
                    "& .MuiButtonBase-root.Mui-selected": {
                      color: "#26253B", // Цвет текста активного таба
                    },
                    "& .MuiButtonBase-root": {
                      fontSize: 18,
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: "#667085",
                      fontFamily: "TT Interfaces",
                      textTransform: "none",
                    },
                  }}
                >
                  <Tab label="Активные" value="1" />
                  <Tab label="Завершенные" value="2" />
                </TabList>
              </div>
            </div>
          </div>
          <TabPanel value="1" sx={{ gap: "20px", padding: 0, display: "grid" }}>
            {Object.keys(topics).map((key, indx) => (
              <div className="userPage_wrap__card" key={indx}>
                <h2>{key}</h2>
                <div>
                  {topics[key].map((item, indxItem) => (
                    <Accordion
                      key={indxItem}
                      expanded={accordionSelect === `1-${indx}-${indxItem}`}
                      onChange={handleChangeAccordion(`1-${indx}-${indxItem}`)}
                      sx={{
                        boxShadow: "none",
                        paddingTop: "13px",
                        paddingBottom: "13px",
                        "&.MuiAccordion-root.Mui-expanded::before": {
                          opacity: 1,
                          backgroundColor: "#EAECF0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          fontFamily: "TT Interfaces",
                          fontSize: "20px",
                          fontWeight: 500,
                          lineHeight: "22px",
                        }}
                      >
                        {item.name}
                      </AccordionSummary>
                      {item.discription && (
                        <AccordionDetails
                          sx={{
                            fontFamily: "TT Interfaces",
                            fontSize: "20px",
                            fontWeight: 400,
                            lineHeight: "30px",
                          }}
                        >
                          {item.discription}
                        </AccordionDetails>
                      )}
                      {currentUser.id !== user.id && currentUser.is_teacher !== user.is_teacher && (
                        <AccordionActions>
                          <button className="border-button">Откликнутся</button>
                        </AccordionActions>
                      )}
                    </Accordion>
                  ))}
                </div>
              </div>
            ))}
          </TabPanel>
          <TabPanel value="2" sx={{ gap: "20px", padding: 0, display: "grid" }}>
            {Object.keys(topicsDistributed).map((key, indx) => (
              <div className="userPage_wrap__card" key={indx}>
                <h2>{key}</h2>
                <div>
                  {topicsDistributed[key].map((item, indxItem) => (
                    <Accordion
                      key={indxItem}
                      expanded={accordionSelect === `2-${indx}-${indxItem}`}
                      onChange={handleChangeAccordion(`2-${indx}-${indxItem}`)}
                      sx={{
                        boxShadow: "none",
                        paddingTop: "13px",
                        paddingBottom: "13px",
                        "&.MuiAccordion-root.Mui-expanded::before": {
                          opacity: 1,
                          backgroundColor: "#EAECF0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          fontFamily: "TT Interfaces",
                          fontSize: "20px",
                          fontWeight: 500,
                          lineHeight: "22px",
                        }}
                      >
                        {item.name}
                      </AccordionSummary>
                      {item.discription && (
                        <AccordionDetails
                          sx={{
                            fontFamily: "TT Interfaces",
                            fontSize: "20px",
                            fontWeight: 400,
                            lineHeight: "30px",
                          }}
                        >
                          {item.discription}
                        </AccordionDetails>
                      )}
                    </Accordion>
                  ))}
                </div>
              </div>
            ))}
          </TabPanel>
        </TabContext>
      </div>
    )
  );
}
