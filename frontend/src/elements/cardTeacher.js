import TopicHeader from "./topicHeader";

export default function CardTeacher({ data }) {
  return (
    <a href={`/user/${data.id}`} className="card">
      <TopicHeader {...data} />
      <div className="card__tags">
        {[...data.tags].map((item, indx) => (
          <span key={indx}>{item}</span>
        ))}
      </div>
      <div className="card__content card__content--teacher">
        {data.topics_data.map((item, indx) => (
          <h3 key={indx}>
            {indx + 1}. {item.name}
          </h3>
        ))}
      </div>
    </a>
  );
}
