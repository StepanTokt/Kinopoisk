import './ActorCard.css'

const ActorCard =({actor})=>{
	return (
    <div className="actor_card">
      <img src={actor.photo} className="actor_photo" alt="" />
      <p className="actor_name">{actor.name}</p>
    </div>
  );
}

export default ActorCard