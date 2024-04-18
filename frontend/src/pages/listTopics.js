import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CardStudent from "../components/cardStudent";
import CardTeacher from "../components/cardTeacher";
import axiosInstance from "../services/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";

export default function ListTopics({ type }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get(`api/topics/${type}`);

        if (!userData.is_teacher) {
          response.data.forEach((item) => (item.tags = item.topics_data.reduce((accum, item) => new Set([...accum, ...item.tags]), new Set())));
        }
        setTopics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    if (userData.name) {
      fetchTopics();
    }
  }, [type, userData]);

  return (
    <div className="list_wrap">
      {loading ? (
        <div className="loading_wrap">
          <CircularProgress />
        </div>
      ) : (
        <>
          {!topics.length && <h2>На данный момент, в разделе отсутствуют темы</h2>}
          {topics.map((item, indx) => (userData.is_teacher ? <CardStudent key={indx} data={item} /> : <CardTeacher key={indx} data={item} />))}
        </>
      )}
    </div>
  );
}
