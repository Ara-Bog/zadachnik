import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardStudent from "../components/cardStudent";
import CardTeacher from "../components/cardTeacher";
import FetchApi from "../services/fetchApi";

export default function ListTopics({ type }) {
  const [topics, setTopics] = useState(null);
  const [currentType, setCurrentType] = useState(type);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    FetchApi(`api/topics/${type}`, dispatch, "Ошибка получения списка тем")
      .then((data) => {
        setCurrentType(type);
        setTopics(processData(data, userData));
      })
      .catch(() => {});
  }, [type, userData.name]);

  const processData = (data, userData) => {
    if (!userData.is_teacher && type !== "project" && data.length > 0) {
      data.forEach((item) => {
        item.tags = item.topics_data.reduce((accum, item) => new Set([...accum, ...item.tags]), new Set());
      });
    }
    return data;
  };

  return (
    <div className="list_wrap">
      {topics && currentType === type && (
        <>
          {!topics.length && <h2>На данный момент, в разделе отсутствуют темы</h2>}
          {topics.map((item, indx) =>
            userData.is_teacher || type === "project" ? <CardStudent key={item.id} data={item} /> : <CardTeacher key={item.id} data={item} />
          )}
        </>
      )}
    </div>
  );
}
