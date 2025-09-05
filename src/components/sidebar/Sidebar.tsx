import styles from "./sidebar.module.scss";
import arrowRight from "../../assets/chevron-right.svg";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useIdCharacter } from "../../store/GetIdCharacter";
import { useEffect, useRef, useState } from "react";
import loadingSpinner from "../../assets/Loading_spinner.png";

type Character = {
  id: string;
  name: string;
  species: string;
};

type Data = {
  characters: Info;
};

type Info = {
  results: Character[];
  info: {
    count: number;
    pages: number;
    next: string;
  };
};

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
`;

export const Sidebar = () => {
  const { selectedIdCharacter } = useIdCharacter();
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, fetchMore } = useQuery<Data>(LIST, {
    variables: { page: 1 },
    notifyOnNetworkStatusChange: true,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && data?.characters.info.next && !loading) {
          const nextPage = currentPage + 1;
          fetchMore({
            variables: { page: nextPage },
          }).then(() => {
            setCurrentPage(nextPage);
          });
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [data?.characters.info.next, fetchMore, currentPage, loading]);

  if (error) return <p className={styles.errorHandle}>Failed to Load Data</p>;

  return (
    <div className={styles.container}>
      {data?.characters.results.map((character: Character) => {
        return (
          <button
            className={styles.cardContent}
            key={character.id}
            onClick={() => selectedIdCharacter(character.id)}
          >
            <div className={styles.textContainer}>
              <h3 className={styles.textTitle}>{character.name}</h3>
              <p className={styles.textSubtitle}>{character.species}</p>
            </div>
            <img
              src={arrowRight}
              alt="arrow-right"
              className={styles.iconCard}
            />
          </button>
        );
      })}
      <div ref={loaderRef}>
        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinnerContainer}>
              <img
                src={loadingSpinner}
                alt="loading"
                className={styles.spinnerIcon}
              />
              <p className={styles.spinnerText}>Loading</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
