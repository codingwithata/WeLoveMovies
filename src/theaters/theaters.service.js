const knex = require("../db/connection");

function getAllTheaters() {
  return knex("theaters as t")
    .join("movies_theaters as  mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("*")
    .then((data) => {
      const formattedData = data.reduce((acc, dataItem) => {
        const foundItem = acc.find((entry) => entry.theater_id === dataItem.theater_id);
        const newMovie = {
          movie_id: dataItem.movie_id,
          title: dataItem.title,
          runtime_in_minutes: dataItem.runtime_in_minutes,
          rating: dataItem.rating,
          description: dataItem.description,
          image_url: dataItem.image_url,
          is_showing: dataItem.is_showing,
          theater_id: dataItem.theater_id,
        };

        if (!foundItem) {
          acc.push({
            theater_id: dataItem.theater_id,
            name: dataItem.name,
            address_line_1: dataItem.address_line_1,
            address_line_2: dataItem.address_line_2,
            city: dataItem.city,
            state: dataItem.state,
            zip: dataItem.zip,
            movies: [newMovie],
          });
        } else {
          foundItem.movies.push(newMovie);
        }

        return acc;
      }, []);

      return formattedData;
    });
}

function list() {
  return getAllTheaters();
}

module.exports = {
  list,
};
