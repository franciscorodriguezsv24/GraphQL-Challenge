import styles from './characterinfo.module.scss'
import { gql,  } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useIdCharacter } from '../../store/GetIdCharacter'
import  logo  from '../../assets/r&m.svg'
type CharacterData = {
    character: {
        id: string;
        image: string;
        name: string;
        species: string;
        status: string;
        gender: string;
        origin: Origin;
        location: Location;
        episode: Episode[];
    }
}

type Origin = {
    name: string;
}

type Location = {
    id: string;
    name: string;
    type: string
}

type Episode = { 
    id: string;
    name: string;
    air_date: string
}

const CHARACTER = gql`
    query character($id: ID!) {
        character(id: $id) {
            id
            image
            name
            species
            status
            gender
        origin {
            name
            }
        location {
            id
            name
            type
            }
        episode {
            id
            name
            air_date
            }

        }
    }
`
export const CharacterInfo = () => {

    const { id } = useIdCharacter()
    const { data, loading } = useQuery<CharacterData>(CHARACTER, {
        variables: { id }
    })
    if (loading) return <p>Loading List...</p>

    console.log(data, id)

    const character = data?.character

    if(!data?.character) return <Preview/>


  return (
    <div className={styles.characterInfoContainer}>
        <div className={styles.generalInfo}>
            <h2>General Information</h2>
            <div className={styles.container}>
                <div className={styles.imgContainer}>
                    <div className={styles.containerInfoImg}>
                        <img src={character?.image} alt='testing-img' className={styles.imgCharacter}/>
                    </div>
                    <div>
                        <div className={styles.containerInfo}>
                            <p className={styles.titleInfo}>Name:</p>
                            <p className={styles.infoText}>{character?.name}</p>
                        </div>
                        <div className={styles.containerInfo}>
                            <p className={styles.titleInfo}>Species:</p>
                            <p className={styles.infoText}>{character?.species}</p>
                        </div>
                        <div className={styles.containerInfo}>
                            <p className={styles.titleInfo}>status:</p>
                            <p className={styles.infoText}>{character?.status}</p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.containerInfo}>
                    <p className={styles.titleInfo}>Gender:</p>
                    <p className={styles.infoText}>{character?.gender}</p>
                </div>
                <div className={styles.containerInfo}>
                    <p className={styles.titleInfo}>Location:</p>
                    <p className={styles.infoText}>{character?.location.name}</p>
                </div>
                <div className={styles.containerInfo}>
                    <p className={styles.titleInfo}>Origin:</p>
                    <p className={styles.infoText}>{character?.origin.name}</p>
                </div>
            </div>
        </div>
        <div className={styles.episodesContainer}>
            <h2>Episodes</h2>
            {
                character?.episode.slice(0, 5).map((e) => {
                    return(
                        <div className={styles.containerInfo} key={e.id}>
                            <p className={styles.titleInfo}>{e.name}</p>
                            <p className={styles.infoText}>{e.air_date}</p>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

const Preview = () => {

    return(
        <div className={styles.pendingData}>
            
            <p>Selecciona un personaje.</p>
            <img src={logo} alt='logo-R&M' className={styles.imgLogo}/>
        </div>
    )
}
