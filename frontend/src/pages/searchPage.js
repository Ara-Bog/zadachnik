import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import FetchApi from "../services/fetchApi";
import { useDispatch, useSelector } from "react-redux";
import CardStudent from "../elements/cardStudent";
import CardTeacher from "../elements/cardTeacher";
import { CircularProgress } from "@mui/material";

export default function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData.name) return;
    FetchApi(`api/search?q=${query}`, dispatch, "Ошибка поиска")
      .then((data) => {
        setTopics(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, userData.name]);

  return (
    <div className="list_wrap">
      {loading ? (
        <div className="loading_wrap">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h2>Поиск по "{query}"</h2>
          {!topics.length && <h2>Ничего не найдено по запросу</h2>}
          {topics.map((item, indx) => (
            <CardStudent key={indx} data={item} />
          ))}
        </>
      )}
    </div>
  );
}
