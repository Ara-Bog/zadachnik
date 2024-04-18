import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import TopicHeader from "../elements/topicHeader";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function TopicPage() {
  const [topic, setTopic] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store.auth.userData);
  const { id } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get(`api/topic/${id}`);
        setTopic(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [id]);
  console.log("ZXC", topic);
  return (
    !loading && (
      <div className="topic">
        <NavLink to={`/user/${topic.user_id}`} style={{ color: "inherit" }}>
          <TopicHeader {...topic} />
        </NavLink>
        <div className="topic__name">
          <span>{topic.type_topic}</span>
          <h1>{topic.name}</h1>
        </div>
        <div className="topic__tags">
          {topic.tags.map((item, indx) => (
            <span key={indx}>{item}</span>
          ))}
        </div>
        <p>{topic.discription}</p>
        {user.id !== topic.user_id && user.is_teacher && (
          <button className="border-button" style={{ alignSelf: "flex-end" }}>
            Откликнуться
          </button>
        )}
      </div>
    )
  );
}
