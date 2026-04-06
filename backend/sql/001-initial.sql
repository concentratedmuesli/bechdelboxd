Create table Films (
  id INT PRIMARY KEY,
  imdbid VARCHAR(255) NOT NULL,
  rating SMALLINT NOT null check(
    rating >= 0
    AND rating < 4
  ),
  title VARCHAR(255) NOT NULL,
  year INT NOT null,
  introduced_at TIMESTAMP default now()
)