import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopicHeader from "../elements/topicHeader";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import FetchApi from "../services/fetchApi";

export default function TopicPage() {
  const [topic, setTopic] = useState(null);
  const user = useSelector((store) => store.auth.userData);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    FetchApi(`api/topic/${id}`, dispatch, "Ошибка получения страницы")
      .then((data) => {
        setTopic(data);
      })
      .catch(() => {});
  }, [id]);

  const actionFeedback = () => {
    const data = {
      topic: topic.id,
      user_from: user.id,
      user_to: topic.user_id,
      action: 1,
    };

    FetchApi("api/logger", dispatch, "Ошибка при отклике", "post", data)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  return (
    <div className="topic">
      {topic && (
        <>
          <NavLink to={`/user/${topic.user_id}`} style={{ color: "inherit" }}>
            <TopicHeader {...topic} />
          </NavLink>
          <div className="topic__name">
            <span>{topic.type_topic__str}</span>
            <h1>{topic.name}</h1>
          </div>
          <div className="topic__tags">
            {topic.tags.map((item, indx) => (
              <span key={indx}>{item}</span>
            ))}
          </div>
          <p>{topic.discription}</p>
          {user.id !== topic.user_id && (user.is_teacher || topic.type_topic === 3) && (
            <button className="border-button" style={{ alignSelf: "flex-end" }} onClick={actionFeedback}>
              Откликнуться
            </button>
          )}
        </>
      )}
    </div>
  );
}
