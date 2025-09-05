import styles from './sidebar.module.scss'
import arrowRight from '../../assets/chevron-right.svg'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useIdCharacter } from '../../store/GetIdCharacter'
import { useEffect, useRef } from 'react'
type Character = {
    id: string;
    name: string;
    species: string
}

type Data = {
    characters: Info
}

type Info = {
    results: Character[]
    info: {
        count: number
        pages: number
        next: string
    }
}

const LIST = gql`
    query list($page: Int) {
        characters(page: $page) {
        info {
            count
            pages
            next
        }
        results {
            id
            name
            species
        }
    }
}
`

export const Sidebar = () => {
    const { selectedIdCharacter } = useIdCharacter()

    const {loading, error, data, fetchMore } = useQuery<Data>(LIST, {
        variables: { page: 1 },
        notifyOnNetworkStatusChange: true,
    });

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            const first = entries[0];
            if (first.isIntersecting && data?.characters.info.next) {
            fetchMore({
                variables: { page: data.characters.info.next },
            });
            }
        },
        { threshold: 1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [data?.characters.info.next, fetchMore]);

    if(error) return <p className={styles.errorHandle}>Failed to Load Data</p>

    return (
    <div className={styles.container}>

        {
            data?.characters.results.map((character: Character) => {
                return(
                    <button className={styles.cardContent} key={character.id} onClick={() => selectedIdCharacter(character.id)} >
                        <div className={styles.textContainer}>
                            <h3 className={styles.textTitle}>
                                {character.name}
                            </h3>
                            <p className={styles.textSubtitle}>
                                {character.species}
                            </p>
                        </div>
                        <img src={arrowRight} alt='arrow-right' className={styles.iconCard}/>
                    </button>
                )
            })
        }
        <div className={styles.cardContent}>
            <div ref={loaderRef} className={styles.loader}>
                {loading && <p>Cargando más...</p>}
            </div>
        </div>
    </div>
    )
}
