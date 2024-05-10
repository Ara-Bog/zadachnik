import TopicHeader from "./topicHeader";

export default function CardStudent({ data }) {
  return (
    <a href={`/topic/${data.id}`} className="card">
      <TopicHeader {...data} />
      <div className="card__tags">
        {data.tags.map((item, indx) => (
          <span key={indx}>{item}</span>
        ))}
      </div>
      <div className="card__content">
        <h3>{data.name}</h3>
        <p>{data.discription}</p>
      </div>
    </a>
  );
}
