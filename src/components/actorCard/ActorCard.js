import styles from '../../styles/ActorCard.module.css'
import Image from "next/image";

const ActorCard =({actor})=>{
	return (
    <div className="actor_card">
      <Image src={actor.photo} className={styles.actor_photo} alt="" width={160} height={228.57}/>
      <p className={styles.actor_name}>{actor.name}</p>
    </div>
  );
}
export default ActorCard